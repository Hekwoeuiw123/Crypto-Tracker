import React, { useEffect, useState } from 'react'

const useDebounceValue = (value, delay) => {

    const [debounceVal, setDebounceVal] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceVal(value);
        }, delay);

        return ()=> clearTimeout(timer)
    }, [value, delay])
    return debounceVal
}

export default useDebounceValue