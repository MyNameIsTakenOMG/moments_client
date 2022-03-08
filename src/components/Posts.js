import React, { useEffect, useRef, useState,useCallback } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {loadAllPosts,getAllPosts,toggleLikePost, getIsLoading,postStatusCleared ,getIsProcessing,deletePostOrComment, allPostsCleared,updatedPath, getPostStatus} from '../store/posts'
import {getUserInfo,getUserProcessing,getUserStatus,statusCleared,toggleFollowUser} from '../store/user'
import {useHistory,useLocation} from 'react-router-dom'
import OverlayForm from './OverlayForm'
import OptionMenu from './OptionMenu'
import MyCard from './MyCard'
import SkeletonCard from './skeletons/SkeletonCard'
import { Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import SnackBar from './SnackBar/SnackBar'
import { commentStatusCleared, getCommentProcessing, getCommentStatus } from '../store/comments'
import useLastItem from '../hooks/useLastItem'
import _ from 'lodash'
import {Helmet} from 'react-helmet-async'

export default function Posts() {
    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()

    const allPosts = useSelector(getAllPosts)
    const userInfo = useSelector(getUserInfo)
    const userStatus = useSelector(getUserStatus)
    const userProcessing = useSelector(getUserProcessing)
    const postLoading = useSelector(getIsLoading)
    const postProcessing = useSelector(getIsProcessing)
    const postStatus = useSelector(getPostStatus)
    const commentStatus = useSelector(getCommentStatus)
    const commentProcessing = useSelector(getCommentProcessing)
    
    // intersection observer & pagination(infinite scroll)
    const limit = useRef(10)
    const theRoot = useRef()
    const lastPost = useLastItem(theRoot,postLoading,allPosts.cursor,dispatch,loadAllPosts(history,allPosts.cursor,limit.current))

    useEffect(()=>{
        dispatch(updatedPath({path:location.pathname}))
        dispatch(loadAllPosts(history,allPosts.cursor,limit.current))
        return ()=>{
            dispatch(allPostsCleared()) 
            // dispatch(statusCleared())
            dispatch(postStatusCleared())
            dispatch(commentStatusCleared())
        }
    },[])

    // first loading & skeleton
    const [firstLoading, setFirstLoading] = useState(true)

    useEffect(() => {
        if(!postLoading && firstLoading){
            setFirstLoading(false)
        }
    }, [postLoading])

    // option menu  & delete dialog 
    const [anchorEl,setAnchorEl] = useState(null)
    const openMenu = Boolean(anchorEl)
    const [theSubject,setTheSubject] = useState(null)
    
    const handleOptionClick = (e,subject)=>{
        setAnchorEl(e.currentTarget)
        setTheSubject(subject)
    }
    const handleMenuClose =(e)=>{
        setAnchorEl(null)
    }

    const handleMenuOption = (e)=>{
        if(e.target.id==='follow')
            dispatch(toggleFollowUser(theSubject.author,history))
        else if(e.target.id==='edit'){
            // const thePost = allPosts.find(post=>post._id===theId)
            // history.push(`/posts/${theId}/edit`,{thePost})
            history.push(`/post/${theSubject._id}/edit`)
        }
        else if(e.target.id==='delete')
            setOpenDeleteDialog(true)
        setAnchorEl(null)
    }

    const [openDeleteDialog,setOpenDeleteDialog] = useState(false)

    const handleDeleteAction = (e)=>{
        dispatch(deletePostOrComment(theSubject._id,history,'allPosts'))
        setOpenDeleteDialog(false)
    }
    
    const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    };

    // comment button & overlay comment form
    const [openOverlay,setOpenOverlay] = useState(false)
    const [overlayId,setOverlayId] = useState()

    const handleCommentClick = (e,id)=>{
        setOverlayId(id)
        setOpenOverlay(true)
    }

    const handleClickAway = (e)=>{
        e.stopPropagation()
        // console.log('target id ',e.target.id);
        // console.log('current target id ',e.currentTarget.id);
        if(e.target.id==='backButton'||e.target.id==='myOverlay'||e.target.id==='backIcon')
        setOpenOverlay(false)
    }

    // detail and like buttons
    const handleDetailClick = (e,postId)=>{
        console.log('the postid: ',postId);
        history.push(`/post/${postId}`)
        // history.push({
        //     pathname:`/posts/${postId}`,
        //     state:{from:location.pathname}
        // })
    }

    const debouncingLike = useCallback(_.debounce((id)=>{dispatch(toggleLikePost(id,history,'allPosts'))},120),[])
    const handleLikeClick = (e,id)=>{
        // dispatch(toggleLikePost(id,history,'allPosts'))
        debouncingLike(id)
    }

    return (
        <div ref={theRoot} style={{width:'100%',height:'100%',position:'relative',overflow:'auto'}}>

            <Helmet>
                <title>Home/Moments</title>
                <meta name='description' content='Home page of Moments' />
            </Helmet>

            {/* follow & unfollow snackbar & logout*/}
            <SnackBar processing={userProcessing} status={userStatus} dispatch={dispatch} statusCleared={statusCleared} />
            {/* post delete snackbar */}
            <SnackBar processing={postProcessing} status={postStatus} dispatch={dispatch} statusCleared={postStatusCleared} />
            {/* comment snackbar */}
            <SnackBar processing={commentProcessing} status={commentStatus} dispatch={dispatch} statusCleared={commentStatusCleared} />

            <OptionMenu openDeleteDialog={openDeleteDialog}
            handleDeleteClose={handleDeleteClose}
            handleDeleteAction={handleDeleteAction}
            handleMenuClose={handleMenuClose}
            handleMenuOption={handleMenuOption}
            userInfo={userInfo}
            subject={theSubject}
            anchorEl={anchorEl}
            openMenu={openMenu}/>

            {allPosts.array.length===0?'':allPosts.array.map((post,index)=>(
                <div ref={index+1===allPosts.array.length?lastPost.lastItemRef:null} key={post._id} style={{marginBottom:'1rem',marginLeft:'1rem',marginRight:'1rem'}}>
                    <MyCard  handleCommentClick={handleCommentClick}
                    handleLikeClick={handleLikeClick}
                    handleDetailClick={handleDetailClick}
                    handleOptionClick={handleOptionClick}
                    userInfo={userInfo}
                    subject={post}/>
                </div>
            ))}
            
            {firstLoading
            ?<><SkeletonCard path={location.pathname} /><SkeletonCard path={location.pathname} /></>
            :postLoading
                ? <><SkeletonCard path={location.pathname} /><SkeletonCard path={location.pathname} /></>
                : <Typography variant='body2' color={grey[600]}>{!allPosts.cursor && 'No more result...' }</Typography>
            }
            
            {!openOverlay?'':
                <OverlayForm processing={commentProcessing} history={history} overlayId={overlayId} userInfo={userInfo} handleClickAway={handleClickAway} />
            } 
        </div>
    )
}

