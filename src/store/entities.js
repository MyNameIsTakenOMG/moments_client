import { combineReducers} from '@reduxjs/toolkit'
import postsReducer from './posts'
import commentsReducer from './comments'
import userReducer from './user'

export default combineReducers({
    posts:postsReducer,
    comments:commentsReducer,
    user:userReducer
})