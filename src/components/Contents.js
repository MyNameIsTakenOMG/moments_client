import React,{useState} from 'react'
import {styled} from '@mui/material/styles'
import {blue} from '@mui/material/colors'
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';


const MyParagraph = styled((props)=>{
    const {readmore,...others} = props
    return <Typography {...others}/>
})(({theme,readmore})=>({
        height: !readmore?'1.5rem':'auto',
        overflow:'hidden',
        textOverflow:'ellipsis'
        // transition:theme.transitions.create('height',{
        //     duration:theme.transitions.duration.shortest
        // })
}))

export default function Contents({message}) {

    const [readMore,setReadMore] = useState(false)
    const handleReadMore = (e)=>{
        setReadMore(!readMore)
    }

    return (
        <>
        <MyParagraph paragraph readmore={readMore} >
            {message}
          </MyParagraph>
          <Link  sx={{color:`${blue['A700']}`,cursor:'pointer'}} underline='hover' onClick={handleReadMore}>
              {readMore?'read less...':'read more...'}
          </Link>
        </>
    )
}
