import React, { useCallback, useEffect, useState } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {signOutUser,getUserInfo,notifNumIncremented} from '../store/user'
import socket from '../socketio-client/socket'
import _ from 'lodash'

import {styled, createTheme,ThemeProvider} from '@mui/material/styles'
import { lightBlue ,grey} from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import Stack  from '@mui/material/Stack'
import { Badge, IconButton } from '@mui/material'
import { Tooltip } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const logoFont = createTheme({
    typography:{
        fontFamily:[
            'dancing script','cursive'
        ].join(',')
    }
})

const MyOverlay = styled(props=>{
    const {open,...others} = props
    return <div {...others} />
})(({theme,open})=>({
    position:'fixed',
    top:0,
    left:0,
    width:open? 'calc(100% - 240px)': '100%',
    height :'100%',
    opacity: open? 1: 0,
    zIndex: open ? 100 : -100,
    backgroundColor:open? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
    transition:open?'z-index 0.1s ease, opacity .5s ease 0.1s , width .5s ease 0.1s ,background-color .5s ease 0.1s '
    :'z-index 0.1s ease .5s,opacity .5s ease,width .5s ease,background-color .5s ease'
}))

const MyMenu = styled(Box,{shouldForwardProp:prop=>prop!=='open'})(({theme,open})=>({
    position:'fixed',
    width:240,
    height:'100%',
    top:0,
    right:0,
    zIndex:100,
    padding:theme.spacing(2),
    backgroundColor:'white',
    transform:open? 'translateX(0)' :'translateX(100%)',
    transition:'all  .5s ease',
    display:'flex',
    flexFlow:'column nowrap'
}))


export default function Banner() {
    const history = useHistory()
    const dispatch = useDispatch()
    const userInfo = useSelector(getUserInfo)

    const [open,setOpen] = useState(false)

    const handleOpenMenu = (e)=>{
        console.log(userInfo);
        setOpen(true)
    }
    const handleCloseMenu = (e)=>{
        setOpen(false)
    }

    const handleProfileClick = (e)=>{
        setOpen(false)
        history.push(`/profile/${userInfo.name}`)
    }

    const handleSignOutClick = (e)=>{
        dispatch(signOutUser(history))
        setOpen(false)
        socket.emit('logout',{name:userInfo.name})
    }

    // debouncing
    const debouncingNotifs = useCallback(_.debounce(()=>history.push('/notifications'),120),[])
    const handleNotifClick = (e)=>{
        // history.push('/notifications')
        debouncingNotifs()
    }
    useEffect(()=>{
        if(userInfo.name!==''){
            console.log('hello from banner login');
            if(!socket.connected) socket.connect()
            socket.emit('login',{name:userInfo.name})
        }
    },[userInfo.name])

    useEffect(()=>{
        console.log('socket like listeners before: ',socket.listeners('like'));

        socket.off('welcome').on('welcome',message=>{
            console.log(message);
        })
        socket.off('like').on('like',message=>{
            console.log('socket like...');
            console.log(message);    
            dispatch(notifNumIncremented())
        })
        socket.off('comment').on('comment',message=>{
            console.log('socket comment...');
            console.log(message);
            dispatch(notifNumIncremented())
        })

        // return ()=>{
        //     socket.off('welcome')
        //     socket.off('like')
        // }
    },[])


    return (
        <>
        <Box sx={{zIndex:20,boxShadow:`0 1px 1px ${grey[300]}`,p:2,bgcolor:'white',display:'flex',flexFlow:'nowrap row',justifyContent:'space-between',alignItems:'center'}}>
            <Stack direction='row' spacing={1} alignItems={'center'}>
                <ThemeProvider theme={logoFont}>
                    <Avatar variant='rounded' sx={{width:{xs:40,lg:48,xl:56},height:{xs:40,lg:48,xl:56},bgcolor:lightBlue[600],fontWeight:'700'}}>M</Avatar>
                    <Typography variant='h5' component='div' sx={{color:lightBlue[600],fontWeight:'700',alignSelf:'center'}}>Moments</Typography>
                </ThemeProvider>
            </Stack>
            <Stack direction='row' alignItems='center'>
                <IconButton sx={{mr:1}} onClick={handleNotifClick} aria-label={`${userInfo.notifications.new_notifs} new notifications`}>
                    <Badge color={'error'} badgeContent={userInfo.notifications.new_notifs}>
                        <NotificationsNoneIcon />
                    </Badge>
                </IconButton>
                <Typography variant='subtitle2' sx={{color:'black',alignSelf:'center',width:'60px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Hi, <Tooltip title={userInfo.name}><span style={{fontSize:'inherit'}}>{userInfo.name}</span></Tooltip></Typography>
                <Avatar sx={{width:{xs:40,lg:48,xl:56},height:{xs:40,lg:48,xl:56},cursor:'pointer'}} src={!userInfo.avatar?'https://res.cloudinary.com/dviagu5kq/image/upload/q_50/v1639519312/momentsApp/icon_user_default.svg':userInfo.avatar} onClick={handleOpenMenu}>N</Avatar>
            </Stack> 
        </Box>
        <MyOverlay open={open} onClick={handleCloseMenu}></MyOverlay>
        <MyMenu open={open}>
                <Avatar src={!userInfo.avatar?'https://res.cloudinary.com/dviagu5kq/image/upload/q_50/v1639519312/momentsApp/icon_user_default.svg':userInfo.avatar} sx={{mb:1}}>N</Avatar>
                <Typography variant='button' >@{userInfo.name}</Typography>
                <Typography variant='body2' gutterBottom>{userInfo.email}</Typography>
                <Typography variant='body2' component='div' sx={{display:'flex','& *':{mr:1}}} gutterBottom>
                    <span>{userInfo.following.length} Following</span>
                    <span>{userInfo.followers.length} Followers</span>
                </Typography>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleProfileClick}>
                            <ListItemIcon>
                                <PersonOutlineIcon />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleSignOutClick}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Log out" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </MyMenu>
        </>
    )
}
