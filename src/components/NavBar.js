import React, { useCallback } from 'react'
import { useSelector } from 'react-redux';
import { getPath } from '../store/posts';
import {useHistory} from 'react-router-dom'
import _ from 'lodash'
import {styled} from '@mui/material/styles'
import { lightBlue,grey } from '@mui/material/colors';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';


const MyNavBar = styled('div')(({theme})=>({
    // backgroundColor:lightBlue[200],
    display:'flex',
    flexFlow:'nowrap row',
    boxShadow:`0 -1px 1px ${grey[300]}`,
    [theme.breakpoints.up('xs')]:{
        boxShadow:`0 -1px 1px ${grey[300]}`,
        flexFlow:'nowrap row',
        width:'100%',
        position:'sticky',
        bottom:0
    },
    [theme.breakpoints.up('sm')]:{
        boxShadow:`1px 0 1px ${grey[300]}`,
        flexFlow:'nowrap column',
        width:'20%',
        // maxWidth:'288px',
        position:'static'
    },
    zIndex:10
}))

const MyNavBtn = styled('div')(({theme})=>({
    width:'20%',
    padding:theme.spacing(2),
    cursor:'pointer',
    display:'flex',
    flexFlow:'nowrap column',
    alignItems:'center',
    justifyContent:'center',
    fontSize:'60%',
    backgroundColor: 'white',
    color: lightBlue[600],
    transition:'all 0.2s ease-in-out',
    '&:hover':{
        backgroundColor:lightBlue[600],
        color:'white'
    },
    [theme.breakpoints.up('sm')]:{
        width:'100%',
        paddingTop:theme.spacing(1),
        paddingBottom:theme.spacing(1),
        paddingLeft:theme.spacing(3),
        paddingRight:theme.spacing(3)
    },
    [theme.breakpoints.up('md')]:{
        flexFlow:'row nowrap',
        justifyContent:'start',
        '& span':{
            paddingLeft:theme.spacing(1)
        },
        paddingTop:theme.spacing(2),
        paddingBottom:theme.spacing(2),
        paddingLeft:theme.spacing(5),
        paddingRight:theme.spacing(8)
    }
}))


export default function NavBar() {
    const history = useHistory()
    const path = useSelector(getPath)

    const debouncingClick = useCallback(_.debounce((id)=>history.push(`/${id}`),120),[])

    const handleClick = (e)=>{   
            // history.push(`/${e.currentTarget.id}`)
            let id = e.currentTarget.id
            debouncingClick(id)
    }

    return (
        <MyNavBar>
            <MyNavBtn id='home' style={{backgroundColor: path.match(/home/)&&lightBlue[600],color:path.match(/home/)&&'white' }} onClick={handleClick}>
                <HomeOutlinedIcon/>
                <span>Home</span>
                </MyNavBtn>
            <MyNavBtn id='followingPosts' style={{backgroundColor: path.match(/followingPosts/)&&lightBlue[600],color:path.match(/followingPosts/)&&'white' }} onClick={handleClick}>
                <AddPhotoAlternateOutlinedIcon />
                <span>Follow</span> 
                </MyNavBtn>
            <MyNavBtn id='newPost' style={{backgroundColor: path.match(/newPost/)&&lightBlue[600],color:path.match(/newPost/)&&'white' }} onClick={handleClick}>
                <AddCircleOutlineOutlinedIcon />
                <span>New</span>
                </MyNavBtn>
            <MyNavBtn id='myPosts' style={{backgroundColor: path.match(/myPosts/)&&lightBlue[600],color:path.match(/myPosts/)&&'white' }} onClick={handleClick}>
                <PersonPinOutlinedIcon />
                <span>My</span> 
                </MyNavBtn>
            <MyNavBtn id='search' style={{backgroundColor: path.match(/search/)&&lightBlue[600],color:path.match(/search/)&&'white' }} onClick={handleClick}>
                <ImageSearchIcon />
                <span>Search</span> 
                </MyNavBtn>
        </MyNavBar>
    )
}
