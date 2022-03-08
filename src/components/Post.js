import React, { useEffect, useRef, useState, useCallback } from "react";
import {useHistory,useParams,useLocation} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import {getThePost,loadPost,getIsLoading,toggleLikePost, getIsProcessing,deletePostOrComment, postPageCleared,updatedPath, getPostStatus, postStatusCleared} from '../store/posts'
import {addNewComment, getAllComments,loadAllComments,toggleLikeComment,deleteComment, commentsCleared, getCommentProcessing, getCommentStatus, commentStatusCleared} from '../store/comments'
import {getUserInfo,getUserProcessing,getUserStatus,statusCleared,toggleFollowUser} from '../store/user'

import OverlayForm from "./OverlayForm";
import OptionMenu from "./OptionMenu";
import Contents from "./Contents";
import CommentForm from "./CommentForm";
import CommentBlock from "./CommentBlock";
import MyCard from "./MyCard";
import BackBar from "./BackBar";
import { grey } from "@mui/material/colors";
import { Typography } from "@mui/material";
import SkeletonCard from "./skeletons/SkeletonCard";
import SkeletonCommentBlock from "./skeletons/SkeletonCommentBlock";
import SnackBar from "./SnackBar/SnackBar";
import useLastItem from "../hooks/useLastItem";
import _ from 'lodash'
import { Helmet } from "react-helmet-async";

export default function Post() {
    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()
    // console.log('location.state.from: ',location.state.from );

    const {postId} = useParams()
    const thePost = useSelector(getThePost)  
    const postIsLoading = useSelector(getIsLoading)
    const postIsProcessing = useSelector(getIsProcessing)
    const postStatus = useSelector(getPostStatus)
    const userInfo = useSelector(getUserInfo)
    const userStatus = useSelector(getUserStatus)
    const userProcessing = useSelector(getUserProcessing)
    const theComments = useSelector(getAllComments)   
    const commentProcessing = useSelector(getCommentProcessing)
    const commentStatus = useSelector(getCommentStatus)
    
    useEffect(()=>{
      dispatch(updatedPath({path:location.pathname}))
      dispatch(loadPost(postId,'post',history))
      return ()=>{
        dispatch(postPageCleared())
        dispatch(commentsCleared())
        // dispatch(statusCleared())
        // dispatch(postStatusCleared())
        dispatch(commentStatusCleared())
      }
    },[])
    
    useEffect (()=>{
      if(postIsLoading===false&& thePost){
        dispatch(loadAllComments(postId,'post',theComments.cursor,limit.current,history))
      }
    // },[postIsLoading,thePost])
    },[postIsLoading])
    
    // intersection observer & pagination(infinite scroll)
    const limit = useRef(10) 
    const theRoot = useRef()
    const lastComment = useLastItem(theRoot,theComments.isLoading,theComments.cursor,dispatch,loadAllComments(postId,'post',theComments.cursor,limit.current,history))
      
    // overlay comment form & comment button
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

    // details button & likes button
    const handleDetailClick = (e,id)=>{
      history.push(`/comment/${id}`)
    }

    const debouncingLike = useCallback(
      _.debounce(
        (id)=>{
              if(postId===id)
                dispatch(toggleLikePost(id,history,'postPage'))
              else if(postId!==id)
                dispatch(toggleLikeComment(id,history))
            }
        ,120)
      ,[])
    const handleLikeClick = (e,id)=>{
      debouncingLike(id)
    } 

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
        if(postId===theSubject._id)
          dispatch(deletePostOrComment(theSubject._id,history,'postPage'))
        else {
          dispatch(deleteComment('postPage',theSubject._id,theSubject.allComments+1,history))
        }
        setOpenDeleteDialog(false)
    }
    
    const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
    };

    
  return (
    <div ref={theRoot} style={{width: "100%",height: "100%",position: "relative",overflow: "auto",display: "flex",flexFlow: "column nowrap",}}>
      <Helmet>
        <title>{thePost.author} posted: {thePost.title}/Moments</title>
        <meta name='description' content={`the post: ${thePost.title}, the author: ${thePost.author} `} />
      </Helmet>
      
      {/* toggle follow user snackbar& logout */}
      <SnackBar processing={userProcessing} status={userStatus} dispatch={dispatch} statusCleared={statusCleared} />
      {/* post(subject) delete snackbar  */}
      <SnackBar processing={postIsProcessing} status={postStatus} dispatch={dispatch} statusCleared={postStatusCleared} />
      {/* comment & comment delete snackbar  */}
      <SnackBar processing={commentProcessing} status={commentStatus} dispatch={dispatch} statusCleared={commentStatusCleared} />

      <OptionMenu openDeleteDialog={openDeleteDialog} userInfo={userInfo}subject={theSubject}anchorEl={anchorEl}openMenu={openMenu}
            handleDeleteClose={handleDeleteClose}
            handleDeleteAction={handleDeleteAction}
            handleMenuClose={handleMenuClose}
            handleMenuOption={handleMenuOption}
           />

      <div style={{marginBottom:'1rem',marginLeft:'1rem',marginRight:'1rem'}}>
      {!thePost
          ?<SkeletonCard path={location.pathname} />
          :<MyCard 
          BackBar={<BackBar />}
          userInfo={userInfo} 
          subject={thePost} 
          handleLikeClick={handleLikeClick} 
          handleOptionClick={handleOptionClick} 
          Contents={<Contents message={thePost.contents}/>} 
          CommentForm={<CommentForm processing={commentProcessing} history={history} userInfo={userInfo} subject={thePost} dispatch={dispatch} addNewComment={addNewComment}/>}
            />
      }
      {theComments.commentsArray.length===0?'':
      theComments.commentsArray.map((comment,index)=>{
          return <div key={comment._id} ref={theComments.commentsArray.length===index+1?lastComment.lastItemRef:null}>
                      <CommentBlock comment={comment} userInfo={userInfo} subject={thePost} 
                                handleOptionClick={handleOptionClick}
                                handleLikeClick={handleLikeClick}
                                handleDetailClick={handleDetailClick}
                                handleCommentClick={handleCommentClick}/>
                  </div>
          })
      }
      {theComments.isLoading
      ?<SkeletonCommentBlock />
      :theComments.cursor!==null
      ?<SkeletonCommentBlock />
      :<Typography variant='body2' color={grey[600]}>No more result...</Typography>}
      </div>
      {/* <h1>{postIsLoading?'Post is loading...':<>{theComments.isLoading?'Comments are loading...':'heelo'}</>}</h1> */}
      {!openOverlay?'':
          <OverlayForm processing={commentProcessing} history={history} overlayId={overlayId} userInfo={userInfo} handleClickAway={handleClickAway}/>
      }
    </div>
  );
}
