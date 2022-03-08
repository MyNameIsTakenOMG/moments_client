import React from 'react';
import { useHistory } from 'react-router-dom';

import {styled} from '@mui/material/styles'
import { Box, Stack, Avatar, Typography, Button, Divider } from '@mui/material';
import { grey ,blue} from '@mui/material/colors';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';


const MyTooltip = styled(({className,...props})=>(
    <Tooltip {...props} classes={{popper:className}}/>
))(({theme})=>({
    [`& .${tooltipClasses.tooltip}`]:{
        backgroundColor: theme.palette.common.black,
        // color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(14),
        // border: '1px solid #dadde9',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
      }
}))


export default function NotificationBlock({notif,handleCommentClick}) {

    const history = useHistory()

    const handleCheckThePost=(e,postId)=>{
        history.push(`/post/${postId}`)
    }

  return <Stack direction='row' py={1} px={1} sx={{'&:hover':{backgroundColor:grey[50],cursor:'pointer'}}}>
            <Box sx={{mr:1}}>
                <Avatar src={notif.sender_avatar}>H</Avatar>
            </Box>
            {/* container */}
            <Stack direction='column' flexGrow={1} gap={1}>
                {/* title */}
                <Stack direction='column'>
                    <Typography variant='subtitle1'> <span style={{fontWeight:600,color:'#42a5f5'}}>@{notif.sender}</span> <span style={{fontStyle:'italic',fontWeight:500}}>{notif.notif_type==='like'?'Liked':'Commented on'}</span> your {notif.subject_type}: </Typography>
                    <MyTooltip arrow  title={notif.subject_contents }>
                        <Typography alignSelf={'start'} color={grey[400]} sx={{width:'250px',whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden'}}> {notif.subject_contents} </Typography> 
                    </MyTooltip> 
                    {notif.notif_type==='like'?'':<Divider />}
                </Stack>
                {/* contents */}
                <Typography variant='body2'>{notif.contents}</Typography>
                {/* buttons */}
                <Stack direction='row' justifyContent={'end'} gap={1}>
                    {notif.messageId===null?''
                    :<Button variant='outlined' sx={{borderRadius:'50px','&:hover':{backgroundColor:blue[600],color:'white'}}} onClick={(e)=>handleCommentClick(e,notif.messageId)}>Reply</Button>}          
                    <Button variant='outlined' sx={{mr:2,borderRadius:'50px','&:hover':{backgroundColor:blue[600],color:'white'}}} onClick={(e)=>handleCheckThePost(e,notif.postId)}>Check the Post</Button>
                </Stack>
            </Stack>
        </Stack>
}
