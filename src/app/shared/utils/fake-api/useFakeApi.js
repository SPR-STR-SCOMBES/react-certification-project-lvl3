import { useCallback, useState } from 'react'

/**
 * Hook React pour effectuer des appels API GET sur une ressource
 *
 * Ce hook permet de récupérer des données depuis une API REST de manière simple.
 * Il gère automatiquement le state des données et fournit une fonction pour
 * déclencher les appels API. Le composant se re-render automatiquement quand
 * les données sont chargées.
 *
 * @param {string} resource - Le nom de la ressource à interroger (ex: 'users', 'posts')
 * @returns {Array} Tableau [data, get]
 *   - data: Les données récupérées de l'API (null avant le premier appel)
 *   - get: Fonction asynchrone pour effectuer un appel GET
 *
 * @example
 * const [users, getUsers] = useFakeApi('users')
 * const [user, getUser] = useFakeApi('users')
 *
 * // Récupérer tous les utilisateurs
 * await getUsers()
 *
 * // Récupérer un utilisateur spécifique
 * await getUser(1)
 */
export function useFakeApi(resource) {
    const BASE_URL = import.meta.env.VITE_FAKE_API_BASE_URL

    /**
     * Stocke les données récupérées de l'API
     */
    const [data, setData] = useState(null)

    /**
     * Effectue un appel GET vers l'API
     * @param {number|string|null} id - ID optionnel pour récupérer une ressource spécifique
     * @returns {Promise<*>} Les données récupérées de l'API
     */
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