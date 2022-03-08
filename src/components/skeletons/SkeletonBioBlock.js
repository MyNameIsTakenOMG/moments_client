import React from 'react'

import { Stack } from '@mui/material'
import Skeleton from '@mui/material/Skeleton';


export default function SkeletonBioBlock() {
  return (
    <Stack p={1} direction={'row'} gap={2}>
        <Skeleton variant='circular' width={56} height={56} />
        <Stack flexGrow={1} direction={'column'}>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Stack direction={'column'} gap={1}> 
                    <Skeleton variant='text' width={'40%'} height={10} />
                    <Skeleton variant='text' width={'40%'} height={10}/>
                </Stack>
                <Skeleton variant='rectangular' width={'20%'} height={25}/>
            </Stack>
            <Skeleton variant='text' width={'80%'} height={15} />
            <Skeleton variant='text' width={'80%'} height={15} />
            <Skeleton variant='text' width={'80%'} height={15} />
        </Stack>
    </Stack>
  )
}
