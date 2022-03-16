import React, { useEffect,useState,useRef, useCallback } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import { updatedPath } from '../store/posts'
import OverlayForm from './OverlayForm'
import NotificationBlock from './NotificationBlock'

import {  Box, IconButton, Typography } from '@mui/material'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import {  grey, lightBlue } from '@mui/material/colors'
import { getUserInfo, getUserProcessing, getUserStatus, loadNotifs, notifsCleared, statusCleared } from '../store/user'
import SkeletonNotif from './skeletons/SkeletonNotif'
import { commentStatusCleared, getCommentProcessing, getCommentStatus } from '../store/comments'
import SnackBar from './SnackBar/SnackBar'
import useLastItem from '../hooks/useLastItem'
import { Helmet } from 'react-helmet-async'

export default function Notifications() {

    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()
    const userInfo = useSelector(getUserInfo)
    const userProcessing = useSelector(getUserProcessing)
    const userStatus = useSelector(getUserStatus)
    const commentStatus = useSelector(getCommentStatus)
    const commentProcessing = useSelector(getCommentProcessing)

    // intersection observer
    const limit = useRef(10)
    const theRoot = useRef()
    const lastNotif = useLastItem(theRoot,userInfo.isLoading,userInfo.notifications.cursor,dispatch,loadNotifs(userInfo.name,userInfo.notifications.cursor,limit.current,history))
    
    // first loading & skeleton
    const [firstLoading, setFirstLoading] = useState(true)
    
    useEffect(()=>{
        dispatch(updatedPath({path:location.pathname}))
        dispatch(loadNotifs(userInfo.name,null,limit.current,history))
        return ()=>{
            dispatch(notifsCleared())
            dispatch(commentStatusCleared())
        } 
    },[location.key])

    useEffect(() => {
        if(!userInfo.isLoading && firstLoading){
            setFirstLoading(false)
        }
    }, [userInfo.isLoading])

    // overlay form
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

    const handleBackClick = ()=>{
        history.goBack()
    }

    return (
        <Box sx={{position:'relative',display:'flex',flexFlow:'column nowrap', width:'100%',height:'100%'}}>
            <Helmet>
                <title>Notifications/Moments</title>
                <meta name='description' content='notifications page of Moments' />
            </Helmet>

            {/* follow & unfollow snackbar & logout*/}
            <SnackBar processing={userProcessing} status={userStatus} dispatch={dispatch} statusCleared={statusCleared} />

            {/* comment snackbar  */}
            <SnackBar processing={commentProcessing} status={commentStatus} dispatch={dispatch} statusCleared={commentStatusCleared} />
            
            <Box sx={{p:2,display:'flex',flexFlow:'row nowrap', justifyContent:'start',boxShadow:`0 1px 3px ${grey[300]}`}}>
                <Box sx={{width:'15%'}}>
                    <IconButton onClick={handleBackClick}>
                        <ArrowBackOutlinedIcon />
                    </IconButton>
                </Box>
                <Typography fontSize={'150%'} color={lightBlue[500]} width={'70%'} textAlign={'center'} alignSelf={'center'}>Notifications</Typography>
            </Box>
            <div ref={theRoot} style={{display:'flex',flexFlow:'column nowrap',flexGrow:1,overflow:'auto'}}>
            {/* notification lists */}

                {userInfo.notifications.array.length===0?''
                :userInfo.notifications.array.map((notif,index)=>{
                    return <div ref={userInfo.notifications.array.length===index+1?lastNotif.lastItemRef:null} key={index}>
                            <NotificationBlock notif={notif} handleCommentClick={handleCommentClick}/>
                        </div> 
                })}

                {firstLoading
                ?<><SkeletonNotif  /><SkeletonNotif /><SkeletonNotif /></>
                :userInfo.isLoading
                    ? <><SkeletonNotif  /><SkeletonNotif /><SkeletonNotif /></>
                    : <Typography variant='body2' color={grey[600]}>{!userInfo.notifications.cursor && 'No more result...' }</Typography>
                }
            </div>
            {/* overlay */}
            {!openOverlay
            ?''
            :<OverlayForm processing={commentProcessing} history={history} overlayId={overlayId} userInfo={userInfo} handleClickAway={handleClickAway}/>}
        </Box>
    )
}
