import axios from 'axios'
import {commentApiCall} from '../api'
import {  notifReplied } from '../comments'
import { commentAdded,commentsDeleted } from '../posts'

const commentApi = ({getState,dispatch})=>next=>async(action)=>{

    let baseURL=process.env.NETLIFY===true?process.env.REACT_APP_ENDPOINT:null
    // if(process.env.NODE_ENV==='production')
    //     baseURL=process.env.REACT_APP_ENDPOINT
   
    if(action.type!==commentApiCall.type) return next(action)

    const {url,method,data,onSuccess,path,id,type,onStart,onFail,history} = action.payload
    console.log('from the commentApi middleware...');
    try {
        if(onStart)
            dispatch({type:onStart})
        // add new comment operation
        let response = ''
        if(method==='post'){
            const {isNotifReply} = action.payload
            response = await axios.request({
                baseURL,
                url:`/api/comments/${url}`,
                data,
                method,
                headers:{
                    'content-type':'multipart/form-data'
                },
                withCredentials:true
            })
            console.log('response.data',response.data);
            // if this is a reply to notifications
            if(isNotifReply){
                dispatch(notifReplied({message:response.data.message}))
            }
            else{
                dispatch(commentAdded({path,id,data:response.data,type}))
                dispatch({type:onSuccess,payload:{path,id,comment:response.data.comment,type,message:response.data.message}})       
            }
        }

        // toggle like operation
        else if(url.search(/toggle_like/)!==-1){
            // const{id} = action.payload
            response = await axios.get(`/api/comments/${url}`,{baseURL,withCredentials:true})
            dispatch({type:onSuccess,payload:{id:id,name:getState().entities.user.name}})
        }
        //delete operation
        else if(method==='delete'){
            const {deleteNum} = action.payload
            console.log('id from comment api: ',id);
            console.log('deleteNum from comment api: ',deleteNum);
            response = await axios.delete(`/api/comments/${id}`,{baseURL,withCredentials:true})
            dispatch({type:onSuccess,payload:{id:id,message:response.data.message}})
            dispatch(commentsDeleted({path:path,id:id,deleteNum:deleteNum}))
        }
        else if(method==='get'){
            const {cursor,limit} = action.payload
            response = await axios.request({
                            baseURL,
                            url:`/api/comments/${url}`,
                            data,
                            method,
                            params:{
                                type,
                                cursor,
                                limit
                            },
                            withCredentials:true
                        })
            console.log('response.data',response.data);
            dispatch({type:onSuccess,payload:response.data})
        }
        
    } catch (error) {
        console.log('error response: ',error.response);
        console.log('error.response.data.message: ',error.response.data.message);
        if(error.response.status===401) history.push('/login')
        else if(error.response.status===404) history.replace('/not_found')
        else{
            if(onFail) dispatch({type:onFail,payload:{code:error.response.status,message:error.response.data.message||error.response.statusText}})
        }
    }
}

export default commentApi