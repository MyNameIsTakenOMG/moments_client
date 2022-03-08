import React from 'react'

import {CardContent, Stack, Skeleton } from '@mui/material'

export default function SkeletonCommentBlock() {
  return (
    <CardContent>
      <Stack direction='row' spacing={2}>
          <Skeleton variant='circular' width={40} height={40} />
          <Stack flexGrow={1} direction='column' spacing={2}>
              <Skeleton variant='text' height={15} width={'100%'} />
              <Skeleton variant='text' height={15} width={'100%'} />
              <Skeleton variant='text' height={15} width={'100%'} />
              <Skeleton variant='rectangular' height={40} width={'100%'} />
              <Skeleton variant='rectangular' height={20} width={'100%'} />
          </Stack>
      </Stack>
    </CardContent>
  )
}
