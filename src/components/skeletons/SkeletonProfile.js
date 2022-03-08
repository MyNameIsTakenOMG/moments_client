import React from 'react'

import { Stack, Skeleton } from '@mui/material'

export default function SkeletonProfile() {
  return (
      <>
        <Stack direction='row' justifyContent='space-between' position='relative' mt={2} mb={2} height={'36.5px'}>
            <Skeleton variant='circular' width={68} height={68} />
            <Skeleton sx={{alignSelf:'end'}} variant='rectangular' width={40} height={20} />
        </Stack>
        <Stack direction='column' spacing={1} mb={2} mt={2}>
            <Stack direction='row' spacing={1} justifyContent={'start'}>
                <Skeleton variant='text' width={'15%'} height={20}/>
                <Skeleton variant='text' width={'30%'} height={20} />
            </Stack>
            <Skeleton variant='text' width={'80%'} height={20}/>
            <Skeleton variant='text' width={'80%'} height={20}/>
            <Skeleton variant='text' width={'80%'} height={20}/>
        </Stack>
        <Stack direction='row' spacing={2} justifyContent='start'>
            <Skeleton variant='text' width={'20%'} height={20}/>
            <Skeleton variant='text' width={'20%'} height={20}/>
            <Skeleton variant='text' width={'20%'} height={20}/>
        </Stack>
    </>
  )
}
