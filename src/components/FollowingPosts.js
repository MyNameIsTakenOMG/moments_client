import React,{useEffect,useState,useRef,useCallback} from 'react'
import {useHistory,useLocation} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import {loadFollowingPosts,getFollowingPosts,getIsLoading,getIsProcessing,toggleLikePost, followingPostsCleared,deletePostOrComment,updatedPath, getPostStatus, postStatusCleared} from '../store/posts'
import {getUserInfo,getUserProcessing,getUserStatus,statusCleared,toggleFollowUser} from '../store/user'
import OverlayForm from './OverlayForm'
import MyCard from './MyCard'
import OptionMenu from './OptionMenu'
import SkeletonCard from './skeletons/SkeletonCard'
import { Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import { commentStatusCleared, getCommentProcessing, getCommentStatus } from '../store/comments'
import SnackBar from './SnackBar/SnackBar'
import useLastItem from '../hooks/useLastItem'
import _ from 'lodash'
import {Helmet} from 'react-helmet-async'

export default function FollowingPosts() {
    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()

    const followingPosts = useSelector(getFollowingPosts)
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
    const lastPost = useLastItem(theRoot,postLoading,followingPosts.cursor,dispatch,loadFollowingPosts(history,followingPosts.cursor,limit.current))
    
    // first loading & skeleton
    const [firstLoading, setFirstLoading] = useState(true)

    useEffect(()=>{
        dispatch(updatedPath({path:location.pathname}))
        dispatch(loadFollowingPosts(history,null,limit.current))
        return ()=>{
            dispatch(followingPostsCleared())
            dispatch(postStatusCleared())
            dispatch(commentStatusCleared())
        }
    },[location.key])

    useEffect(() => {
        if(!postLoading && firstLoading){
            setFirstLoading(false)
        }
    }, [postLoading])

    // option menu
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
            history.push(`/post/${theSubject._id}/edit`)
        }
        else if(e.target.id==='delete')
            setOpenDeleteDialog(true)
        setAnchorEl(null)
    }

    const [openDeleteDialog,setOpenDeleteDialog] = useState(false)

    const handleDeleteAction = (e)=>{
        dispatch(deletePostOrComment(theSubject._id,history,'followingPosts'))
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
        if(e.target.id==='backButton'||e.target.id==='myOverlay'||e.target.id==='backIcon')
        setOpenOverlay(false)
    }

    // likes and detail buttons
    const handleDetailClick = (e,postId)=>{
        history.push({
            pathname:`/post/${postId}`,
            state:{from:location.pathname}
        })
    }

    const debouncingLike = useCallback(_.debounce((id)=>{dispatch(toggleLikePost(id,history,'followingPosts'))},500),[])
    const handleLikeClick = (e,id)=>{
        // dispatch(toggleLikePost(id,history,'followingPosts'))
        debouncingLike(id)
    }

    return (
        <div ref={theRoot} style={{width:'100%',height:'100%',position:'relative',overflow:'auto'}}>  
            
            <Helmet>
                <title>My followings posts page/Moments</title>
                <meta name='description' content="user's followings' posts page " />
            </Helmet>
            
            {/* follow & unfollow snackbar &logout*/}
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

            {followingPosts.array.length===0?'':followingPosts.array.map((post,index)=>(
                <div ref={index+1===followingPosts.array.length?lastPost.lastItemRef:null} key={post._id} style={{marginBottom:'1rem',marginLeft:'1rem',marginRight:'1rem'}}>
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
                : <Typography variant='body2' color={grey[600]}>{!followingPosts.cursor && 'No more result...' }</Typography>
            }
            {!openOverlay?'':
                <OverlayForm processing={commentProcessing} history={history} overlayId={overlayId} userInfo={userInfo} handleClickAway={handleClickAway}/>
            }
        </div>
    )
}