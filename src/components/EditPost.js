import React, { useEffect, useState } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {getEditPost,updateMyPost,loadEditPost,getIsLoading,getIsProcessing,updatedPath, editPostCleared, getPostStatus, postStatusCleared} from '../store/posts'
import {getUserInfo,getUserProcessing,getUserStatus, statusCleared} from '../store/user'
import {useHistory,useParams,useLocation} from 'react-router-dom'
import joiSchemas from '../validations/joiSchemas'
import Joi from 'joi'

import {grey, lightBlue} from '@mui/material/colors'
import Typography from '@mui/material/Typography'; 
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Stack , Box} from '@mui/material'
import { IconButton } from '@mui/material'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';   
import SkeletonEditPost from './skeletons/SkeletonEditPost'
import SnackBar from './SnackBar/SnackBar'
import { Helmet } from 'react-helmet-async'

export default function EditPost() {
    const location = useLocation()
    const history = useHistory()
    const {postId} = useParams()
    const userInfo = useSelector(getUserInfo)
    const userProcessing = useSelector(getUserProcessing)
    const userStatus = useSelector(getUserStatus)
    const thePost = useSelector(getEditPost)
    const postLoading = useSelector(getIsLoading)
    const postProcessing = useSelector(getIsProcessing)
    const postStatus = useSelector(getPostStatus)
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        title: '',
        tags: '',
        contents:'',
        image:''
    })
    const [previewImage, setPreviewImage]= useState()

    useEffect(()=>{
        dispatch(loadEditPost(postId,history))
        return ()=>{
            dispatch(editPostCleared())
        }
    },[])

    useEffect(()=>{
        dispatch(updatedPath({path:location.pathname}))
        if(!postLoading&&thePost){
            setFormData({
                title:thePost.title,
                tags:thePost.tags.toString(),
                contents:thePost.contents,
                image:''
            })
            setPreviewImage(thePost.image)
        }
        
    },[thePost,postLoading])

    // validation
    const { editPost_schema} = joiSchemas
    const [errors, setErrors] = useState({});

    const handleChange = (e)=>{
        if(e.target.id==='image'){
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend =()=>{
                setPreviewImage(reader.result)
            }
            setFormData({   
                ...formData,
                image:e.target.files[0]
            })
        }
        else{
            setFormData({
                ...formData,
                [e.target.id]:e.target.value
            })
        }     
        const {name,value} = e.target
        let errorData = {...errors}
        let subSchema = Joi.object({[name]:editPost_schema[name]})
        const {error} = subSchema.validate({[name]:value})
        if(error) errorData[name] = error.details[0].message
        else delete errorData[name]

        setErrors(errorData)
    }

    const handleReset = ()=>{
        setFormData({
            title:thePost.title,
            tags:thePost.tags.toString(),
            contents:thePost.contents,
            image:''
        })
        setPreviewImage(thePost.image)
    }

    const handleSubmit = (e)=>{ 
            e.preventDefault()
            const editPostSchema = Joi.object(editPost_schema)
            const result = editPostSchema.validate(formData,{abortEarly:false})
            console.log('validation result: ',result);
            const {error} = result
            //if validation passed
            if(!error){
                const fd = new FormData()
                fd.append('title', formData.title)
                 fd.append('tags',formData.tags)
                 fd.append('contents',formData.contents)
                 fd.append('image',formData.image)
                 dispatch(updateMyPost(postId,fd,history))   
                 return null
            }
            // if validation failed
            else{
                const errorData = {}
                for(let i of error.details){
                    let name = i.path[0]
                    let message = i.message
                    errorData[name] = message
                }
                console.log(errorData);
                setErrors(errorData)
                return errorData
            }

    }

    const handleBackClick=()=>{
        history.goBack()
    }

    return (
            <Box sx={{position:'relative',display:'flex',flexFlow:'column nowrap', width:'100%',height:'100%'}}>
                <Helmet>
                    <title>{`Post editing: ${thePost.title}/Moments`}</title>
                    <meta name='description' content={`editing page, the post: ${thePost.title}, the author: ${thePost.author}`} />
                </Helmet>

                {/* follow & unfollow snackbar & logout*/}
                <SnackBar processing={userProcessing} status={userStatus} dispatch={dispatch} statusCleared={statusCleared} />
                {/* post SnackBar  */}
                <SnackBar processing={postProcessing} status={postStatus} dispatch={dispatch} statusCleared={postStatusCleared} />
                
                <Box sx={{p:2,display:'flex',flexFlow:'row nowrap', justifyContent:'start',boxShadow:`0 1px 3px ${grey[300]}`}}>
                    <Box sx={{width:'15%'}}>
                        <IconButton onClick={handleBackClick}>
                            <ArrowBackOutlinedIcon />
                        </IconButton>
                    </Box>
                    <Typography fontSize={'150%'} color={lightBlue[500]} width={'70%'} textAlign={'center'} alignSelf={'center'}>Edit your post</Typography>
                </Box>
                <Stack direction='column' flexGrow={1} overflow={'auto'} my={2}>
                    {!thePost
                    ?<SkeletonEditPost />
                    :<Stack direction='column' spacing={2} mx={4} sx={{'& form>*':{marginBottom:1}}}>
                        <form onSubmit={handleSubmit} style={{display:'flex', flexFlow:'column nowrap' }}>
                            <TextField error={errors['title']?true:false} helperText={errors['title']?errors['title']:null} multiline className='textfield' variant='standard' label='Title' id='title' name='title' value={formData.title} onChange={handleChange}/>
                            <TextField error={errors['tags']?true:false} helperText={errors['tags']?errors['tags']:null} multiline className='textfield' variant='standard' label='Tags seperated by ","' id='tags' name='tags'  value={formData.tags} onChange={handleChange}/>
                            <TextField error={errors['contents']?true:false} helperText={errors['contents']?errors['contents']:null} multiline className='textfield' variant='standard' label='Share your ideas & feelings' id='contents' name='contents' value={formData.contents} onChange={handleChange}/>
                            <TextField error={errors['image']?true:false} helperText={errors['image']?errors['image']:null} className='textfield' variant='standard' type='file' inputProps={{accept:"image/png, image/gif, image/jpg, image/jpeg"}}  label='Select your picture' InputLabelProps={{shrink:true}} id='image' name='image' onChange={handleChange}/>            
                            {previewImage&&(
                                <div style={{display:'flex'}}>
                                <img src={previewImage} alt="preview"  style={{height:'200px', marginLeft:'auto',marginRight:'auto'}}/>
                                </div>
                            )}    
                            <Button disabled={postProcessing?true:false} variant='contained' endIcon={<SendIcon />} sx={{mb:'1rem',mt:'1rem'}} type='submit'>Submit</Button>
                            <Button variant='contained' endIcon={<DeleteIcon/>} color='error' sx={{mb:'1rem'}} onClick={handleReset}>Reset</Button>
                        </form> 
                    </Stack>
                    }
                </Stack>
            </Box>
    )
}
