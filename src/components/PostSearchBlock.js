import React from 'react'
import { Box,Stack,Typography,IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { grey,lightBlue } from '@mui/material/colors';

import dayjs from '../day-js/dayjs';

export default function PostSearchBlock({searchedPost}) {
    return (
        <Box sx={{position:'relative',display:'flex',flexFlow:'row nowrap',transition:'all 0.1s ease-in-out',cursor:'pointer','&:hover':{backgroundColor:grey[200]}}}>
            <img src={searchedPost.image} alt="no image found" style={{width:'40%',minHeight:'180px',objectFit:'cover'}}/>
            <Box sx={{flexGrow:1,p:1,display:'flex',flexFlow:'column nowrap'}}>
                <Stack sx={{flexGrow:1}} direction='column' mt={2} spacing={1} justifyContent={'space-around'} alignItems={'center'} flexGrow={1}>
                    <Typography variant='h6' textAlign={'center'} >{searchedPost.title}</Typography>
                    <Typography variant='body2' color={grey[500]}>{ dayjs(searchedPost.createdAt).format('ll LT') }</Typography>
                    <Typography variant='body1'>{searchedPost.author}</Typography>
                    <Typography variant='caption' textAlign={'center'} color={lightBlue[600]}>{searchedPost.tags.map((tag,index)=><span key={index}>#{tag} </span>)}</Typography>
                </Stack>
                <Stack mt={0.5} direction='row' justifyContent={'space-around'}>
                    <Box sx={{display:'flex',flexFlow:'row nowrap', alignItems:'center'}}>
                    <span>{searchedPost.likes.length!==0?searchedPost.likes.length:null}</span><FavoriteIcon/>
                    </Box>
                    <Box sx={{display:'flex',flexFlow:'row nowrap', alignItems:'center'}}>
                    <span>{searchedPost.allComments!==0?searchedPost.allComments:null}</span><ChatBubbleOutlineIcon/>
                    </Box>
                </Stack>
            </Box>
     </Box>
    )
}
