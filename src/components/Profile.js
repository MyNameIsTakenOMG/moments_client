import React, { useEffect, useRef, useState,useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getIsLoading, getPostsProfile, loadProfilePostsList, profilePostsCleared, updatedPath } from '../store/posts'
import { useLocation ,useHistory,useParams} from 'react-router-dom'
import { statusCleared, getUserInfo, getUserLoading, loadProfileFollowingList,loadProfileFollowersList, loadProfileUser, editUserProfile, profileCleared, getUserProcessing, getUserStatus, toggleFollowUser } from '../store/user'
import BioSearchBlock from './BioSearchBlock'
import PostSearchBlock from './PostSearchBlock'
import Joi from 'joi'
import joiSchemas from '../validations/joiSchemas'
import _ from 'lodash'
import {Helmet} from 'react-helmet-async'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import  Avatar  from '@mui/material/Avatar'
import  Button  from '@mui/material/Button'
import  Typography  from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {grey, lightBlue} from '@mui/material/colors'
import Tooltip from '@mui/material/Tooltip';
import  IconButton  from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import  TextField  from '@mui/material/TextField'
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import SportsBaseballOutlinedIcon from '@mui/icons-material/SportsBaseballOutlined';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import SkeletonProfile from './skeletons/SkeletonProfile'
import SkeletonBioBlock from './skeletons/SkeletonBioBlock'
import SkeletonPostBlock from './skeletons/SkeletonPostBlock'
import SnackBar from './SnackBar/SnackBar'
import BackBar from './BackBar'
import useLastItem from '../hooks/useLastItem'


export default function Profile() {

    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()
    const {username} = useParams()
    const userInfo = useSelector(getUserInfo)
    const userLoading = useSelector(getUserLoading)
    const userStatus = useSelector(getUserStatus)
    const userProcessing = useSelector(getUserProcessing)
    const postLoading = useSelector(getIsLoading)
    const postsProfile = useSelector(getPostsProfile)

    useEffect(()=>{
        console.log('this is from profile, path: ',location.pathname);

        dispatch(updatedPath({path:location.pathname}))
        dispatch(loadProfileUser(username,history))
        return ()=>{
            followingFirstFetch.current = false
            followersFirstFetch.current = false
            postsFirstFetch.current = false
            setTabValue('following')
            dispatch(profileCleared())
            dispatch(profilePostsCleared())
        }
    },[username,dispatch,history,location.pathname])

    // intersection observers 
    const theRoot = useRef()
    const limit = useRef(5)
    const lastFollowing = useLastItem(theRoot,userLoading,userInfo.profile.followingList.cursor,dispatch,loadProfileFollowingList(userInfo.profile.user.username,userInfo.profile.followingList.cursor,limit.current,history))  
    const lastFollower = useLastItem(theRoot,userLoading,userInfo.profile.followersList.cursor,dispatch,loadProfileFollowersList(userInfo.profile.user.username,userInfo.profile.followersList.cursor,limit.current,history))
    const lastPost = useLastItem(theRoot,postLoading,postsProfile.postsList.cursor,dispatch,loadProfilePostsList(userInfo.profile.user.username,postsProfile.postsList.cursor,limit.current,history))

    // tab menu
    const [tabValue, setTabValue] = useState('following')
    const followingFirstFetch = useRef(false)
    const followersFirstFetch = useRef(false)
    const postsFirstFetch = useRef(false)
    const handleTabChange = (e, newValue)=>{
        setTabValue(newValue)
        console.log('newValue: ',newValue);
    }
    
    useEffect(() => {
        if(userLoading===false){
            if(userInfo.profile.user.username){
                if(followingFirstFetch.current===false){
                    //  dispatch====> fetch following array first time
                    dispatch(loadProfileFollowingList(userInfo.profile.user.username,userInfo.profile.followingList.cursor,limit.current,history))
                    followingFirstFetch.current =true
                }
            }
        }
    }, [userLoading,userInfo.profile.user])

    useEffect(() => {
        if(userInfo.profile.user.username){
            if(tabValue==='following'&&followingFirstFetch.current===false){
                dispatch(loadProfileFollowingList(userInfo.profile.user.username,userInfo.profile.followingList.cursor,limit.current,history))
                followingFirstFetch.current =true
            }
            if(tabValue==='followers'&&followersFirstFetch.current===false){
                dispatch(loadProfileFollowersList(userInfo.profile.user.username,userInfo.profile.followersList.cursor,limit.current,history))
                followersFirstFetch.current =true
            }
            if(tabValue==='posts'&&postsFirstFetch.current===false){
                dispatch(loadProfilePostsList(userInfo.profile.user.username,postsProfile.postsList.cursor,limit.current,history))
                postsFirstFetch.current =true
            }
        }
    }, [tabValue])

    // edit form  &  validation
    const [openEditProfile, setOpenEditProfile] = useState(false)
    const [formData,setFormData] = useState({
        bio:'',
        location:'',
        profession:'',
        hobbies:'',
        avatar:''
    })
    const [previewAvatar,setPreviewAvatar] = useState('')
    const [errors, setErrors] = useState({})
    const {userProfile_schema} = joiSchemas
    // initialize the edit form
    useEffect(()=>{ 
        if(openEditProfile){
            let hobbiesStr = userInfo.profile.user.hobbies.join(',')
            setFormData({
                bio:userInfo.profile.user.bio,
                location:userInfo.profile.user.location,
                profession:userInfo.profile.user.profession,
                hobbies:hobbiesStr,
                avatar:'',
            })
            setPreviewAvatar(userInfo.profile.user.avatar)
        }
    },[openEditProfile,userInfo.profile.user])

    const handleChange = (e)=>{
        if(e.target.id==='avatar'){
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend=()=>{
                setPreviewAvatar(reader.result)
            }
            setFormData(pre=>{
                return {
                    ...pre,
                    avatar:e.target.files[0]
                }
            })
        }
        else{
            setFormData(pre=>{
                return {
                    ...pre,
                    [e.target.id]:e.target.value
                }
            })
        }
        const {name,value} = e.target
        const subSchema =Joi.object({[name]: userProfile_schema[name]})
        const {error} = subSchema.validate({[name]:value}) 
        let errorData = {...errors}
        if(error){
            errorData[name] = error.details[0].message
        }
        else{
            delete errorData[name]
        }
        setErrors(errorData)  
    }

    const handleSubmit = (e)=>{
        // e.preventDefault()
        let userProfileSchema = Joi.object(userProfile_schema)
        let result = userProfileSchema.validate(formData,{abortEarly:false})
        console.log('result: ',result);
        const {error} = result
        if(error){
            let errorData = {}
            for(let i of error.details){
                let name = i.path[0]
                let message = i.message
                errorData[name] = message
            }
            console.log(errorData);
            setErrors(errorData)
            return errorData
        }
        else{
            const fd = new FormData()
            fd.append('bio',formData.bio)
            fd.append('location',formData.location)
            fd.append('profession',formData.profession)
            fd.append('hobbies',formData.hobbies)
            if(formData.avatar) fd.append('avatar',formData.avatar)
    
            dispatch(editUserProfile(username,fd,history))
            return null
        }
    }

    const handleReset = ()=>{
        setFormData(pre=>{
            return {
                bio: userInfo.profile.user.bio,
                location:userInfo.profile.user.location,
                profession:userInfo.profile.user.profession,
                hobbies:userInfo.profile.user.hobbies.toString(),
                avatar:'',
            }
        })
        setPreviewAvatar(userInfo.profile.user.avatar)
    }
    
    const handleOpenEditProfile = (e)=>{
        setOpenEditProfile(true)
    }

    const handleCloseEditProfile = (e)=>{
        setOpenEditProfile(false)
    }

    const handleBioClick =(e,user)=>{
        history.push(`/profile/${user.username}`)
    }

    const handlePostClick = (e,post)=>{
        history.push(`/post/${post._id}`)
    }

    const debouncingFollow =useCallback(_.debounce((username,history)=>{
        dispatch(toggleFollowUser(username,history))
    },500)
    ,[])
    const handleToggleFollow = (e,username,history)=>{
        e.stopPropagation()
        debouncingFollow(username,history)
    }

    return (         
        <div ref={theRoot} style={{width:'100%',height:'100%',position:'relative',overflow:'auto',display:'flex',flexFlow:'column nowrap'}}>
            <Helmet>
                <title>User profile: {userInfo.profile.user.username}({userInfo.profile.user.email})/Moments</title>
                <meta name='description' content={`user profile, user:${userInfo.profile.user.username}`} />
            </Helmet>

            {/* toggle follow & edit user profile & logout */}
            <SnackBar processing={userProcessing} status={userStatus} dispatch={dispatch} statusCleared={statusCleared} />
            <Box sx={{position:'sticky',top:0,zIndex:10,backgroundColor:'white'}}>
                <BackBar />
            </Box>
            <Stack direction='column' spacing={2} mt={1} ml={3} mr={3}>
                {!userInfo.profile.user.username
                ?<SkeletonProfile />
                :<>
                    <Stack direction='row' justifyContent='space-between' position='relative' >
                        <Box sx={{width:'25%',minWidth:'68px',maxWidth:'110px',aspectRatio: (1 / 1).toString()}}>
                            <Avatar sx={{position:'relative',width:'100%',height:'100%'}} src={!userInfo.profile.user.avatar?'https://res.cloudinary.com/dviagu5kq/image/upload/q_50/v1639519312/momentsApp/icon_user_default.svg':userInfo.profile.user.avatar}></Avatar>
                        </Box>
                    {userInfo.name===userInfo.profile.user.username?<Button variant='outlined' sx={{alignSelf:'end',borderRadius:'50px', color:lightBlue[600],'&:hover':{color:'white',backgroundColor:lightBlue[600]}}} onClick={handleOpenEditProfile}>Edit profile</Button>:''} 
                    </Stack>
                    <Stack direction='column' spacing={1} mb={2}>
                        <Stack direction='row' spacing={1} justifyContent={'start'}>
                            <Typography>{userInfo.profile.user.username}</Typography>
                            {userInfo.profile.user.location?<Typography color={grey[500]}display={'flex'}><Tooltip title='Location'><LocationOnOutlinedIcon /></Tooltip>{userInfo.profile.user.location}</Typography>:''}
                        </Stack>
                        {userInfo.profile.user.profession?<Typography variant='body2' display={'flex'}><Tooltip title='Profession'><WorkOutlineOutlinedIcon/></Tooltip>:{userInfo.profile.user.profession}</Typography>:''} 
                        {userInfo.profile.user.hobbies.length!==0?<Typography variant='body2'display={'flex'}><Tooltip title='Hobbies'><SportsBaseballOutlinedIcon/></Tooltip>:{userInfo.profile.user.hobbies.map((hobby,index)=> <span key={index} style={{color:'#1e88e5'}}>{hobby}, </span> )}</Typography>:''} 
                        {userInfo.profile.user.bio?<Typography variant='body2'display={'flex'}><Tooltip title='Biography'><PersonPinOutlinedIcon/></Tooltip>:{userInfo.profile.user.bio}</Typography>:''} 
                    </Stack>
                    <Stack direction='row' spacing={2} justifyContent='start'>
                        <Typography>{userInfo.profile.user.following.length} following</Typography>
                        <Typography>{userInfo.profile.user.followers.length} followers</Typography>
                        <Typography>{userInfo.profile.user.posts.length} posts</Typography>
                    </Stack>
                    {/* tap menu */}
                    <Stack direction='row' px={2} justifyContent='center' borderBottom={1} borderColor='divider'>
                        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                            <Tab value='following' label='Following' />
                            <Tab value='followers' label='Followers' />
                            <Tab value='posts' label='Posts' />
                        </Tabs>
                    </Stack>
                </>}

                <Stack direction='column' position={'relative'}>
                    {tabValue==='following'
                    ?<>
                        {userInfo.profile.followingList.array.length===0?'':
                        userInfo.profile.followingList.array.map((user,index)=>{
                            return <div onClick={(e)=>handleBioClick(e,user)} key={user._id} ref={userInfo.profile.followingList.array.length===index+1?lastFollowing.lastItemRef:null}>
                                        <BioSearchBlock handleToggleFollow={(e)=>handleToggleFollow(e,user.username,history)} userInfo={userInfo} searchedUser={user} />
                                    </div>
                            })
                        }
                        {userLoading
                        ?<SkeletonBioBlock/>
                        :userInfo.profile.followingList.cursor
                        ?<SkeletonBioBlock/>
                        :<Typography variant='body2' color={grey[600]}>No more result...</Typography>}
                    </>
                    :tabValue==='followers'
                    ?<>
                        {userInfo.profile.followersList.array.length===0?''
                        :userInfo.profile.followersList.array.map((user,index)=>{
                            return <div onClick={(e)=>handleBioClick(e,user)} key={user._id} ref={userInfo.profile.followersList.array.length===index+1?lastFollower.lastItemRef:null}>
                                    <BioSearchBlock handleToggleFollow={(e)=>handleToggleFollow(e,user.username,history)} userInfo={userInfo} searchedUser={user} />
                            </div>
                        })}
                        {userLoading
                        ?<SkeletonBioBlock/>
                        :userInfo.profile.followersList.cursor
                        ?<SkeletonBioBlock/>
                        :<Typography variant='body2' color={grey[600]}>No more result...</Typography>}
                    </>
                    :tabValue==='posts'
                    ?<>
                        {postsProfile.postsList.array.length===0?''
                        :postsProfile.postsList.array.map((post,index)=>{
                            return <div onClick={(e)=>handlePostClick(e,post)} key={post._id} ref={postsProfile.postsList.array.length===index+1?lastPost.lastItemRef:null} >
                                    <PostSearchBlock searchedPost={post} />
                            </div>
                        })}
                        {postLoading
                        ?<SkeletonPostBlock/>
                        :postsProfile.postsList.cursor
                        ?<SkeletonPostBlock/>
                        :<Typography variant='body2' color={grey[600]}>No more result...</Typography>}
                    </>
                    :null}           
                </Stack>
            </Stack>

            {openEditProfile?
                <Box sx={{position:'fixed',top:0,left:0,width:'100%',height:'100%',zIndex:100,opacity:1,backgroundColor:'rgba(0,0,0,0.4)'}}>
                    <Box sx={{borderRadius:'4px',backgroundColor:'white',position:'relative',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:{xs:'100%',sm:'75%'},maxWidth:'600px',height:{xs:'100%',sm:'90%'}}}>
                        <Box sx={{p:2,display:'flex',alignItems:'center',justifyContent:'start',boxShadow:`0 1px 3px ${grey[400]}`}}>
                            <Box sx={{width:'15%'}}>
                                <IconButton onClick={handleCloseEditProfile}>
                                    <ArrowBackIcon/>
                                </IconButton>
                            </Box>
                            <Typography fontSize={'150%'} color={lightBlue[500]} width={'70%'} textAlign={'center'} alignSelf={'center'}>Edit your profile</Typography>
                        </Box>
                        <Stack direction='column' spacing={2} p={4} height='calc(100% - 72px)' overflow='auto'>
                            <Stack direction ='row' justifyContent='center' alignItems={'center'} position={'relative'} mt={12}>
                                <Box sx={{position:'absolute',transform:'translateX(-50%)', left:'50%',bottom:0,width:'25%',minWidth:'68px',maxWidth:'110px',aspectRatio:(1 /1).toString()}}>
                                    <Avatar sx={{width:'100%',height:'100%',position:'relative'}} src={previewAvatar?previewAvatar:!userInfo.profile.user.avatar?'https://res.cloudinary.com/dviagu5kq/image/upload/q_50/v1639519312/momentsApp/icon_user_default.svg':userInfo.profile.user.avatar}></Avatar>
                                    {userInfo.profile.user.isGoogleUser===true?'':
                                    <label htmlFor='avatar' style={{position:'absolute',right:'-10px',bottom:'-10px',backgroundColor:'white',borderRadius:'50%'}}>
                                        <input style={{display:'none'}} type='file' accept='image/*' id='avatar' name='avatar' onChange={handleChange}/>
                                        <IconButton color='primary' aria-label="upload picture" component='span' ><PhotoCamera/></IconButton>
                                    </label>}
                                </Box>
                            </Stack>                            
                            <TextField aria-required required error={errors['bio']?true:false} helperText={errors['bio']?errors['bio']:null} variant='outlined' multiline label='Bio' id='bio' name='bio' value={formData.bio} onChange={handleChange}/>
                            <TextField aria-required required error={errors['location']?true:false} helperText={errors['location']?errors['location']:null}variant='outlined' multiline label='Location' id='location' name='location' value={formData.location} onChange={handleChange}/>
                            <TextField aria-required required error={errors['profession']?true:false} helperText={errors['profession']?errors['profession']:null}variant='outlined' multiline label='Profession' id='profession' name='profession' value={formData.profession} onChange={handleChange}/>
                            <TextField aria-required required error={errors['hobbies']?true:false} helperText={errors['hobbies']?errors['hobbies']:null}variant='outlined' multiline label='Hobbies(Seperated by ",")' id='hobbies' name='hobbies' value={formData.hobbies} onChange={handleChange}/>
                            <Button disabled={userProcessing?true:false} variant='contained' sx={{borderRadius:'50px'}} color='primary' onClick={handleSubmit} >Save</Button>
                            <Button variant='contained' sx={{borderRadius:'50px'}} color='warning' onClick={handleReset} >Reset</Button>
                        </Stack>
                    </Box>
                </Box>
                :''}
        </div>          
    )
}
