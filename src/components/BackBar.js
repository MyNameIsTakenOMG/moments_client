import React from 'react'
import {useHistory} from 'react-router-dom'

import { Box } from '@mui/material'
import { grey, lightBlue } from '@mui/material/colors'
import { IconButton ,Typography} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BackBar({title}) {

    const history = useHistory()

    const handleClick = (e)=>{
        history.goBack()
    }

    return (
        <Box sx={{display:'flex',pl:1,pb:1,pt:1,justifyContent:'start',zIndex:10,boxShadow:`0 1px 3px ${grey[400]}`}}>
            <Box sx={{width:'15%'}}>
                <IconButton id='backButton' onClick={handleClick}>
                    <ArrowBackIcon id='backIcon'/>
                </IconButton> 
            </Box>
            <Typography fontSize={'150%'} color={lightBlue[500]} width={'70%'} textAlign={'center'} alignSelf={'center'}>{title}</Typography>
        </Box>
    )
}
