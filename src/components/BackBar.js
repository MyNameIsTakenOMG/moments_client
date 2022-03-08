import React from 'react'
import {useHistory} from 'react-router-dom'

import { Box } from '@mui/material'
import { grey } from '@mui/material/colors'
import { IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BackBar() {

    const history = useHistory()

    const handleClick = (e)=>{
        history.goBack()
    }

    return (
        <Box sx={{display:'flex',pl:1,pb:1,pt:1,justifyContent:'start',zIndex:10,boxShadow:`0 1px 3px ${grey[400]}`}}>
            <IconButton id='backButton' onClick={handleClick}>
                <ArrowBackIcon id='backIcon'/>
            </IconButton> 
        </Box>
    )
}
