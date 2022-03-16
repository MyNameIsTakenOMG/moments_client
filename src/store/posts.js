import {createSlice, createSelector} from '@reduxjs/toolkit'
import { postApiCall } from './api'

const Slice = createSlice({
    name:'posts',
    initialState:{
        allPosts:{
            array:[],
            cursor:null,
        },
        followingPosts:{
            array:[],
            cursor:null
        },
        myPosts:{
            array:[],
            cursor:null
        },
        postPage:{
            post:'',
        },
        commentPage:{
            comment:'',
        },
        editPost:'',
        isLoading:false,
        isProcessing:false,
        path:'',
        searchPage:{
            array:[],
            cursor:null
        },
        profile:{
            postsList:{
                array:[],
                cursor:null
            }
        },
        status:{
            key:null,
            message:'',
            code:null
        }
    },
    reducers:{
        profilePostsCleared:(state,action)=>{
            state.profile={
                postsList:{
                    array:[],
                    cursor:null
                }
            }
        },
        profilePostsListReceived:(state,action)=>{
            const {data,cursor} = action.payload
            state.profile.postsList.array = [...state.profile.postsList.array,...data]
            state.profile.postsList.cursor = cursor
            state.isLoading = false
        },
        postsSearchCleared:(state,action)=>{
            state.searchPage.array =[]
            state.searchPage.cursor =null
        },
        postsSearchReceived:(state,action)=>{
            const {cursor,data} = action.payload
            state.searchPage.array = [...state.searchPage.array,...data]
            state.searchPage.cursor = cursor
            state.isProcessing = false
        },
        updatedPath:(state,action)=>{
            state.path = action.payload.path
        },
        postsDataCleared:(state,action)=>{
            state.allPosts = {
                array:[],
                cursor:null
            }
            state.followingPosts ={
                array:[],
                cursor:null
            }
            state.myPosts = {
                array:[],
                cursor:null
            }
            state.editPost =''
            state.searchPage={
                array:[],
                cursor:null
            }
            state.postPage.post =''
            state.commentPage.comment =''
            state.path=''
            state.profile={
                postsList:{
                    array:[],
                    cursor:null
                }
            }
            state.isLoading = false
            state.isProcessing = false
        },
        allPostsCleared:(state,action)=>{
            state.allPosts={
                array:[],
                cursor:null,
            }
        },
        followingPostsCleared:(state,action)=>{
            state.followingPosts={
                array:[],
                cursor:null
            }
        },
        myPostsCleared:(state,action)=>{
            state.myPosts={
                array:[],
                cursor:null
            }
        },
        postPageCleared:(state,action)=>{
            state.postPage.post=''
        },
        commentPageCleared:(state,action)=>{
            state.commentPage.comment=''
        },
        requestStarted:(state,action)=>{
            state.isLoading = true
        },
        requestFailed:(state,action)=>{
            const {code,message} = action.payload
            state.status.code =code
            state.status.message =message
            state.status.key = new Date().getTime()
            state.isLoading =false
        },
        processStarted:(state,action)=>{
            state.isProcessing =true
        },
        processFailed:(state,action)=>{
            const {code,message} = action.payload
            state.status.code =code
            state.status.message =message
            state.status.key = new Date().getTime()
            state.isProcessing = false
        },
        allPostsReceived:(state,action)=>{
            const {data,cursor} = action.payload
            state.allPosts.array = [...state.allPosts.array,...data]
            state.allPosts.cursor = cursor
            state.isLoading =false
        },
        followingPostsReceived:(state,action)=>{
            const {data,cursor} = action.payload
            state.followingPosts.array = [...state.followingPosts.array,...data]
            state.followingPosts.cursor = cursor
            state.isLoading =false
        },
        myPostsReceived:(state,action)=>{
            const {data,cursor} = action.payload
            state.myPosts.array = [...state.myPosts.array,...data]
            state.myPosts.cursor = cursor
            state.isLoading =false
        },
        postOrCommentDeleted:(state,action)=>{
            const {id,path,message} = action.payload
            state.status.message= message
            state.status.key = new Date().getTime()
            state.status.code = 200
            if(path==='postPage'){
                state.postPage.post=''
            }else if(path==='commentPage'){
                state.commentPage.comment=''
            }else{
                const index= state[path].array.findIndex(post=>post._id===id)
                state[path].array.splice(index,1)
            }
            state.isProcessing = false
        },
        commentsDeleted:(state,action)=>{
            const {path,id,deleteNum} = action.payload
            if(path==='postPage'){
                const index = state.postPage.post.comments.findIndex(commentId=>commentId===id)
                state.postPage.post.comments.splice(index,1)
                state.postPage.post.allComments-=deleteNum
            }
            if(path==='commentPage'){
                const index = state.commentPage.comment.comments.findIndex(commentId=>commentId===id)
                state.commentPage.comment.comments.splice(index,1)
                state.commentPage.comment.allComments-=deleteNum
            }
            state.isProcessing = false
        },
        postStatusCleared:(state,action)=>{
            state.status.key=null
            state.status.message =''
            state.status.code=null
        },
        newPostCreated:(state,action)=>{
            const {message} = action.payload
            state.status.message = message
            state.status.code = 200
            state.status.key = new Date().getTime()
            state.isProcessing = false
        },
        myPostUpdated:(state,action)=>{
            const {message} = action.payload
            state.status.code = 200
            state.status.key = new Date().getTime()
            state.status.message = message
            state.isProcessing = false
        },
        editPostReceived:(state,action)=>{
            state.editPost = action.payload
            state.isLoading = false
        },
        editPostCleared:(state,action)=>{
            state.editPost = ''
        },
        postReceived:(state,action)=>{
            state.postPage.post = action.payload
            state.isLoading = false
        },
        commentReceived:(state,action)=>{
            state.commentPage.comment = action.payload
            state.isLoading = false
        },
        toggleLikedToPost:(state,action)=>{
            const {path,name,id} = action.payload
            if(path==='postPage'){
                const index = state.postPage.post.likes.findIndex(likename=>likename===name)
                if(index===-1) state.postPage.post.likes.push(name)
                else state.postPage.post.likes.splice(index,1)
            }else if(path==='commentPage'){
                const index = state.commentPage.comment.likes.findIndex(likename=>likename===name)
                if(index===-1) state.commentPage.comment.likes.push(name)
                else state.commentPage.comment.likes.splice(index,1)
            }
            else{
                const thePost = state[path].array.find(post=>post._id===id)
                const index = thePost.likes.findIndex(likeName=>likeName===name)
                if(index ===-1) thePost.likes.push(name)
                else thePost.likes.splice(index,1)
            }
            state.isProcessing = false
        },
        commentAdded: (state,action)=>{
            const {path,id,data,type} = action.payload
            if(type==='direct'){
                if(path!=='postPage'&& path!=='commentPage'){
                    const thePost = state[path].array.find(post=>post._id===id)
                    thePost.allComments+=1
                    thePost.comments.push(data._id)
                }else if(path==='postPage'){
                    state.postPage.post.allComments+=1
                    state.postPage.post.comments.push(data._id)
                }else if(path==='commentPage'){
                    state.commentPage.comment.allComments+=1
                    state.commentPage.comment.comments.push(data._id)
                }
            }
            else if(type==='indirect'){
                if(action.payload.path==='postPage'){
                    state.postPage.post.allComments+=1
                }else if(action.payload.path==='commentPage'){
                    state.commentPage.comment.allComments+=1
                }
            } 
            state.isProcessing = false 
        },
    }
})

export const {postStatusCleared,profilePostsCleared,editPostCleared,postsSearchCleared,commentAdded,postsDataCleared,commentsDeleted,allPostsCleared,followingPostsCleared,myPostsCleared,postPageCleared,commentPageCleared,updatedLocation,updatedPath} = Slice.actions

export default  Slice.reducer

//actions
export const loadProfilePostsList = (username,cursor,limit,history)=>postApiCall({
    url:`/user_posts/${username}`,
    method:'get',
    cursor,
    limit,
    history,
    onStart:Slice.actions.requestStarted.type,
    onSuccess:Slice.actions.profilePostsListReceived.type,
    onFail:Slice.actions.requestFailed.type
})

export const searchPosts = (query,limit,cursor,history)=>postApiCall({
    url:'/search',
    method:'get',
    query,
    cursor,
    limit,
    history,
    onStart:Slice.actions.processStarted.type,
    onSuccess:Slice.actions.postsSearchReceived.type,
    onFail:Slice.actions.processFailed.type
})

export const deletePostOrComment = (id,history,path) =>postApiCall({
    url:`/${id}`,
    method:'delete',
    path,
    history,
    id,
    onStart:Slice.actions.processStarted.type,
    onSuccess:Slice.actions.postOrCommentDeleted.type,
    onFail:Slice.actions.processFailed.type
})

export const updateMyPost = (postId,data,history)=>postApiCall({
    url:`/${postId}`,
    method:'patch',
    data:data,
    history,
    onStart:Slice.actions.processStarted.type,
    onSuccess:Slice.actions.myPostUpdated.type,
    onFail:Slice.actions.processFailed.type
})

export const loadEditPost = (id,history)=>postApiCall({
    url:`/edit/${id}`,
    method:'get',
    history,
    onStart:Slice.actions.requestStarted.type,
    onSuccess:Slice.actions.editPostReceived.type,
    onFail:Slice.actions.requestFailed.type
})

export const createPost = (data,history)=>postApiCall({
    url:'/new_post',
    method:'post',
    data,
    history,
    onStart:Slice.actions.processStarted.type,
    onSuccess:Slice.actions.newPostCreated.type,
    onFail:Slice.actions.processFailed.type
})


export const toggleLikePost = (id,history,path)=>postApiCall({ //path: telling which page(eg. allposts, postPage or commentPage) 
    // in middleware, send request to different api based on path(post or comment)
    url:`/${id}/toggle_like`,
    id,
    method:'get',
    history,
    path,
    onStart:Slice.actions.processStarted.type,
    onSuccess:Slice.actions.toggleLikedToPost.type,
    onFail:Slice.actions.processFailed.type
})

export const loadPost =(postId,type,history)=>postApiCall({
    url:`/${postId}`,
    method:'get',
    data:'',
    type,
    history,
    onStart:Slice.actions.requestStarted.type,
    onSuccess:Slice.actions.postReceived.type,
    onFail:Slice.actions.requestFailed.type
})
export const loadComment =(commentId,type,history)=>postApiCall({
    url:`/${commentId}`,
    method:'get',
    data:'',
    type,
    history,
    onStart:Slice.actions.requestStarted.type,
    onSuccess:Slice.actions.commentReceived.type,
    onFail:Slice.actions.requestFailed.type
})


export const loadAllPosts= (history,cursor,limit) => postApiCall({
    url:'/',
    method:'get',
    history,
    cursor,
    limit,
    onStart:Slice.actions.requestStarted.type,
    onSuccess:Slice.actions.allPostsReceived.type,
    onFail:Slice.actions.requestFailed.type
})

export const loadFollowingPosts = (history,cursor,limit)=>postApiCall({
    url:'/following_posts', 
    method:'get',
    cursor,
    limit,
    history,
    onStart:Slice.actions.requestStarted.type,
    onSuccess:Slice.actions.followingPostsReceived.type,
    onFail:Slice.actions.requestFailed.type
})
export const loadMyPosts = (history,cursor,limit) =>postApiCall({  
    url:`/my_posts`,   
    method:'get',
    history,
    cursor,
    limit,
    onStart:Slice.actions.requestStarted.type,
    onSuccess:Slice.actions.myPostsReceived.type,
    onFail:Slice.actions.requestFailed.type
})

export const loadUserPosts = (username,history)=>postApiCall({
    url:`/user_posts/${username}`,
    method:'get',
    history,
    onSuccess:Slice.actions.myPostsReceived.type  // ?????????????? need to change
})

//selector

export const getPostStatus = createSelector(
    state=>state.entities.posts,
    posts=>posts.status
)

export const getPostsProfile = createSelector(
    state=>state.entities.posts,
    posts=>posts.profile
)

export const getPostsSearch = createSelector(
    state=>state.entities.posts,
    posts=>posts.searchPage
)

export const getPath =createSelector(
    state=>state.entities.posts,
    posts=>posts.path
)

export const getIsProcessing = createSelector(
    state=>state.entities.posts,
    posts=>posts.isProcessing
)

export const getIsLoading = createSelector(
    state=>state.entities.posts,
    posts=>posts.isLoading
)

export const getThePost = createSelector(
    state=>state.entities.posts,
    posts=>posts.postPage.post
)

export const getTheComment = createSelector(
    state=>state.entities.posts,
    posts=>posts.commentPage.comment
)

export const getAllPosts = createSelector(
    state=>state.entities.posts,
    posts=>posts.allPosts
)

export const getPostById = postId => createSelector(
    state=>state.entities.posts,
    posts=>posts.allPosts.array.find(post=>post._id===postId)
)
export const getEditPost = createSelector(
    state=>state.entities.posts,
    posts=>posts.editPost
)

export const getFollowingPosts = createSelector(
    state=>state.entities.posts,
    posts=>posts.followingPosts
)


export const getMyPosts = createSelector(
    state=>state.entities.posts,
    posts=>posts.myPosts
)

