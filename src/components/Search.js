import React, { useEffect, useRef, useState,useCallback } from 'react'
import { useHistory,useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { postsSearchCleared, updatedPath,searchPosts, getPostsSearch, getIsProcessing } from '../store/posts'
import { getUserInfo,getUserProcessing,getUserStatus,loadUserInfo,searchUsers, usersSearchCleared,statusCleared, toggleFollowUser } from '../store/user'

import { Box, Typography } from '@mui/material'
import { grey, lightBlue } from '@mui/material/colors'
import { IconButton } from '@mui/material'
import { Stack } from '@mui/material'
import InputBase from '@mui/material/InputBase';
import { Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BioSearchBlock from './BioSearchBlock'
import PostSearchBlock from './PostSearchBlock'
import SkeletonBioBlock from './skeletons/SkeletonBioBlock'
import SkeletonPostBlock from './skeletons/SkeletonPostBlock'
import SnackBar from './SnackBar/SnackBar'
import useLastItem from '../hooks/useLastItem'
import _ from 'lodash'
import { Helmet } from 'react-helmet-async'

export default function Search() {

    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()
    const userInfo = useSelector(getUserInfo)
    const userProcessing = useSelector(getUserProcessing)
    const userStatus = useSelector(getUserStatus)
    const searchedPosts = useSelector(getPostsSearch)
    const postProcessing = useSelector(getIsProcessing)

    // tap menu & search bar
    const [tapValue,setTapValue] = useState('posts')
    const [query,setQuery] = useState('')
    const limit = useRef(5)
    const searchQuery = useRef()
    const searchClick = useRef(false)
    const handleTapChange = (e,newTapValue)=>{
        setTapValue(newTapValue)
    }

    const handleQueryChange = (e)=>{
        setQuery(e.target.value)
    }

    const handleSubmit = (e)=>{
        e.preventDefault()

        let str = query.replace(/\s+/g,' ').trim()
        if(!str){
            setQuery('')
        }
        else{
            searchQuery.current = query
            searchClick.current = true
            console.log('hello');
            if(tapValue==='posts'){
                dispatch(postsSearchCleared())
            } 
            else if(tapValue==='people') {
                dispatch(usersSearchCleared())
            }
        }
    }

    useEffect(()=>{
        if(searchClick.current===true){
            if(tapValue==='people'){
                if(userInfo.search.array.length===0&&userInfo.search.cursor===null && searchQuery.current!==''){
                    dispatch(searchUsers(searchQuery.current,limit.current,userInfo.search.cursor,history))
                }
            }
            else{
                if(searchedPosts.array.length===0&&searchedPosts.cursor===null && searchQuery.current!==''){
                    dispatch(searchPosts(searchQuery.current,limit.current,searchedPosts.cursor,history))
                }
            }
            searchClick.current = false
        }
    },[searchClick.current])     
    
    // intersection observer ( user observer & post observer)  
    const theRoot = useRef()
    const lastPost = useLastItem(theRoot,postProcessing,searchedPosts.cursor,dispatch,searchPosts(searchQuery.current,limit.current,searchedPosts.cursor,history))
    const lastUser = useLastItem(theRoot,userInfo.isProcessing,userInfo.search.cursor,dispatch,searchUsers(searchQuery.current,limit.current,userInfo.search.cursor,history))


    useEffect(()=>{
        if(userInfo.name===''){
            dispatch(loadUserInfo(history))
        }
        dispatch(updatedPath({path:location.pathname}))
        // return ()=>{
        //     dispatch(usersSearchCleared())
        //     dispatch(postsSearchCleared())
        // }
    },[])


    const handleBioClick =(e,user)=>{
        history.push(`/profile/${user.username}`)
    }

    const debouncingFollow = useCallback(_.debounce((username,history)=>{
        dispatch(toggleFollowUser(username,history))
    },120)
    ,[])
    const handleToggleFollow = (e,username,history)=>{
        e.stopPropagation()
        // dispatch(toggleFollowUser(username,history))
        debouncingFollow(username,history)
    }

    const handlePostClick = (e,post)=>{
        history.push(`/post/${post._id}`)
    }

    return (
        <Box sx={{overflow:'auto',position:'relative',width:'100%',height:'100%',px:2,display:'flex',flexFlow:'column nowrap'}}>
            <Helmet>
                <title>search:{searchQuery.current?searchQuery.current:' '}/Moments Search</title>
                <meta name='description' content='search page of Moments' />
            </Helmet>

            {/* follow & unfollow snackbar & logout*/}
            <SnackBar processing={userProcessing} status={userStatus} dispatch={dispatch} statusCleared={statusCleared} />
            
            <Box sx={{display:'flex',flexFlow:'row nowrap',p:2,justifyContent:'center'}} >
                <Typography fontSize={'150%'}  width='90%' textAlign={'center'} alignSelf={'center'} color={lightBlue[500]}>Explore the Moments!</Typography>
            </Box>
            <Box sx={{display:'flex',flexFlow:'row nowrap',py:1,justifyContent:'center',alignItems:'center'}}>
                <Paper sx={{borderRadius:'50px',px:1,width:'80%'}}>
                    <form onSubmit={handleSubmit} style={{width:'100%',display:'flex',flexFlow:'row nowrap',alignItems:'center'}}>
                    <InputBase aria-required required sx={{mx:1,flexGrow:1}} placeholder='Enter your keywords' value={query} onChange={handleQueryChange} inputProps={{ 'aria-label': 'Enter your keywords' }}/>
                    <IconButton type='submit'>
                        <SearchIcon />
                    </IconButton>
                    </form>
                </Paper>
            </Box>
            <Stack direction='row' mt={1} mb={1}justifyContent='center' borderBottom={1} borderColor='divider'>
                <Tabs value={tapValue} onChange={handleTapChange} aria-label="filter menu">
                    <Tab value={'posts'} label="find posts" />
                    <Tab value={'people'} label="find people" />
                </Tabs>
            </Stack>
            <div ref={theRoot} style={{position:'relative',width:'100%',height:'100%',display:'flex',flexFlow:'column nowrap',overflow:'auto'}}>
                {tapValue==='posts'
                ?<>
                    {/* posts list */}
                    {searchedPosts.array.length===0?'':searchedPosts.array.map((post,index)=>{
                        return <div key={post._id} ref={index+1===searchedPosts.array.length?lastPost.lastItemRef:null} onClick={(e)=>handlePostClick(e,post)}>
                            <PostSearchBlock searchedPost={post} />
                        </div>
                    })}

                    {postProcessing
                    ?<><SkeletonPostBlock /><SkeletonPostBlock /><SkeletonPostBlock /></>
                    :searchedPosts.cursor
                    ?<><SkeletonPostBlock /><SkeletonPostBlock /><SkeletonPostBlock /></>
                    :<Typography variant='body2' color={grey[600]}>No more result...</Typography>}

                </>
                :<>
                    {/* user list */}
                    {userInfo.search.array.length===0?'':userInfo.search.array.map((user,index)=>{
                        return <div key={user._id} ref={index+1===userInfo.search.array.length?lastUser.lastItemRef:null} onClick={(e)=>handleBioClick(e,user)}>
                            <BioSearchBlock handleToggleFollow={(e)=>handleToggleFollow(e,user.username,history)} searchedUser={user} userInfo={userInfo} />
                        </div>
                    })}

                    {userInfo.isProcessing
                    ?<><SkeletonBioBlock /><SkeletonBioBlock /><SkeletonBioBlock /></>
                    :userInfo.search.cursor
                    ?<><SkeletonBioBlock /><SkeletonBioBlock /><SkeletonBioBlock /></>
                    :<Typography variant='body2' color={grey[600]}>No more result...</Typography>}
                </>
                }
            
            </div>
        </Box>
    )
}
