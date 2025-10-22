import { storage } from '@/src/app/shared/utils/storage/Storage'
import { useCallback, useEffect, useState } from 'react'

export function useStorage(key, initialValue = null)  {
    const [storedValue, setStoredValue] = useState(() => {
        return storage.get(key) ?? initialValue
    })

    const setValue = useCallback((value) => {
        storage.set(key, value)
    }, [key])

    const clearValue = useCallback(() => {
        storage.remove(key)
    }, [key])

    useEffect(() => {
        const unsubscribe = storage.subscribe(key, setStoredValue)
        return () => unsubscribe()
    }, [key])

    return [storedValue, setValue, clearValue]
}