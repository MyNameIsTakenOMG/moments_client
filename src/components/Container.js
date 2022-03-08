import React from 'react'
import {styled} from '@mui/system'
import {grey} from '@mui/material/colors'
import {Switch,Route,useHistory, useLocation} from 'react-router-dom'
import Posts from './Posts'
import MyPosts from './MyPosts'
import FollowingPosts from './FollowingPosts'
import NewPost from './NewPost'
import Post from './Post'
import EditPost from './EditPost'
import Comment from './Comment'
import Profile from './Profile'
import Search from './Search'
import Notifications from './Notifications'
import NotFound from './NotFound'

const MyContainer = styled('div')(({theme})=>({
    flexGrow:1,
    // height:'calc(100% - 150px)',
    // overflow:'auto',
    overflow:'hidden',
    position:'relative',
    boxShadow:`1px 0 3px ${grey[400]}`,
    [theme.breakpoints.up('sm')]:{
        width:'50%',
    },
    [theme.breakpoints.up('md')]:{
        width:'45%',
        // maxWidth:'648px'
    }
}))

export default function Container() {

    const history = useHistory()
    const location = useLocation()
    // const {path} = useRouteMatch() //path====> '/'

    return (
        <MyContainer>
            {/* <Redirect from={`${path}`} to={`${path}home`}/> // redirect not working here....  */}
            {/* <Route exact path={`${path}`} render={()=>history.push(`${path}home`)} /> */}
            <Switch>
                <Route exact path={'/'} render={()=>history.replace('/home')} />
                <Route exact path={'/home'}> 
                    <Posts key={location.key}/>
                </Route>
                <Route exact path={'/myPosts'}>
                    <MyPosts key={location.key}/>
                </Route>
                <Route exact path={'/followingPosts'}>
                    <FollowingPosts key={location.key}/>
                </Route>
                <Route exact path={'/newPost'}>
                    <NewPost key={location.key}/>
                </Route>
                <Route exact path={'/notifications'}>
                    <Notifications key={location.key}/>
                </Route>
                <Route exact path={'/search'}>
                    <Search key={location.key}/>
                </Route>
                <Route exact path={'/post/:postId'}>
                    <Post />
                </Route>
                <Route exact path={'/post/:postId/edit'}>
                    <EditPost />
                </Route>
                <Route exact path={'/comment/:commentId'}>
                    <Comment />
                </Route>
                <Route exact path={'/profile/:username'}>
                    <Profile />
                </Route>
                <Route exact path={'/not_found'}>
                    <NotFound />
                </Route>
            </Switch>
        </MyContainer>
    )
}
