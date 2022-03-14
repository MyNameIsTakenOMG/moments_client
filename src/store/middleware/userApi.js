import {userApiCall} from '../api'
import {postsDataCleared} from '../posts'
import {commentsCleared} from '../comments'
import { statusCleared, userInfoLoaded } from '../user'
import axios from 'axios'

const userApi = ({dispatch,getState})=>next=> async action=>{
    console.log('this is userApi middleware in the frontend...');
    let baseURL='https://api.momentsapp.zhengfangdev.com'
    // if(process.env.NODE_ENV==='production')
    //     baseURL=process.env.REACT_APP_ENDPOINT

    if(action.type!==userApiCall.type) return next(action)

    const {url,method,data,onSuccess,onFail,onStart,history} = action.payload

    console.log('data: ', data);
    if(onStart)
        dispatch({type:onStart})
    try {
        // toggle follow operation
        if(url.match(/toggle_follow/)){
            const {name} = action.payload
            const response = await axios.request({
                baseURL,
                url:`/api/user/${url}`,
                method,
                
            })
            console.log('the response.data: ',response.data);
            dispatch({type:onSuccess,payload:{name:name,message:response.data.message}})
        }
        // search operation
        else if(url.match(/search/)){
            console.log('this is user search api middleware');
            const {limit,query,cursor} = action.payload
            console.log('limit: ',limit);
            console.log('query: ',query);
            console.log('cursor: ',cursor);
            const response = await axios.request({
                baseURL,
                url:`/api/user/${url}`,
                method,
                params:{
                    limit,
                    cursor,
                    query
                },
                
            })
            console.log('the response.data: ',response.data);
            dispatch({type:onSuccess,payload:response.data})
        }
        // update user profile operation
        else if(url.match(/profile/)&&method==='patch'){
            const response = await axios.request({
                baseURL,
                url:`/api/user/${url}`,
                method,
                data ,
                 
            })
            console.log('response.data: ',response.data);
            dispatch({type:onSuccess,payload:response.data})
        }
        // load user profile operation
        else if(url.match(/profile/)&&method==='get'){
            // decide if user is logged in
            if(!getState().entities.user.name){
                const userResponse = await axios.request({
                    baseURL,
                    url:'/api/user/load',
                    method,
                    
                })
                dispatch(userInfoLoaded(userResponse.data))
            }
            const response = await axios.request({
                baseURL,
                url:`/api/user/${url}`,
                method,
                
            })
            console.log('response.data: ',response.data);
            dispatch({type:onSuccess,payload:response.data})
        }
        // load user following or followers or notifications list operation
        else if(url.match(/following|followers|notifications/)){
            // decide if user is loggedin at notifications page
            if(!getState().entities.user.name && url.match(/notifications/)){
                const userResponse = await axios.get('/api/user/load',{baseURL})
                dispatch(userInfoLoaded(userResponse.data))
            }

            const {cursor,limit} = action.payload
            const response = await axios.request({
                baseURL,
                url:`/api/user/${url}`,
                method,
                params:{
                    cursor,
                    limit
                },
                
            })
            console.log('the response.data: ',response.data);
            dispatch({type:onSuccess,payload:response.data})
        }
        // load sign-in user info operation
        else if(url.match(/load/)){
            const response = await axios.request({
                baseURL,
                url:`/api/user/${url}`,
                method,
                
            })
            console.log('response.data: ',response.data);
            dispatch({type:onSuccess,payload:response.data})
        }
        //other operations (eg, sign-up, sign-in, sign-out, etc)
        else{
            const response = await axios.request({
                baseURL,
                url:`/api/user/${url}`,
                method:method,
                data:data,
                
            })
            console.log('response.data: ',response.data);
            console.log('response.headers: ',response.headers);
            console.log('response.config: ',response.config);
            if(onSuccess) dispatch({type:onSuccess,payload:response.data})
            if(url==='/signout'){
                history.push('/login')
                dispatch(postsDataCleared())
                dispatch(commentsCleared())
            }else if(url==='/reset_request' || url==='/reset'){
                return
            }
            else{
                setTimeout(() => {
                    history.push('/home')
                    dispatch(statusCleared())
                }, 800);
            }   
        }
        
    } catch (error) {
        console.log('error response: ',error.response);
        console.log('error.response.data.message: ',error.response.data.message);
        if(error.response.status===401)history.push('/login')
        else if(error.response.status===404) history.replace('/not_found')
        else{
            if(onFail)
                dispatch({type:onFail,payload:{code:error.response.status,message:error.response.data.message||error.response.statusText}})
        } 
    }
}


export default userApi