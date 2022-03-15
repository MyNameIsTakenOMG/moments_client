import React from 'react'
import {getUserInfo} from '../store/user'
import { useSelector } from 'react-redux'

import Banner from '../components/Banner'
import NavBar from '../components/NavBar'
import Container from '../components/Container'
import Box from '@mui/material/Box'
import { Avatar, Paper, Stack, Typography } from '@mui/material'
import { Skeleton } from '@mui/material'
import { grey, lightBlue } from '@mui/material/colors'



export default function MainPage() {

    const userInfo = useSelector(getUserInfo)

    return (
        <Box sx={{position:'relative',width:'100%',height:'100%',overflow:'hidden',display:'flex',flexFlow:'column nowrap'}}>
            <Banner />
            <Box sx={{height:'calc(100% - 72px)',display:'flex',justifyContent:{sm:'flex-end'},flexFlow:{xs:'column nowrap',sm:'row-reverse nowrap'}}}>
                {/* profile board  */}
                {/* <Box sx={{display:{xs:'none',sm:'block'},width:{sm:'30%',md:'35%'},maxWidth:'504px'}}> */}
                <Box sx={{display:{xs:'none',sm:'block'},width:{sm:'30%',md:'35%'}}}>
                    <Paper elevation={2} sx={{mx:3,mt:1, overflow:'hidden'}}>
                        <Stack direction={'column'}  spacing={2} pb={1}>
                            <Box sx={{borderRadius:'4px 4px 0 0',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',aspectRatio:(4 / 3).toString(),backgroundColor:lightBlue[600]}}>
                                <Box sx={{p:2,height:'100%',aspectRatio:(1 / 1).toString()}}>
                                    {!userInfo.name
                                    ?<Skeleton variant='circular' sx={{width:'100%',height:'100%'}}/>
                                    :<Avatar sx={{width:'100%',height:'100%'}} src={!userInfo.avatar?'https://res.cloudinary.com/dviagu5kq/image/upload/q_50/v1639519312/momentsApp/icon_user_default.svg':userInfo.avatar} >M</Avatar>
                                    }
                                </Box>
                            </Box>
                            <Stack direction={'column'} alignItems={'start'} spacing={1} pl={1}>
                                {!userInfo.name
                                ?<>
                                    <Skeleton height={20} width={'90%'} sx={{ml:1}}/>
                                    <Skeleton height={20} width={'90%'} sx={{ml:1}}/>
                                    <Skeleton height={20} width={'90%'} sx={{ml:1}}/>
                                    <Skeleton height={20} width={'90%'} sx={{ml:1}}/>
                                    <Skeleton height={20} width={'90%'} sx={{ml:1}}/>
                                </>
                                :<>
                                    <Typography fontWeight={600} >{userInfo.name}</Typography>
                                    <Typography color={grey[400]} >{userInfo.email}</Typography>
                                    <Typography >Posts: {userInfo.posts.length}</Typography>
                                    <Typography >Followings: {userInfo.following.length}</Typography>
                                    <Typography >Followers: {userInfo.followers.length}</Typography>
                                </>
                                }   
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>
                <Container />
                <NavBar />
            </Box>
        </Box>
    )
}
