import React, { useState } from 'react'
import {useLocation} from 'react-router-dom'
import {useDispatch} from 'react-redux'

import {styled} from '@mui/material/styles'
import {Box} from '@mui/system';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { addNewComment } from '../store/comments';

import joiSchemas from '../validations/joiSchemas';


export default function OverlayForm({overlayId,userInfo,handleClickAway,history,processing}) {

    const location = useLocation()
    const {pathname} = location
    const dispatch = useDispatch()

    const [contents,setContents] = useState('')
    
    //validation
    const {comment_schema} = joiSchemas
    const [errors,setErrors] = useState('')

    const handleChange = (e)=>{
        setContents(e.target.value)

        let errorData = ''
        let {name,value} = e.target
        let {error} = comment_schema.validate({[name]:value})
        if(error) errorData = error.details[0].message
        else errorData =''
        setErrors(errorData)
    }


    const handleSubmit = (e)=>{
        e.preventDefault()

        let errorData = ''
        let {error} = comment_schema.validate({contents:contents})
        if(error) {
            errorData = error.details[0].message
            setErrors(errorData)
        }
        else{
            const fd = new FormData()
            let path =''
            let type=''
            fd.append('contents',contents)
            // if it is a notif reply
            if(pathname.match(/notifications/)){
                fd.append('commentId',overlayId)
                path='notifications'
                type='indirect'
                dispatch(addNewComment(path,overlayId,fd,type,history,true))
            }
            // if it is not a notif reply
            else{
                if(pathname.search(/(home|myPosts|followingPosts)/)!==-1){
                    fd.append('postId',overlayId)
                    type='direct'
                }else{
                    fd.append('commentId',overlayId)
                    type='indirect'
                }
                if(pathname.search(/home/)!==-1) path='allPosts'
                else if(pathname.search(/myPosts/)!==-1) path ='myPosts'
                else if(pathname.search(/followingPosts/)!==-1) path ='followingPosts'
                else if(pathname.search(/post/)!==-1) path ='postPage'
                else if(pathname.search(/comment/)!==-1) path ='commentPage'
                dispatch(addNewComment(path,overlayId,fd,type,history))
            }
            setContents('')
        }

    }

    return (
        <Box sx={{backgroundColor:'rgba(0,0,0,0.4)',opacity:1,zIndex:100,position:'fixed',top:0,left:0,width:'100%',height:'100%'}} id='myOverlay' onClick={handleClickAway}>
            <Box sx={{borderRadius:'4px',p:1,backgroundColor:'white',position:'relative',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:{xs:'100%',sm:'75%'},maxWidth:'600px',height:{xs:'100%',sm:'auto'}}}>
                <Box sx={{display:'flex',paddingLeft:'0.5rem',paddingBottom:'0.5rem',paddingTop:'0.5rem',justifyContent:'start'}}>
                    <IconButton id='backButton'  onClick={handleClickAway}>
                        <ArrowBackIcon id='backIcon'/>
                    </IconButton>
                </Box>
                
                <Box sx={{display:'flex',paddingTop:'0.5rem',borderTop:'1px solid rgba(0,0,0,0.1)'}}>
                    <Avatar src={!userInfo.avatar?'https://res.cloudinary.com/dviagu5kq/image/upload/q_50/v1639519312/momentsApp/icon_user_default.svg':userInfo.avatar} sx={{marginLeft:'0.5rem',marginRight:'0.5rem'}}>
                        R
                    </Avatar>
                    <form onSubmit={handleSubmit} style={{flexGrow:1,display:'flex',flexFlow:'column nowrap',marginRight:'0.5rem'}}>
                        <TextField error={errors!==''?true:false} helperText={errors!==''?errors:null} aria-required required minRows={8} multiline id='contents' name='contents' label='Leave your comment' value={contents} onChange={handleChange} />
                        <Button disabled={processing?true:false} type='submit' variant='contained' size='small' sx={{borderRadius:'30px',marginTop:'0.5rem',marginBottom:'0.5rem',alignSelf:'end'}}>Reply</Button>
                    </form>
                </Box>
            </Box>
        </Box>
    )
}
