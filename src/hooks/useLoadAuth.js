import { useEffect, useState } from "react"
import { getAuthStatus, loadUserInfo } from "../store/user"
import { useDispatch, useSelector} from "react-redux"
import { useHistory } from "react-router-dom"

const useLoadAuth = ()=>{
    const history = useHistory
    const dispatch = useDispatch()
    const authStatus = useSelector(getAuthStatus)
    const [isAuthLoaded, setIsAuthLoaded] = useState(false)

    useEffect(()=>{
        dispatch(loadUserInfo(history))
    },[])

    useEffect(()=>{
        if(authStatus.code!==null && isAuthLoaded===false){
            setIsAuthLoaded(true)
        }
        return ()=>{
            setIsAuthLoaded(false)
        }
    },[authStatus.code])


    return {isAuthLoaded}
}

export default useLoadAuth