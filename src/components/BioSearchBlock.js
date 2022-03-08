import React from 'react'

import { Box,Avatar,Typography,Button,Stack } from '@mui/material'
import { grey,lightBlue } from '@mui/material/colors'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

export default function BioSearchBlock({searchedUser,userInfo,handleToggleFollow}) {
    return (
        <Box sx={{position:'relative',p:1,display:'flex',flexFlow:'row nowrap',transition:'all 0.1s ease-in-out',cursor:'pointer','&:hover':{backgroundColor:grey[100]},'&:hover button:hover':{backgroundColor:lightBlue[800],color:'white'}}}>
                    <Avatar  sx={{width:'56px',height:'56px',mr:2,}} aria-label="avatar"src={!searchedUser.avatar?'https://res.cloudinary.com/dviagu5kq/image/upload/q_50/v1639519312/momentsApp/icon_user_default.svg':searchedUser.avatar}></Avatar> 
                    <Stack direction='column' flexGrow={1}>
                        <Stack direction='row' justifyContent={'space-between'}>
                            <Stack direction='column'>
                                <Typography variant='subtitle1' fontWeight={600}>{searchedUser.username}</Typography>
                                <Typography variant='body2' color={grey[500]}><LocationOnOutlinedIcon /> {searchedUser.location?searchedUser.location:''}</Typography>
                            </Stack>
                            <Button onClick={handleToggleFollow} variant='outlined' sx={{alignSelf:'center',borderRadius:'50px',px:2,mb:1,color:lightBlue[600]}}>{userInfo.following.findIndex(name=>name===searchedUser.username)===-1?'Follow':'Unfollow'}</Button>
                        </Stack>
                        <Typography>Profession: {searchedUser.profession}</Typography>
                        <Typography>Hobbies:{searchedUser.hobbies.toString()}</Typography>
                        <Typography>Bio: {searchedUser.bio}</Typography>
                    </Stack>
                </Box>
    )
}
