import { createSlice,createSelector} from '@reduxjs/toolkit'
import {commentApiCall} from './api'


const Slice = createSlice({
    name:'comments',
    initialState:{
        comments:{
            commentsArray:[],
            isLoading:false,
            isProcessing:false,
            cursor:null
        },
        status:{
            key:null,
            message:'',
            code:null
        }
    },
    reducers:{
        commentStatusCleared:(state,action)=>{
            state.status.code =null
            state.status.message =''
            state.status.key=null
        },
        notifReplied:(state,action)=>{
            const {message} = action.payload
            state.status.code =200
            state.status.key = new Date().getTime()
            state.status.message = message
            state.comments.isProcessing= false
        },
        commentsCleared:(state,action)=>{
            state.comments.isLoading = true
            state.comments.isProcessing = false
            state.comments.commentsArray =[]
        },
        allCommentsReceived:(state,action)=>{
            const {data,cursor} = action.payload
            state.comments.commentsArray = [...state.comments.commentsArray,...data]
            state.comments.cursor = cursor
            state.comments.isLoading = false
        },
        commentsRequested:(state,action)=>{
            state.comments.isLoading = true
        },
        commentsRequestedFailed:(state,action)=>{
            const {code,message} = action.payload
            state.status.key = new Date().getTime()
            state.status.message = message
            state.status.code = code
            state.comments.isLoading = false
        },
        processStarted:(state,action)=>{
            state.comments.isProcessing = true
        },
        processFailed:(state,action)=>{
            const {code,message} = action.payload
            state.status.key = new Date().getTime()
            state.status.message = message
            state.status.code = code
            state.comments.isProcessing = false
        },
        commentAddedToArray:(state,action)=>{
            const {path,id,comment,type,message} = action.payload
            state.status.code =200
            state.status.message = message
            state.status.key = new Date().getTime()
            if(path==='postPage'||path==='commentPage'){
                if(type==='direct'){
                    state.comments.commentsArray.unshift(comment)
                }
                else if(type==='indirect'){
                    const theComment = state.comments.commentsArray.find(comment=>comment._id===id)
                    theComment.allComments+=1
                    theComment.comments.push(comment)
                }
            }   
            state.comments.isProcessing = false
        },
        toggleLikedToComment:(state,action)=>{
            const {id,name} = action.payload
            const theComment = state.comments.commentsArray.find(comment=>comment._id===id)
            const index = theComment.likes.findIndex(likeName=>likeName===name)
            if(index===-1) theComment.likes.push(name)
            else theComment.likes.splice(index,1)
            state.comments.isProcessing = false
        },
        commentDeleted:(state,action)=>{
            const {id,message} = action.payload
            state.status.key=new Date().getTime()
            state.status.message = message
            state.status.code = 200
            const index = state.comments.commentsArray.findIndex(comment=>comment._id===id)
            state.comments.commentsArray.splice(index,1)
            state.comments.isProcessing = false
        }
    }
})

export const {commentStatusCleared,commentAddedToArray, commentsCleared,commentsArrayDeleted,notifReplied} = Slice.actions

export default Slice.reducer

//actions

export const toggleLikeComment = (id,history)=>commentApiCall({
    url:`/${id}/toggle_like`,
    method:'get',
    id,
    history,
    onStart:Slice.actions.processStarted.type,
    onSuccess:Slice.actions.toggleLikedToComment.type,
    onFail:Slice.actions.processFailed.type
})


export const loadAllComments = (id,type,cursor,limit,history)=>commentApiCall({
    url:`/${id}/comments`,
    method:'get',
    data:'',
    type,
    cursor,
    limit,
    history,
    onStart:Slice.actions.commentsRequested.type,
    onSuccess:Slice.actions.allCommentsReceived.type,
    onFail:Slice.actions.commentsRequestedFailed.type
})

export const addNewComment = (path,id,data,type,history,isNotifReply=false)=>commentApiCall({
    url:'/new_comment',
    method:'post',
    data,
    path,
    type,
    id,
    isNotifReply,
    history,
    onStart:Slice.actions.processStarted.type,
    onSuccess:Slice.actions.commentAddedToArray.type,
    onFail:Slice.actions.processFailed.type
})

export const deleteComment = (path,id,deleteNum,history)=>commentApiCall({
    url:`/${id}`,
    method:'delete',
    path,
    id,
    history,
    deleteNum,
    onStart:Slice.actions.processStarted.type,
    onSuccess:Slice.actions.commentDeleted.type,
    onFail:Slice.actions.processFailed.type
})

//selectors

export const getAllComments = createSelector(
    state=>state.entities.comments,
    comments=>comments.comments
)

export const getCommentStatus = createSelector(
    state=>state.entities.comments,
    comments=>comments.status
)

export const getCommentProcessing = createSelector(
    state=>state.entities.comments,
    comments=>comments.comments.isProcessing
)