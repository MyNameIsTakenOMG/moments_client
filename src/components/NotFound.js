import React from 'react';
import { useHistory } from 'react-router-dom';

import { Link, Typography, Box, Stack } from '@mui/material';
import { blue, lightBlue } from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProcessing, getUserStatus,statusCleared } from '../store/user';
import SnackBar from './SnackBar/SnackBar';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {

    const history = useHistory()
    const dispatch = useDispatch()
    const userProcessing = useSelector(getUserProcessing)
    const userStatus = useSelector(getUserStatus)
    const handleClick = ()=>{
        history.push('/home')
    }

  return <Box sx={{width:'100%',height:'100%',position:'relative',display:'flex', justifyContent:'center',alignItems:'center'}}>
            <Helmet>
              <title>Data not found / Moments</title>
              <meta name='description' content='404, data not found' />
            </Helmet>

            {/* follow & unfollow snackbar & logout*/}
            <SnackBar processing={userProcessing} status={userStatus} dispatch={dispatch} statusCleared={statusCleared} />

            <Stack direction={'column'} spacing={2}>
              <Typography variant='h5' fontSize={'150%'} color={lightBlue[600]} >Oops, data not found...</Typography>
              <Link  sx={{color:`${blue['A700']}`,cursor:'pointer', alignSelf:'end'}} underline='hover' onClick={handleClick}>
                wanna go back?
              </Link>
            </Stack>
        </Box>;
}
