import { useCallback, useState } from 'react'

export function useFakeApi(resource) {
    const BASE_URL = import.meta.env.VITE_FAKE_API_BASE_URL
    const [data, setData] = useState(null)

    const get = useCallback(async (id = null) => {
        const response = await fetch(`${ BASE_URL }${ resource }${ id ? `/${ id }` : '' }`)
        const result = await response.json()

        setData(result)
        return result
    }, [BASE_URL, resource])

    return [
        data,
        get
    ]
}