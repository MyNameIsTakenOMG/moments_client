import React from 'react'
import {useHistory} from 'react-router-dom'
import dayjs from '../day-js/dayjs';
import { Card } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {blue} from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PageviewIcon from '@mui/icons-material/Pageview';


export default function MyCard({handleCommentClick,handleLikeClick,handleDetailClick,handleOptionClick,userInfo,subject,Contents,CommentForm,CommentsList,BackBar}) {
    
    const history = useHistory()
    const handleAvatarClick = (e,name)=>{
        history.push(`/profile/${name}`)
    }

    return (
        <Card >
            {BackBar}
            <CardHeader
                sx={{'& .MuiCardHeader-avatar':{
                    width:{xs:'40px',lg:'48px',xl:'56px'},
                    height:{xs:'40px',lg:'48px',xl:'56px'}
                    },
                    '& .MuiCardHeader-avatar .MuiAvatar-root':{
                        width:'100%',
                        height:'100%'
                    },
                    '& .MuiCardHeader-title':{
                        fontSize:{xs:'1rem',lg:'1.2rem',xl:'1.5rem'}
                    },
                    '& .MuiCardHeader-subheader':{
                        fontSize:{xs:'1rem',lg:'1.2rem',xl:'1.5rem'}
                    }}}
                avatar={
                <Avatar  onClick={(e)=>handleAvatarClick(e,subject.author)} sx={{cursor:'pointer'}}  aria-label="recipe"src={!subject.avatar?'https://res.cloudinary.com/dviagu5kq/image/upload/q_50/v1639519312/momentsApp/icon_user_default.svg':subject.avatar}>
                </Avatar>   
                }
                action={
                <IconButton id={subject._id} aria-label="option button" onClick={(e)=>handleOptionClick(e,subject)}>
                    <MoreVertIcon />
                </IconButton>
                }
                title={subject.author}
                subheader={ dayjs(subject.createdAt).format('ll LT') }
            />

            { !subject.image?'':<CardMedia
                component="img"
                height="194"
                image={subject.image}
                alt="Paella dish"
                sx={{width:'100%',height:{xs:'194px',sm:'auto'},maxHeight:{sm:'320px',xl:'480px'}}}
            />}
            
            <CardContent>
                {!subject.title?'':<Typography variant='h5' gutterBottom >
                    {subject.title}
                </Typography>}
                {!subject.tags?'':<Typography variant="body2" color={`${blue[600]}`}>
                    {subject.tags.map((tag,index)=><span key={index}>#{tag} </span>)}
                </Typography>}

                {Contents}

            </CardContent>
            <CardActions disableSpacing sx={{justifyContent:'space-between'}}>
                <IconButton aria-label="like this post" 
                sx={{color:subject.likes.findIndex(name=>name===userInfo.name)===-1?'grey':'red'}}
                 onClick={(e)=>handleLikeClick(e,subject._id)}>
                    <span>{subject.likes.length===0?null:subject.likes.length}</span><FavoriteIcon />
                </IconButton>

                {handleCommentClick
                ?<IconButton aria-label="comments" onClick={(e)=>handleCommentClick(e,subject._id)}>
                    <span>{subject.allComments===0?null:subject.allComments}</span><ChatBubbleOutlineIcon />
                </IconButton>
                :<IconButton aria-label="comments" disabled>
                    <span>{subject.allComments}</span><ChatBubbleOutlineIcon />
                </IconButton>
                }

                {handleDetailClick
                ?<IconButton aria-label="show more" onClick={(e)=>handleDetailClick(e,subject._id)}>
                    <PageviewIcon />
                </IconButton>
                :<IconButton aria-label="show more" disabled>
                    <PageviewIcon />
                </IconButton>
                }
                
            </CardActions>
            <CardContent sx={{display:'flex',flexFlow:'column nowrap'}}>
                {CommentForm}
                {CommentsList}
            </CardContent>
        </Card>
    )
}
