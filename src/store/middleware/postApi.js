import axios from 'axios'
import { postApiCall } from '../api'
import {userInfoLoaded} from '../user'
import {commentsCleared} from '../comments'


const postApi = ({getState,dispatch})=>next=>async(action)=>{

    let baseURL
    if(process.env.NODE_ENV==='production')
        baseURL=process.env.REACT_APP_ENDPOINT
    console.log('baseURL: ',baseURL);

    if(action.type!==postApiCall.type) return next(action)

    console.log('user name: ', getState().entities.user.name);
    const {url,method,data,onSuccess,onStart,onFail,type,history} = action.payload
    console.log('this is post api middle ware url: ',url);
    if(onStart)
        dispatch({type:onStart})
    try {
        // decide if user is logged in
        if(!getState().entities.user.name){
            const userResponse = await axios.get('/api/user/load',{baseURL})
            dispatch(userInfoLoaded(userResponse.data))
        }
        // like operation
        if(url.search(/toggle_like/)!==-1){
            const {path,id} = action.payload
            let response=''
            console.log('the id: ',id);
            if(path==='commentPage'){
                response = await axios.get(`/api/comments/${url}`,{baseURL})
            }
            else{
                response = await axios.get(`/api/posts/${url}`,{baseURL})
            }
            dispatch({type:onSuccess,payload:{id:id,path:path,name:getState().entities.user.name}})
        }
        else{
            let response='';
            // edit post operation
            if(method==='patch'){
                const config = {
                    headers:{
                        'content-type':'multipart/form-data'
                    },
                    baseURL
                }
                response = await axios.patch(`/api/posts/${url}`,data,config) 
                console.log('response.data :',response.data);
                dispatch({type:onSuccess,payload:response.data})  
            }
            //delete operation
            else if(method==='delete'){
                const {path,id} = action.payload
                console.log(' this is from post api, url: ',url);
                if(path==='commentPage'||path==='postPage'){
                    if(path==='commentPage'){
                        response = await axios.delete(`/api/comments/${url}`,{baseURL})
                    }else if(path==='postPage'){
                        response =await axios.delete(`/api/posts/${url}`,{baseURL})
                    }
                    console.log('response.data:',response.data);
                    dispatch({type:onSuccess,payload:{id:id,path:path,message:response.data.message}})
                    dispatch(commentsCleared())
                    history.push('/home')
                }
                else{
                    response = await axios.delete(`/api/posts/${url}`,{baseURL})
                    console.log('response.data:',response.data);
                    dispatch({type:onSuccess,payload:{id:id,path:path,message:response.data.message}})
                }
            }
            // create new post operation
            else if(method==='post'){
                response = await axios.post(`/api/posts/${url}`,data,{baseURL})
                console.log('response.data: ',response.data);
                dispatch({type:onSuccess,payload:response.data})
            }
            // load posts operations

            else if(method==='get'&&( url ==='/'||url.match(/my_posts|following_posts|user_posts/) )){
                const {limit,cursor} = action.payload
                console.log('this is from postAPI limit and cursor check: ',limit,cursor);
                response = await axios.request({
                    baseURL,
                    url:`/api/posts${url}`,
                    method,
                    params:{
                        limit,
                        cursor,
                        cookie:document.cookie
                    }
                })
                console.log('response.data:',response.data);
                dispatch({type:onSuccess,payload:response.data})
            }
            // search operation
            else if(url.match(/search/)){
                const {limit,query,cursor} = action.payload
                response = await axios.request({
                    baseURL,
                    url:`/api/posts/${url}`,
                    method,
                    params:{
                        limit,
                        query,
                        cursor
                    }
                })
                console.log('the response.data: ',response.data);
                dispatch({type:onSuccess,payload:response.data})
            }
            // other operations
            else{
                response = await axios.request({
                    baseURL,
                    url:`/api/posts/${url}`,
                    method,
                    data,
                    params:{
                        type
                    }
                })
                console.log('response.data:',response.data);
                console.log('onSuccess: ', onSuccess);
                dispatch({type:onSuccess,payload:response.data})
            }
        }
    } catch (error) {
        console.log('error response: ',error.response);
        console.log('error.response.data.message: ',error.response.data.message);
        if(error.response.status===401) history.push('/login')
        else if(error.response.status===404) history.replace('/not_found')
        else if(error.response.status===403) {
            let thePath = history.location.pathname.replace('/edit','')
            history.replace(thePath)
        }
        else{
            if(onFail)
                dispatch({type:onFail,payload:{code:error.response.status,message:error.response.data.message||error.response.statusText}})
        } 
    }
}


export default postApi