import React from 'react'

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import { Stack } from '@mui/material';

export default function SkeletonCard({path}) {
  return (
    <Card sx={{mx:2,mb:2}}>
        <CardHeader 
            avatar={<Skeleton variant='circular' width={40} height={40} /> }
            title={<Skeleton variant='text' height={10} width={'80%'} style={{marginBottom:6}} />}
            subheader={<Skeleton variant='text' height={10} width={'60%'} />}
        />
        {path.match(/home|myPosts|followingPosts|post/)
        ?<Skeleton variant='rectangular' sx={{width:'100%',height:{xs:'194px',sm:'320px',lg:'480px'}}}/>
        :null}
        
        <CardContent>
            <Skeleton  height={10} style={{ marginBottom: 6 }} />
            <Skeleton  height={10} width="80%" />
        </CardContent>
        <CardContent>
            {path.match(/post|comment/)
            ?<Stack direction='row' gap={1}>
                <Skeleton variant='circular' width={25} height={25}  />
                <Skeleton variant='rectangular' height={25} sx={{flexGrow:1}} />
            </Stack>
            :null}
        </CardContent>
    </Card>
  )
}
