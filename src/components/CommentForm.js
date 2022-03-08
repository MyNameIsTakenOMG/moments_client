import React,{useState} from 'react'
import { Typography } from '@mui/material'
import { Box } from '@mui/material'     
import { blue } from '@mui/material/colors'  
import { Avatar } from '@mui/material'  
import { TextField } from '@mui/material'  
import { Button } from '@mui/material'

import joiSchemas from '../validations/joiSchemas'

export default function CommentForm({history,userInfo,subject,dispatch,addNewComment,processing}) {

      // comment form 
      const [contents,setContents] = useState('')

      //validation
    const { comment_schema} = joiSchemas
    const [errors, setErrors] = useState('');

      const handleChange = (e)=>{
        setContents(e.target.value)
        
        let {name,value} = e.target
        let {error} = comment_schema.validate({[name]:value})
        let errorData 
        if(error) errorData = error.details[0].message
        else errorData =''
        setErrors(errorData)
      }

      const handleSubmit = (e)=>{
        e.preventDefault();
        let errorData 
        let {error} = comment_schema.validate({'contents':contents})
        if(error) {
          errorData = error.details[0].message
          setErrors(errorData)
        }
        else{
          const fd = new FormData()
          fd.append('contents',contents)
          // decide if the subject is a post or a comment
          if(subject.path) {
            fd.append('commentId',subject._id)
            dispatch(addNewComment('commentPage',subject._id,fd,'direct',history))
          }
          else {
            fd.append('postId',subject._id)
            dispatch(addNewComment('postPage',subject._id,fd,'direct',history))
          }
          setContents('')
        }
      }

    return (<>
            <Typography variant='body2' sx={{borderTop:'rgba(0,0,0,0.1)'}}>
              reply to <span style={{color:`${blue['A700']}`}}>@{subject.author}</span>
            </Typography>
            <Box sx={{display:'flex',pt:2,pb:2,borderBottom:'1px solid rgba(0,0,0,0.1)'}}>
              <Avatar sx={{marginRight:'0.5rem'}} src={!userInfo.avatar?'https://res.cloudinary.com/dviagu5kq/image/upload/q_50/v1639519312/momentsApp/icon_user_default.svg':userInfo.avatar}>
                H</Avatar>
              <form style={{flexGrow:1,display:'flex',flexFlow:'column nowrap'}} onSubmit={handleSubmit}>
                <TextField required aria-required error={errors!==''?true:false} helperText={errors!==''?errors:null} multiline maxRows={10} variant='standard' id='contents' name='contents' value={contents} label='Leave your comment' onChange={handleChange}/>
                <Button disabled={processing?true:false} type='submit' variant='contained' size='small' sx={{borderRadius:'30px',marginTop:'0.5rem',marginBottom:'0.5rem',alignSelf:'end'}}>Reply</Button>
              </form>
            </Box>
            </>
    )
}
