import React from 'react'
import { Snackbar, Alert } from '@mui/material'

export default function SnackBar({processing,status,dispatch,statusCleared}) {

  // when close, clear the status
  const handleClose = (e,reason)=>{
    if(reason==='clickaway') return
    dispatch(statusCleared())
  }
  
  return (
    <Snackbar key={status.key} autoHideDuration={4000} open={!processing&&status.key?true:false} onClose={handleClose}>
      <Alert sx={{width:'100%'}} elevation={10} variant='filled' severity={status.code===200?'success':'error'} onClose={handleClose}>
        {status.message}
      </Alert>
    </Snackbar>
  )
}
