import {createSlice,createSelector} from '@reduxjs/toolkit'
import {userApiCall } from './api'

const Slice = createSlice({
    name:'user',
    initialState:{
        name:'',
        avatar:'',
        isGoogleUser:'',  //----> remove the email and replce with  isGoogleUser
        bio:'',
        location:'',
        hobbies:[],
        profession:'',
        posts:[], // array of posts ids
        followers:[], // array of followers names
        following:[], // array of following names
        isLoading:false,
        isProcessing:false,
        search:{
            array:[],
            cursor:null
        },
        profile:{
            user:{},
            followingList:{
                array:[],    // actual users , not just names
                cursor:null
            },
            followersList:{
                array:[],    // actual users , not just names
                cursor:null
            },
        },
        notifications:{
            array:[], 
            cursor:null,
            new_notifs:null,
            isFirstFetch:true
        },
        status:{
            code:null,
            message:'',
            key:null
        },
        authStatus:{
            code:null,
            message:'',
            key:null
        }
    },
    reducers:{
        authRequested:(state,action)=>{
            state.isLoading=true
        },
        authRequestedFailed:(state,action)=>{
            const {code,message}= action.payload
            state.authStatus.code = code
            state.authStatus.message =message
            state.authStatus.key = new Date().getTime()
            state.isLoading = false
        },
        authStatusCleared:(state,action)=>{
            state.authStatus.code=null
            state.authStatus.message=''
            state.authStatus.key=null
        },
        statusCleared:(state,action)=>{
            state.status.code=null
            state.status.message=''
            state.status.key=null
        },
        notifNumIncremented:(state,action)=>{
            state.notifications.new_notifs+=1
        },
        notifsCleared:(state,action)=>{
            state.notifications.array=[]
            state.notifications.cursor=null
            state.notifications.isFirstFetch = true
            // state.isLoading = true
        },
        notifsReceived:(state,action)=>{
            const {data,cursor} = action.payload
            state.notifications.cursor = cursor
            state.notifications.array= [...state.notifications.array,...data]
            if(state.notifications.isFirstFetch===true){
                state.notifications.isFirstFetch=false
                state.notifications.new_notifs = 0
            } 
            state.isLoading = false
        },
        profileCleared:(state,action)=>{
            state.profile={
                user:{},
                followingList:{
                    array:[],    
                    cursor:null
                },
                followersList:{
                    array:[],    
                    cursor:null
                },
            }
            state.isLoading  =true
        },
        profileUserReceived:(state,action)=>{
            const {posts,followers,following,hobbies,...others} = action.payload
            state.profile.user = {posts:[...posts],followers:[...followers],following:[...following],hobbies:[...hobbies],...others}
            state.isLoading = false
        },
        profileFollowingListReceived:(state,action)=>{
            const {data,cursor} = action.payload
            state.profile.followingList.array = [...state.profile.followingList.array,...data]
            state.profile.followingList.cursor = cursor
            state.isLoading = false
        },
        profileFollowersListReceived:(state,action)=>{
            const {data,cursor} = action.payload
            state.profile.followersList.array = [...state.profile.followersList.array,...data]
            state.profile.followersList.cursor = cursor
            state.isLoading = false
        },
        userRequested:(state,action)=>{
            state.isLoading=true
        },
        userRequestedFailed:(state,action)=>{
            const {code,message}= action.payload
            state.status.code = code
            state.status.message =message
            state.status.key = new Date().getTime()
            state.isLoading = false
        },
        userProcessStarted:(state,action)=>{
            state.isProcessing = true
        },
        userProcessFailed:(state,action)=>{
            const {code,message}= action.payload
            state.status.code = code
            state.status.message =message
            state.status.key = new Date().getTime()
            state.isProcessing = false
        },
        usersSearchReceived:(state,action)=>{
            const {cursor,data} = action.payload
            state.search.array = [...state.search.array,...data]
            state.search.cursor = cursor
            state.isProcessing = false
        },
        usersSearchCleared:(state,action)=>{
            state.search.array =[]
            state.search.cursor =null
            state.isLoading = true
        },
        userInfoLoaded:(state,action)=>{
            const {user,message} = action.payload
            const {username,new_notifs,...others} = user
            state.name = username
            state.notifications.new_notifs = new_notifs
            for(let i in others){
                state[i] = others[i]
            }
            state.authStatus.code =200
            state.authStatus.message = message
            state.authStatus.key = new Date().getTime()
            state.isLoading = false
        },
        userRegistered:(state,action)=>{
            const {user, message} = action.payload
            state.status.code = 200
            state.status.message = message
            state.status.key = new Date().getTime()
            const {username,new_notifs,...others} = user
            state.name = username
            state.notifications.new_notifs = new_notifs
            for(let i in others){
                state[i] = others[i]
            }
            state.isProcessing = false
        },
        userSignedOut:(state,action)=>{
            const {message} = action.payload
            state.status.code = 200
            state.status.message = message
            state.status.key = new Date().getTime()
            state.name=''
            state.avatar=''
            state.isGoogleUser=''
            state.posts=[] 
            state.followers=[] 
            state.following=[] 
            state.isLoading =true
            state.isProcessing = false
            state.search={
                array:[],
                cursor:null
            }
            state.profile={
                user:{},
                followingList:{
                    array:[],    // actual users , not just names
                    cursor:null
                },
                followersList:{
                    array:[],    // actual users , not just names
                    cursor:null
                }
            }
            state.notifications={
                array:[],
                cursor:null,
                new_notifs:0
            }
        },
        userEdited:(state,action)=>{
            // const {bio,avatar,location,profession,hobbies} = action.payload
            const {user, message} = action.payload
            state.status.code = 200
            state.status.message = message
            state.status.key = new Date().getTime()
            const {hobbies,...others} = user
            for(let i in others){
                state[i] = others[i]
                state.profile.user[i] = others[i]
            }
            state.hobbies = [...hobbies]
            state.profile.user.hobbies = [...hobbies]
            
            state.isProcessing = false
        },
        postAddedToUesr:(state,action)=>{
            state.posts.push(action.payload.postId)
            state.isProcessing =false
        },
        postDeletedToUser:(state,action)=>{
            const index = state.posts.findIndex(postId=>postId===action.payload.postId)
            state.posts.splice(index,1)
            state.isProcessing =false
        },
        toggleFollowedToUser:(state,action)=>{
            const {name,message} = action.payload
            state.status.code = 200
            state.status.message =message
            state.status.key = new Date().getTime()
            const index = state.following.findIndex(n=>n===name)
            if(index===-1){
                state.following.push(name)
            }else{
                state.following.splice(index,1)
            }
            state.isProcessing =false
        },
        resettingRequestSent:(state,action)=>{
            const {message} = action.payload
            state.status.code = 200
            state.status.message =message
            state.status.key = new Date().getTime()
            state.isProcessing = false
        },
        passwordReset:(state,action)=>{
            const {message} = action.payload
            state.status.code = 200
            state.status.message =message
            state.status.key = new Date().getTime()
            state.isProcessing = false
        }
    }
})

export const {userProcessFailed,statusCleared,profileCleared,usersSearchCleared,userInfoLoaded,usersSearchReceived,notifNumIncremented,notifsCleared} = Slice.actions

export default Slice.reducer

//actions
export const loadNotifs = (username,cursor,limit,history)=>userApiCall({
    method:'get',
    url:`/${username}/notifications`,
    cursor,
    limit,
    history,
    onStart:Slice.actions.userRequested.type,
    onSuccess:Slice.actions.notifsReceived.type,
    onFail:Slice.actions.userRequestedFailed.type
})

export const loadProfileFollowersList = (username,cursor,limit,history)=>userApiCall({
    method:'get',
    url:`/${username}/followers`,
    cursor,
    limit,
    history,
    onStart:Slice.actions.userRequested.type,
    onSuccess:Slice.actions.profileFollowersListReceived.type,
    onFail:Slice.actions.userRequestedFailed.type
})

export const loadProfileFollowingList = (username,cursor,limit,history)=>userApiCall({
    method:'get',
    url:`/${username}/following`,
    cursor,
    limit,
    history,
    onStart:Slice.actions.userRequested.type,
    onSuccess:Slice.actions.profileFollowingListReceived.type,
    onFail:Slice.actions.userRequestedFailed.type
})

export const loadProfileUser = (name,history)=>userApiCall({
    method:'get',
    url:`/${name}/profile`,
    history,
    onStart:Slice.actions.userRequested.type,
    onSuccess:Slice.actions.profileUserReceived.type,
    onFail:Slice.actions.userRequestedFailed.type
})

export const searchUsers = (query,limit,cursor,history)=>userApiCall({
    method:'get',
    url:'/search',
    history,
    limit,
    query,
    cursor,
    onStart:Slice.actions.userProcessStarted.type,
    onSuccess:Slice.actions.usersSearchReceived.type,
    onFail:Slice.actions.userProcessFailed.type
})

export const resetPassword = (data,history)=>userApiCall({
    method:'post',
    url:'/reset',
    data,
    history,
    onStart:Slice.actions.userProcessStarted.type,
    onSuccess:Slice.actions.passwordReset.type,
    onFail:Slice.actions.userProcessFailed.type
})

export const sendResettingRequest = (data,history)=>userApiCall({
    method:'post',
    url:'/reset_request',
    data,
    history,
    onStart:Slice.actions.userProcessStarted.type,
    onSuccess:Slice.actions.resettingRequestSent.type,
    onFail:Slice.actions.userProcessFailed.type
})

export const loadUserInfo  = (history)=>userApiCall({
    method:'get',
    url:'/load',
    history,
    onStart:Slice.actions.authRequested.type,
    onSuccess:Slice.actions.userInfoLoaded.type,
    onFail:Slice.actions.authRequestedFailed.type
})

export const editUserProfile = (username,data,history)=>userApiCall({
    method:'patch',
    url:`/${username}/profile`,
    data:data,
    history,
    onStart:Slice.actions.userProcessStarted.type,
    onSuccess:Slice.actions.userEdited.type,
    onFail:Slice.actions.userProcessFailed.type
})

export const toggleFollowUser = (username,history)=>userApiCall({
    method:'get',
    url:`/${username}/toggle_follow`,
    history,
    name:username,
    onStart:Slice.actions.userProcessStarted.type,
    onSuccess:Slice.actions.toggleFollowedToUser.type,
    onFail:Slice.actions.userProcessFailed.type
})


export const signUpUser = (data,history)=>userApiCall({
    method:'post',
    url:'/signup',
    data,
    history,
    onStart:Slice.actions.userProcessStarted.type,
    onSuccess:Slice.actions.userRegistered.type,
    onFail:Slice.actions.userProcessFailed.type
})

export const signInUser = (data,history)=>userApiCall({
    method:'post',
    url:'/signin',
    data,
    history,
    onStart:Slice.actions.userProcessStarted.type,
    onSuccess:Slice.actions.userRegistered.type,
    onFail:Slice.actions.userProcessFailed.type
})

export const signOutUser = (history)=>userApiCall({
    method:'get',
    url:'/signout',
    history,
    onStart:Slice.actions.userRequested.type,
    onSuccess:Slice.actions.userSignedOut.type,
    onFail:Slice.actions.userRequestedFailed.type
})

// selectors
export const getUserLoading = createSelector(
    state=>state.entities.user,
    user=>user.isLoading
)

export const getUserProcessing = createSelector(
    state=>state.entities.user,
    user=>user.isProcessing
)

export const getUserStatus = createSelector(
    state=>state.entities.user,
    user=>user.status
)

export const getAuthStatus = createSelector(
    state=>state.entities.user,
    user=>user.authStatus
)
export const getUserInfo = createSelector(
    state=>state.entities.user,
    user=>user
)
