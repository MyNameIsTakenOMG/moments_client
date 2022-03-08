import {useRef,useCallback} from 'react'

export default function useLastItem(theRoot,loading,cursor,dispatch,action){
    const observer = useRef()

    const lastItemRef = useCallback((node)=>{
        if(loading) return
        else{
            if(observer.current){
                observer.current.disconnect()
            }
            observer.current = new IntersectionObserver((entries,observer)=>{
                if(entries[0].isIntersecting){
                    if(cursor!==null){
                        dispatch(action)
                    }
                    else observer.disconnect()
                }
            },{threshold:0.7,rootMargin:'20px',root:theRoot.current})
            if(node) observer.current.observe(node)
        }
    },[loading,cursor,dispatch,action,theRoot])
    
    return {lastItemRef}
}