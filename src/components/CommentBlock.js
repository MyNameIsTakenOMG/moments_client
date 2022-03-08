import React from 'react'
import { Box } from '@mui/material'
import { Avatar } from '@mui/material'
import { Typography } from '@mui/material'
import { IconButton } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PageviewIcon from "@mui/icons-material/Pageview";
import { Stack } from '@mui/material'
import { blue } from '@mui/material/colors'

import dayjs from '../day-js/dayjs'


export default function CommentBlock({handleOptionClick,handleLikeClick,handleCommentClick,handleDetailClick,comment,subject,userInfo}) {
  return (
            <Box  sx={{display:'flex',pt:2,pb:2,borderBottom:'1px solid rgba(0,0,0,0.1)'}}>
                 <Avatar sx={{marginRight:'0.5rem'}} src={!comment.avatar?'https://res.cloudinary.com/dviagu5kq/image/upload/q_50/v1639519312/momentsApp/icon_user_default.svg':comment.avatar}>H</Avatar>
                 <Box sx={{flexGrow:1,display:'flex',flexFlow:'column nowrap'}}>
                   <Box sx={{display:'flex',justifyContent:'space-between'}}>
                     <Stack direction='column'>
                       <Typography variant='body2' fontWeight={600}>{comment.author}</Typography>
                       <Typography variant='body2' color='text.secondary'>{ dayjs(comment.createdAt).format('ll LT') }</Typography>
                     </Stack>
                     <IconButton aria-label='more options' onClick={(e)=>handleOptionClick(e,comment)}>
                       <MoreHorizIcon />
                     </IconButton>
                   </Box>
                   <Typography variant='body2' >
                     reply to <span style={{color:`${blue['A700']}`}}>@{subject.author}</span>
                     </Typography>
                   <Typography>{comment.contents}</Typography>
                   <Box sx={{display:'flex', justifyContent:'space-between'}}>
                       <IconButton aria-label="like this post" sx={{color:comment.likes.findIndex(name=>name===userInfo.name)===-1?'grey':'red'}} onClick={(e)=>handleLikeClick(e,comment._id)}>
                       <span>{comment.likes.length===0?null:comment.likes.length}</span><FavoriteIcon />
                       </IconButton>
                       <IconButton aria-label="comments" onClick={(e)=>handleCommentClick(e,comment._id)}>
                       <span>{comment.allComments===0?null:comment.allComments}</span><ChatBubbleOutlineIcon />
                       </IconButton>
                       <IconButton aria-label="show more" onClick={(e)=>handleDetailClick(e,comment._id)}>
                         <PageviewIcon />
                       </IconButton>
                   </Box>
                 </Box>
             </Box>
  )
}
