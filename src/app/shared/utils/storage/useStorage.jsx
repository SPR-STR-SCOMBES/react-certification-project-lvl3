import { storage } from '@/src/app/shared/utils/storage/Storage'
import { useCallback, useEffect, useState } from 'react'

/**
 * Hook React pour gérer une valeur dans le localStorage avec synchronisation
 *
 * Ce hook permet de lire, écrire et supprimer des valeurs dans le localStorage
 * tout en gardant le composant synchronisé avec les changements. Si la valeur
 * change (via ce hook ou un autre composant), le composant se re-render automatiquement.
 *
 * @param {string} key - La clé du localStorage à gérer
 * @param {*} initialValue - Valeur par défaut si aucune valeur n'existe dans le localStorage
 * @returns {Array} Tableau [valeur, setValue, clearValue]
 *   - valeur: La valeur actuelle du localStorage (ou initialValue si absente)
 *   - setValue: Fonction pour modifier la valeur dans le localStorage
 *   - clearValue: Fonction pour supprimer la valeur du localStorage
 *
 * @example
 * const [user, setUser, clearUser] = useStorage('user', null)
 * setUser({ name: 'John', age: 30 })
 * clearUser()
 */
export function useStorage(key, initialValue = null)  {
    /**
     * Initialise le state avec la valeur du localStorage ou la valeur initiale
     */
    const [storedValue, setStoredValue] = useState(() => {
        return storage.get(key) ?? initialValue
    })

    /**
     * Met à jour la valeur dans le localStorage
     * Notifie automatiquement tous les composants abonnés à cette clé
     */
    const setValue = useCallback((value) => {
        storage.set(key, value)
    }, [key])

    /**
     * Supprime la valeur du localStorage
     * Notifie automatiquement tous les composants abonnés à cette clé
     */
    const clearValue = useCallback(() => {
        storage.remove(key)
    }, [key])

    /**
     * S'abonne aux changements de cette clé dans le localStorage
     * Met à jour le state local quand la valeur change ailleurs
     */
    useEffect(() => {
        const unsubscribe = storage.subscribe(key, setStoredValue)
        return () => unsubscribe()
    }, [key])

    return [storedValue, setValue, clearValue]
}