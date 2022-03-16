import React, { useEffect, useState } from 'react'
import {useHistory,useLocation} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import {getUserInfo,getUserProcessing,getUserStatus,loadUserInfo,statusCleared} from '../store/user'
import {createPost,updatedPath,postStatusCleared, getIsProcessing, getPostStatus} from '../store/posts'
import joiSchemas from '../validations/joiSchemas'
import Joi from 'joi'

import {lightBlue,grey} from '@mui/material/colors'
import Typography from '@mui/material/Typography'; 
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Stack, Box } from '@mui/material'
import SnackBar from './SnackBar/SnackBar' 
import { Helmet } from 'react-helmet-async'

export default function NewPost() {
    const history = useHistory()
    const dispatch = useDispatch()
    const location = useLocation()
    const userInfo = useSelector(getUserInfo)
    const userProcessing = useSelector(getUserProcessing)
    const userStatus = useSelector(getUserStatus)
    const postStatus = useSelector(getPostStatus)
    const postProcessing = useSelector(getIsProcessing)

    const [formData, setFormData] = useState({
        title:'',
        tags:'',
        contents:'',
        image:''
    })

    const [previewImage, setPreviewImage]= useState()
    
    useEffect(()=>{
        dispatch(updatedPath({path:location.pathname}))
        if(userInfo.name==='')
        dispatch(loadUserInfo(history))

        return ()=>{
            dispatch(postStatusCleared())
        }
    },[location.key])

    // validation
    const { post_schema} = joiSchemas
    const [errors, setErrors] = useState({});
    
    const handleChange = (e)=>{
        if(e.target.id==='image'){
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend =()=>{
                setPreviewImage(reader.result)
            }
            setFormData(pre=>{
                return {
                    ...pre,
                    image:e.target.files[0]
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
        const subSchema =Joi.object({[name]: post_schema[name]})
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

    const handleDiscard = ()=>{
        setFormData({
            title:'',
            tags:'',
            contents:'',
            image:''
        })
        setPreviewImage(null)
        setErrors({})
    }

    const handleSubmit = (e)=>{ 
            e.preventDefault()
            const postSchema = Joi.object(post_schema)
            const result = postSchema.validate(formData,{abortEarly:false})
            console.log('validation result: ',result);
            const {error} = result
            // validation passed
            if(!error){
                const fd = new FormData()
                fd.append('title',formData.title)
                fd.append('tags',formData.tags)
                fd.append('contents',formData.contents)
                fd.append('image',formData.image)
                dispatch(createPost(fd,history))
                return null
            }
            // error occured
            else{
                const errorData = {}
                for(let i of error.details){
                    let name = i.path[0]
                    let message = i.message
                    errorData[name] = message 
                }
                setErrors(errorData)
                console.log(errorData);
                return errorData
            }
    }

    return (
         <Box sx={{position:'relative',display:'flex',flexFlow:'column nowrap', width:'100%',height:'100%'}}>
            <Helmet>
                <title>Create a new post/Moments</title>
                <meta name='description' content='create a new post' />
            </Helmet>
            
            {/* follow & unfollow snackbar & logout*/}
            <SnackBar processing={userProcessing} status={userStatus} dispatch={dispatch} statusCleared={statusCleared} />

            {/* post snackbar  */}
            <SnackBar processing={postProcessing} status={postStatus} dispatch={dispatch} statusCleared={postStatusCleared} />
            
            <Box sx={{p:2,mb:2,display:'flex',flexFlow:'row nowrap', justifyContent:'center',boxShadow:`0 1px 3px ${grey[400]}`}}>
                <Typography fontSize={'150%'} color={lightBlue[500]} width={'70%'} textAlign={'center'} alignSelf={'center'}>Create your post</Typography>
            </Box>
            <Stack direction='column' flexGrow={1} overflow={'auto'}spacing={2} mx={4} sx={{'& form>*':{marginBottom:2}}}>
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
                    <Button disabled={postProcessing?true:false}  variant='contained' endIcon={<SendIcon />} sx={{mb:'1rem',mt:'1rem'}} type='submit'>Submit</Button>
                    <Button variant='contained' endIcon={<DeleteIcon/>} color='error' sx={{mb:'1rem'}} onClick={handleDiscard}>Discard</Button>
                </form> 
            </Stack>
        </Box>
    )
}
