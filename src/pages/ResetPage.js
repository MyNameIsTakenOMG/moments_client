import React, { useState, useEffect,useRef } from 'react'
import {useParams,useHistory} from 'react-router-dom'
import jsonwebtoken from 'jsonwebtoken'
import {statusCleared,resetPassword, getUserProcessing, getUserStatus} from '../store/user'
import {useDispatch, useSelector} from 'react-redux'
import joiSchemas from '../validations/joiSchemas'

import {createTheme,ThemeProvider} from '@mui/material/styles'
import Box from '@mui/material/Box'
import Avatar  from '@mui/material/Avatar';
import {lightBlue} from '@mui/material/colors'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SnackBar from '../components/SnackBar/SnackBar'
import {Helmet} from 'react-helmet-async'

const logoFont = createTheme({
    typography:{
        fontFamily:[
            'dancing script','cursive'
        ].join(',')
    }
})

export default function ResetPage() {
    const history = useHistory()
    const dispatch = useDispatch()
    const processing = useSelector(getUserProcessing)
    const status = useSelector(getUserStatus)

    const {token} = useParams() 
    const err = useRef()

    const handleSignInClick = ()=>{
        history.push('/login')
    }

    // validation & schema
    const [newPwd,setNewPwd] =useState({
        rs_newPwd:''
    })
    const [newPwdError, setNewPwdError] = useState({})
    const {resetPwd_schema} = joiSchemas
    const handleChange = (e)=>{
        setNewPwd({rs_newPwd:e.target.value})
    }
    
    const handleSubmit = ()=>{
        const {error} = resetPwd_schema.validate(newPwd,{abortEarly:false})
        if(error){
            let errorData ={}
            for(let i of error.details){
                let name = i.path[0]
                let message = i.message
                errorData[name] = message
            }
            console.log(errorData);
            setNewPwdError(errorData)
            return errorData
        }
        else{
            const fd = new FormData()
            fd.append('token',token)
            fd.append('rs_newPwd',newPwd.rs_newPwd)
            dispatch(resetPassword(fd,history))
            setNewPwd({rs_newPwd:''})
            return null
        }
    }

    useEffect(() => { 
        try {
            const decoded =  jsonwebtoken.verify(token,process.env.REACT_APP_RESETTING_SECRET,{algorithms:['HS256'],})
              console.log('decoded: ',decoded);
          } catch (error) {
              err.current = error.message
              console.log(error);
          }
    }, [])

    return (
        <Box sx={{p:3,position:'relative',width:'100vw',height:'100vh',display:'flex',flexFlow:'column nowrap'}}> 
            
            <Helmet>
                <title>Reset your passord / Moments</title>
                <meta name='description' content='password reset' />
            </Helmet>

            <SnackBar processing={processing} status={status} dispatch={dispatch} statusCleared={statusCleared} />

            {err.current===undefined
            ?<Stack direction='column' spacing={3} p={2}>
                <ThemeProvider theme={logoFont}>
                    <Avatar sx={{alignSelf:'center',bgcolor:lightBlue[600] ,width:56,height:56,fontSize:32,mb:4}} >M</Avatar>
                </ThemeProvider> 
                <Typography sx={{alignSelf:'center'}} variant='h6'>Reset your password</Typography>
                <TextField error={newPwdError['rs_newPwd']?true:false} helperText={newPwdError['rs_newPwd']?newPwdError['rs_newPwd']:null} id='rs_newPwd' name='rs_newPwd' label='Your new password' required aria-required value={newPwd.rs_newPwd} onChange={handleChange} />
                <Button disabled={processing?true:false} onClick={handleSubmit} variant='contained'>Submit</Button>
                <Stack direction='row' justifyContent={'flex-end'}>
                    <Typography vairant='body1'>Go to</Typography>
                    <Typography variant='body1' color={lightBlue[600]} sx={{cursor:'pointer'}} onClick={handleSignInClick}>sign in?</Typography>
                </Stack>
            </Stack>
            :<Typography variant='h5' component='div' gutterBottom>Sorry, the link is invalid</Typography>
            }  
        </Box>
    )
}
