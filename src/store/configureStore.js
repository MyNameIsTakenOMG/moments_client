import {configureStore} from '@reduxjs/toolkit'
import reducer from './reducer'
import postApi from './middleware/postApi'
import commentApi from './middleware/commentApi'
import userApi from './middleware/userApi'

export default function(){
    return configureStore({
        reducer: reducer,
        middleware: (getDefaultMiddleware)=>getDefaultMiddleware({
            serializableCheck:{
                ignoredActions:['postApiCall','commentApiCall','userApiCall']
            }
        }).concat(userApi,postApi,commentApi)
    })
}