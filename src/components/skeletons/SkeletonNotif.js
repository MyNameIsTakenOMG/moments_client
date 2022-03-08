import React from 'react'

import { Skeleton, Stack } from '@mui/material'

export default function SkeletonNotif() {
  return (
    <Stack direction='row' p={1} gap={1}>
        <Skeleton variant='circular' width={40} height={40} />
        <Stack flexGrow={1} direction='column' gap={1}>
            <Skeleton variant='text' width={'80%'} height={15}/>
            <Skeleton variant='text' width={'60%'} height={15} />
            <Skeleton variant='rectangular' widht={'100%'} height={80} />
        </Stack>
    </Stack>
  )
}
