import React from 'react'

import { Stack, Skeleton, Typography } from '@mui/material'

export default function SkeletonEditPost() {
  return (
    <Stack direction={'column'} px={2}  sx={{position:'relative',top:'50%',transform:'translateY(-50%)'}}>
        <Typography variant='h5' gutterBottom><Skeleton /></Typography>
        <Typography variant='body1' gutterBottom><Skeleton /></Typography>
        <Typography variant='body1' gutterBottom><Skeleton /></Typography>
        <Typography variant='body1' gutterBottom><Skeleton /></Typography>
        <Typography variant='body1' gutterBottom><Skeleton /></Typography>
        <Skeleton variant='rectangular' width={'100%'} height={150} sx={{marginBottom:2}}/>
        <Skeleton variant='rectangular' width={'100%'} height={15} sx={{marginBottom:1}} />
        <Skeleton variant='rectangular' width={'100%'} height={15} sx={{marginBottom:1}}/>
    </Stack>
  )
}
