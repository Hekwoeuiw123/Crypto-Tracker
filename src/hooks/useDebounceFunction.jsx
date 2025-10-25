import React, { useEffect, useRef } from 'react'

function useDebounceFunction(fn, delay) {

    let timer = useRef(null)
    let lastCall = useRef(0)

    const throttleFunction = (...args) => {
        let now = Date.now()
        if (now - lastCall.current <= delay) return
        lastCall.current = now
        fn(...args)
    }

    const debounceFunction = (...args) => {
      
            clearTimeout(timer.current)
       
        timer.current = setTimeout(() => {
            fn(...args)
        }, delay)
    }


    useEffect(() => {
        return () => {
            clearTimeout(timer.current)
            lastCall.current = 0
        }
    }, [])
    return debounceFunction 
}

export default useDebounceFunction
