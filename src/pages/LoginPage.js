import React, { useState } from 'react'
import {useHistory} from 'react-router-dom'
import {userProcessFailed,statusCleared,getUserStatus,getUserProcessing,signUpUser,signInUser, sendResettingRequest} from '../store/user'
import {useDispatch, useSelector} from 'react-redux'
import joiSchemas from '../validations/joiSchemas'
import {useGoogleLogin} from '@react-oauth/google'
import { createTheme,ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar  from '@mui/material/Avatar';
import {grey, lightBlue} from '@mui/material/colors'
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GoogleIcon from '@mui/icons-material/Google';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import SnackBar from '../components/SnackBar/SnackBar'
import {Helmet} from 'react-helmet-async'

const logoFont = createTheme({
    typography:{
        fontFamily:[
            'dancing script','cursive'
        ].join(',')
    }
})

export default function LoginPage() {
    const history = useHistory()
    const dispatch = useDispatch()
    const processing = useSelector(getUserProcessing)
    const status = useSelector(getUserStatus)

    const [isSignup,setIsSignup] = useState(false)
    const [isResetting,setIsResetting] = useState(false)
    const [isSignin,setIsSignin] = useState(false)

    // sign up  & validation
    const [signupForm,setSignupForm] = useState({
        su_username:'',
        su_password:'',
        su_email:'',
        su_confirmPassword:''
    })

    const [signupError, setSignupError] = useState({})
    const {signUp_schema} = joiSchemas
    const handleSignupFormChange = (e)=>{
        setSignupForm(pre=>({
            ...pre,
            [e.target.id]:e.target.value
        }))
    }

    // sign in & validation
    const [signinForm,setSigninForm] = useState({
        si_user:'',
        si_password:''
    })
    const [signinError, setSigninError] = useState({})
    const {signIn_schema} = joiSchemas
    const handleSigninFormChange = (e)=>{
        setSigninForm(pre=>({
            ...pre,
            [e.target.id]:e.target.value
        }))
    }

    // reset  & validation
    const [resetForm,setResetForm] = useState({
        rs_email:''
    })
    const [resetError, setResetError] = useState({})
    const {resetRequest_schema} = joiSchemas
    const handleResetFormChange = (e)=>{
        setResetForm(pre=>({
            ...pre,
            [e.target.id]:e.target.value
        }))
    }

    const populateError = (errors)=>{
        let errorData ={}
        for(let i of errors){
            let name = i.path[0]
            let message = i.message
            errorData[name] = message
        }
        if(isSignup) setSignupError(errorData)
        else if(isSignin) setSigninError(errorData)
        else if(isResetting)setResetError(errorData)
    } 

    const handleSubmit =(e)=>{
            e.preventDefault()
            if(isSignup){
                // validate data
                const {error} = signUp_schema.validate(signupForm,{abortEarly:false})
                if(error){
                    console.log('error: ',error.details);
                    populateError(error.details)
                }
                else{
                    // dispatch action to sign up
                    const fd = new FormData()
                    for(let userInfo in signupForm){
                        fd.append(userInfo, signupForm[userInfo])
                    }
                    dispatch(signUpUser(fd,history))
                    setSignupForm({
                        su_username:'',
                        su_password:'',
                        su_email:'',
                        su_confirmPassword:''
                    })
                }

            }else if(isSignin){
                // validate data
                const {error} = signIn_schema.validate(signinForm,{abortEarly:false})
                if(error){
                    console.log('error: ',error.details);
                    populateError(error.details)
                }
                else{
                    // dispatch action to sign in
                    const fd = new FormData()
                    for(let userInfo in signinForm){
                        fd.append(userInfo, signinForm[userInfo])
                    }
                    dispatch(signInUser(fd,history))
                    setSigninForm({
                        si_user:'',
                        si_password:''
                    })
                }
            }else if(isResetting){
                //validate data
                const {error} = resetRequest_schema.validate(resetForm,{abortEarly:false})
                if(error){
                    console.log('error: ',error.details);
                    populateError(error.details)
                }
                else{
                    //dispatch action to reset 
                    const fd = new FormData()
                    fd.append('rs_email',resetForm.rs_email)
                    dispatch(sendResettingRequest(fd,history))
                    setResetForm({
                        rs_email:''
                    })
                }
            }
    }

    // sign in with google
    const googleLogin = useGoogleLogin({
        onSuccess: response=>{
            const accessToken = response.access_token
            console.log('accessToken: ',accessToken);
            dispatch(signInUser({token:accessToken},history))
        },
        onError: error=>{
            console.log('error: ',error);
            dispatch(userProcessFailed({code:error.status,message:error.statusText}))
        }
    })
    const CustomGoogleLogin = ({children,login})=>{
        return(
            <Button variant='outlined' onClick={login} startIcon={<GoogleIcon />}>{children}</Button>
        )
    }
    
    const handleSignupOpenClick = (e)=>{
        setIsSignup(true)
    }

    const handleSignupCloseClick = (e)=>{
        setIsSignup(false)
        setSignupForm({
            su_username:'',
            su_password:'',
            su_email:'',
            su_confirmPassword:''
        })
        setSignupError({})
    }

    const handleSigninOpenClick = (e)=>{
        setIsSignin(true)
    }

    const handleSigninCloseClick = (e)=>{
        setIsSignin(false)
        setSigninForm({
            si_user:'',
            si_password:''
        })
        setSigninError({})
    }

    const handleResetOpenClick = (e)=>{
        setIsSignin(false)
        setIsResetting(true)
    }

    const handleResetCloseClick = (e)=>{
        setIsSignin(true)
        setIsResetting(false)
        setResetForm({
            rs_email:''
        })
        setResetError({})
    }
    
    return (
        // <Box sx={{position:'relative',width:'100%',height:'100%',display:'flex',flexFlow:{xs:'column nowrap',md:'row nowrap'},overflow:'auto'}}> 
        <Box sx={{position:'relative',width:'100%',height:'100%',overflowY:{xs:'auto',md:'hidden'}}}> 
            
            <Helmet>
                <title>{!isSignup&&!isSignin&&!isResetting?'Welcome to Moments':isSignup?'Sign up for Moments':isSignin?'Sign in for Moments':'Password resetting/Moments'}</title>
                <meta name='description' content='Moments cover page, sign up, sign in, password resetting' />
            </Helmet>

            <SnackBar processing={processing} status={status} dispatch={dispatch} statusCleared={statusCleared}/>
            
            <Stack sx={{flexFlow:{xs:'column nowrap',md:'row nowrap'}}}>
                {!isSignup&&!isSignin&&!isResetting
                ?
                // cover page
                <Box sx={{alignSelf:'center',p:5,display:'flex',flexFlow:'column nowrap',width:{xs:'100%',md:'40%'},maxWidth:'600px'}}>
                    <ThemeProvider theme={logoFont}>
                    <Box sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <Avatar sx={{bgcolor:lightBlue[600] ,width:56,height:56,fontSize:32,mr:1}} >M</Avatar>
                        <Typography color={lightBlue[600]} fontSize={32}>Moments</Typography>
                    </Box> 
                    </ThemeProvider> 
                    <Stack direction='column' mt={3} mb={3} alignItems='center'>
                        <Typography variant='h4' fontWeight={800} letterSpacing={1}>Let's start it</Typography>
                        <Typography variant='h4' fontWeight={800} letterSpacing={1}>now!</Typography>
                    </Stack>
                    <Typography variant='h6' sx={{mb:2}}>Join Moments Today.</Typography>
                    <Stack direction='column' spacing={2} mb={3}>
                        <Button variant='outlined' sx={{ borderRadius:'50px'}} onClick={handleSignupOpenClick}>Sign up with your email</Button>
                        <Divider>or</Divider>
                        <Typography >Already have an account?</Typography>
                        <Button variant='contained' sx={{ borderRadius:'50px'}} onClick={handleSigninOpenClick}>Sign in</Button>
                    </Stack>
                </Box>
                :isSignup
                ?
                // Sign-up form
                <Box sx={{alignSelf:'center',p:2,height:'100vh',overflowY:{xs:'auto'},backgroundColor:'white',position:{xs:'fixed',md:'static'},maxWidth:{md:'600px'},width:{xs:'100%',md:'40%'}}}>
                        <Stack direction='row' justifyContent={'start'}>
                            <Box sx={{width:'15%',display:'flex',alignItems:'center'}}>
                                <IconButton onClick={handleSignupCloseClick}>
                                    <ArrowBackIcon/>
                                </IconButton>
                            </Box>
                            <ThemeProvider theme={logoFont}>
                                <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',width:'70%'}}>
                                    <Avatar sx={{bgcolor:lightBlue[600] ,width:56,height:56,fontSize:32,mr:1}} >M</Avatar>
                                    <Typography color={lightBlue[600]} fontSize={32}>Moments</Typography>
                                </Box>
                            </ThemeProvider> 
                            <Box sx={{flexGrow:1}}>    
                            </Box>
                        </Stack>
                        <Stack direction='column' ml={3} mr={3} mt={3} spacing={4} sx={{'& form>*':{mb:3}}}>
                            <Typography variant='h4' fontWeight={700}>
                                Create your account
                            </Typography>
                            <form onSubmit={handleSubmit} style={{display:'flex',flexFlow:'column nowrap',marginBottom:'2rem'}}>
                            <TextField error={signupError['su_username']?true:false} helperText={signupError['su_username']?signupError['su_username']:null} id='su_username' name='su_username' value={signupForm.su_username}  label='User Name' variant='outlined' required aria-required onChange={handleSignupFormChange}/>
                            <TextField error={signupError['su_email']?true:false} helperText={signupError['su_email']?signupError['su_email']:null} id='su_email' name='su_email' value={signupForm.su_email} label='email' required aria-required variant='outlined' type='email' onChange={handleSignupFormChange}/>
                            <TextField error={signupError['su_password']?true:false} helperText={signupError['su_password']?signupError['su_password']:null} id='su_password' name='su_password' value={signupForm.su_password} label='password' required aria-required type='password' onChange={handleSignupFormChange}/>
                            <TextField error={signupError['su_confirmPassword']?true:false} helperText={signupError['su_confirmPassword']?signupError['su_confirmPassword']:null} id='su_confirmPassword' name='su_confirmPassword' value={signupForm.su_confirmPassword} label='confirm password' required aria-required type='password' onChange={handleSignupFormChange}/>
                            
                            <Button disabled={processing?true:false} type='submit' variant='contained' sx={{borderRadius:'50px',}}>Sign up</Button>
                            </form>
                        </Stack>
                    </Box>
                :isSignin
                ?
                // Sign-in form 
                <Box sx={{alignSelf:'center',p:2,height:'100vh',overflowY:{xs:'auto'},backgroundColor:'white',position:{xs:'fixed',md:'static'},maxWidth:{md:'600px'},width:{xs:'100%',md:'40%'}}}>
                    <Stack direction='row' justifyContent={'start'}>
                        <Box sx={{width:'15%',display:'flex',alignItems:'center'}}>
                            <IconButton onClick={handleSigninCloseClick}>
                                <ArrowBackIcon/>
                            </IconButton>
                        </Box>
                        <ThemeProvider theme={logoFont}>
                            <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',width:'70%'}}>
                                <Avatar sx={{bgcolor:lightBlue[600] ,width:56,height:56,fontSize:32,mr:1}} >M</Avatar>
                                <Typography color={lightBlue[600]} fontSize={32}>Moments</Typography>
                            </Box>
                        </ThemeProvider> 
                        <Box sx={{flexGrow:1}}>    
                        </Box>
                    </Stack>
                    <Stack direction='column' ml={3} mr={3} mt={3} spacing={4} sx={{'& form>*':{mb:3},'& .googleBtn>*':{marginLeft:'8px !important',borderRadius:'50px !important'},'& .googleBtn':{borderRadius:'50px !important',border:'1px solid rgba(110, 104, 107, 0.4) !important',boxShadow:'none !important'}}}>
                        <Typography variant='h4' fontWeight={700}>
                            Sign into Moments
                        </Typography>

                        <CustomGoogleLogin login={googleLogin} >Sign in with Google</CustomGoogleLogin>

                        <Divider>or</Divider>
                        <form onSubmit={handleSubmit} style={{display:'flex',flexFlow:'column nowrap',marginBottom:'2rem'}}>
                            <TextField error={signinError['si_user']?true:false} helperText={signinError['si_user']?signinError['si_user']:null} id='si_user' name='si_user' value={signinForm.si_user} label='username or email address'  required aria-required onChange={handleSigninFormChange} />
                            <TextField error={signinError['si_password']?true:false} helperText={signinError['si_password']?signinError['si_password']:null} id='si_password' name='si_password' value={signinForm.si_password} label='password' type='password'  required aria-required onChange={handleSigninFormChange}/>
                            
                            <Button disabled={processing?true:false} variant='contained' sx={{borderRadius:'50px'}} type='submit'>Sign in</Button>
                            <Button variant='outlined' sx={{borderRadius:'50px'}} onClick={handleResetOpenClick}>Forget password?</Button>
                        </form>
                    </Stack>
                </Box>
                :
                // Resetting form 
                <Box sx={{alignSelf:'center',p:2,height:'100vh',overflowY:{xs:'auto'},backgroundColor:'white',position:{xs:'fixed',md:'static'},maxWidth:{md:'600px'},width:{xs:'100%',md:'40%'}}}>
                    <Stack direction='row' justifyContent={'start'}>
                        <Box sx={{width:'15%',display:'flex',alignItems:'center'}}>
                            <IconButton onClick={handleResetCloseClick}>
                                <ArrowBackIcon/>
                            </IconButton>
                        </Box>
                        <ThemeProvider theme={logoFont}>
                            <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',width:'70%'}}>
                                <Avatar sx={{bgcolor:lightBlue[600] ,width:56,height:56,fontSize:32,mr:1}} >M</Avatar>
                                <Typography color={lightBlue[600]} fontSize={32}>Moments</Typography>
                            </Box>
                        </ThemeProvider> 
                        <Box sx={{flexGrow:1}}>    
                        </Box>
                    </Stack>
                    <Stack direction='column' spacing={6} mt={8} ml={3} mr={3} sx={{'& form>*':{mb:6}}}>
                        <Typography variant='h5' fontWeight={600} alignSelf='center'>Reset your password</Typography>
                        <form onSubmit={handleSubmit} style={{display:'flex',flexFlow:'column nowrap',marginBottom:'2rem'}}>
                            <TextField error={resetError['rs_email']?true:false} helperText={resetError['rs_email']?resetError['rs_email']:null}  id='rs_email' name='rs_email' value={resetForm.rs_email} onChange={handleResetFormChange} type='email' required aria-required  label='please enter email address' />
                            <Button disabled={processing?true:false} type='submit' variant='contained' sx={{borderRadius:'50px'}}>Confirm and send email</Button>
                        </form>
                    </Stack>
                </Box>
                }
                {/* cover image */}
                <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',flexGrow:1,height:{xs:'100vh',md:'100vh'},
                        backgroundImage:'url(https://res.cloudinary.com/dviagu5kq/image/upload/v1645898310/momentsApp/yay1zpselpf07exzmdoq.jpg)',
                        backgroundSize:'cover',
                        backgroundPosition:'center center',
                        backgroundRepeat:'no-repeat'}}>
                    <ThemeProvider theme={logoFont}>
                        <Typography textAlign={'center'} sx={{py:1,px:2,backgroundColor:'rgba(187, 175, 181, 0.55)',fontSize:{xs:'200%',sm:'200%',md:'160%',lg:'180%',xl:'200%'}}} color={grey[200]} fontWeight={600} fontSize={36}>SHARE YOUR MOMENTS WITH THE WORLD</Typography>
                    </ThemeProvider>
                </Box>
            </Stack>
        </Box>
    )
}
