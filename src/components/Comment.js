import React, { useEffect, useState,useRef,useCallback } from "react";
import {useHistory,useParams,useLocation} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import {loadComment,getTheComment,toggleLikePost,getIsLoading,getIsProcessing,deletePostOrComment,commentPageCleared,updatedPath, postStatusCleared, getPostStatus} from '../store/posts'
import {getUserInfo,getUserProcessing,getUserStatus,statusCleared,toggleFollowUser} from '../store/user'
import {addNewComment, getAllComments,loadAllComments,toggleLikeComment,deleteComment,commentsCleared, commentStatusCleared, getCommentProcessing, getCommentStatus} from '../store/comments'

import OverlayForm from "./OverlayForm";
import Contents from "./Contents";
import CommentForm from "./CommentForm";
import CommentBlock from "./CommentBlock";
import OptionMenu from "./OptionMenu";
import MyCard from './MyCard'
import BackBar from "./BackBar";
import { grey } from "@mui/material/colors";
import { Typography } from "@mui/material";
import SkeletonCard from "./skeletons/SkeletonCard";
import SkeletonCommentBlock from "./skeletons/SkeletonCommentBlock";
import SnackBar from "./SnackBar/SnackBar";
import useLastItem from "../hooks/useLastItem";
import _ from 'lodash'
import {Helmet} from 'react-helmet-async'

export default function Comment() {
    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()

    const {commentId} = useParams()
    const isLoading = useSelector(getIsLoading)
    const isProcessing = useSelector(getIsProcessing)
    const theStatus = useSelector(getPostStatus) 
    const theComment = useSelector(getTheComment)  

    const theComments = useSelector(getAllComments) 
    const commentProcessing = useSelector(getCommentProcessing)
    const commentStatus = useSelector(getCommentStatus)
    const userInfo = useSelector(getUserInfo)
    const userStatus = useSelector(getUserStatus)
    const userProcessing = useSelector(getUserProcessing)


    useEffect(()=>{
        dispatch(updatedPath({path:location.pathname}))
        dispatch(loadComment(commentId,'comment',history))
        return ()=>{
          dispatch(commentPageCleared())
          dispatch(commentsCleared())
          // dispatch(statusCleared())
          // dispatch(postStatusCleared())
          dispatch(commentStatusCleared())
        }
    },[commentId])

    useEffect (()=>{
      if(isLoading===false&& theComment){
        dispatch(loadAllComments(commentId,'comment',theComments.cursor,limit.current,history))
      }
    },[isLoading])

    // intersection observer & pagination(infinite scroll)
    const limit = useRef(10) 
    const theRoot = useRef()
    const lastComment = useLastItem(theRoot,theComments.isLoading,theComments.cursor,dispatch,loadAllComments(commentId,'comment',theComments.cursor,limit.current,history))

    // overlay comment form & comment button
    const [openOverlay,setOpenOverlay] = useState(false)
    const [overlayId,setOverlayId] = useState()

    const handleCommentClick = (e,id)=>{
      setOpenOverlay(true)
      setOverlayId(id)
    }

    const handleClickAway = (e)=>{
      e.stopPropagation()
      if(e.target.id==='backButton'||e.target.id==='myOverlay'||e.target.id==='backIcon')
        setOpenOverlay(false)
    }

    // details button & likes button
    const handleDetailClick = (e,id)=>{
      console.log('the id is :',id);
      history.push(`/comment/${id}`)
    }

    const debouncingLike = useCallback(
      _.debounce(
        (id)=>{
              if(commentId===id)
                dispatch(toggleLikePost(id,history,'commentPage'))
              else if(commentId!==id)
                dispatch(toggleLikeComment(id,history))
            }
        ,120)
      ,[])
    
    const handleLikeClick = (e,id)=>{
      debouncingLike(id)
    } 

    // option menu
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [theSubject,setTheSubject] = useState(null) 

    const handleOptionClick = (e,subject) => {
      setAnchorEl(e.currentTarget);
      setTheSubject(subject)
    };
    
    const handleMenuClose = (e) => {
      setAnchorEl(null);
    };

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
      if(commentId===theSubject._id)
        dispatch(deletePostOrComment(theSubject._id,history,'commentPage'))
      else {
        dispatch(deleteComment('commentPage',theSubject._id,theSubject.allComments+1,history))
      }
      setOpenDeleteDialog(false)
  }
  
  const handleDeleteClose = () => {
  setOpenDeleteDialog(false);
  };

  return (
    <div ref={theRoot} style={{width: "100%",height: "100%",position: "relative",overflow: "auto",display: "flex",flexFlow: "column nowrap",}}>
      <Helmet>
        <title>{theComment.author} commented: {theComment.contents}/Moments</title>
        <meta name='description' content={`the comment: ${theComment.contents}, the author: ${theComment.author} `} />
      </Helmet>
      
      {/* toggle follow user snackbar & logout */}
      <SnackBar processing={userProcessing} status={userStatus} dispatch={dispatch} statusCleared={statusCleared} />
      {/* comment(subject) delete snackbar  */}
      <SnackBar processing={isProcessing} status={theStatus} dispatch={dispatch} statusCleared={postStatusCleared} />
      {/* comment & comment delete snackbar  */}
      <SnackBar processing={commentProcessing} status={commentStatus} dispatch={dispatch} statusCleared={commentStatusCleared} />

      <OptionMenu openDeleteDialog={openDeleteDialog} userInfo={userInfo}subject={theSubject}openMenu={openMenu}anchorEl={anchorEl}
          handleDeleteAction={handleDeleteAction}
          handleDeleteClose={handleDeleteClose}
          handleMenuClose={handleMenuClose}
          handleMenuOption={handleMenuOption}/>
      
      <div style={{marginBottom:'1rem',marginLeft:'1rem',marginRight:'1rem'}}>
        {!theComment?<SkeletonCard path={location.pathname} />
        :<MyCard 
            BackBar={<BackBar />}
            userInfo={userInfo}
            subject={theComment}
            handleLikeClick={handleLikeClick}
            handleOptionClick={handleOptionClick}
            Contents={<Contents message={theComment.contents}/>}
            CommentForm={<CommentForm processing={commentProcessing} history={history} userInfo={userInfo} subject={theComment} dispatch={dispatch} addNewComment={addNewComment}/>}
          />
        }

      {theComments.commentsArray.length===0?'':
            theComments.commentsArray.map((comment,index)=>{
                return <div key={comment._id} ref={theComments.commentsArray.length===index+1?lastComment.lastItemRef:null}>
                            <CommentBlock comment={comment} userInfo={userInfo} subject={theComment} 
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
      {!openOverlay?'':
           <OverlayForm processing={commentProcessing} history={history} overlayId={overlayId} userInfo={userInfo} handleClickAway={handleClickAway}/>     
      }
    </div>
  );
}
