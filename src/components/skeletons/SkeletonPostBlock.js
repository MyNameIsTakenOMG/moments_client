import React from 'react'

import { Stack } from '@mui/material'
import Skeleton from '@mui/material/Skeleton';


export default function SkeletonPostBlock() {
  return (
    <Stack direction='row' gap={1}>
        <Skeleton variant='rectangular' width={'40%'} height={180}/>
        <Stack direction='column' width={'60%'} gap={1}>
            <Skeleton variant='text' height={15} width={'100%'}/>
            <Skeleton variant='text' height={15} width={'100%'}/>
            <Skeleton variant='text' height={15} width={'100%'}/>
            <Skeleton variant='text' height={15} width={'100%'}/>
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
            <Skeleton variant='rectangular' width={'45%'} height={20}/>
            <Skeleton variant='rectangular' width={'45%'} height={20}/>
        </Stack>
    </Stack>
  )
}
