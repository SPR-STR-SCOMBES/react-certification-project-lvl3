/**
 * Classe Storage - Gestionnaire de localStorage avec système de souscription
 *
 * Cette classe encapsule l'API localStorage du navigateur et ajoute un système
 * de notifications pour permettre à plusieurs composants de réagir aux changements
 * de valeurs stockées. Elle gère automatiquement la sérialisation/désérialisation JSON.
 */
class Storage {
    /**
     * Initialise le gestionnaire de storage
     * Configure la Map des abonnés et écoute les événements storage du navigateur
     */
    constructor() {
        this.subscribers = new Map()

        if (window && typeof window !== 'undefined') {
            window.addEventListener('storage', this.handleStorageEvent.bind(this))
        }
    }

    /**
     * Gère les événements storage déclenchés par d'autres onglets/fenêtres
     * Notifie les abonnés concernés lorsqu'une valeur change dans un autre contexte
     * @param {StorageEvent} e - L'événement storage du navigateur
     */
    handleStorageEvent(e) {
        if (e && e?.key && this.subscribers.has(e?.key)) {
            this.notify(e?.key, e?.newValue ? JSON.parse(e?.newValue) : null)
        }
    }

    /**
     * Souscrit à une clé pour recevoir des notifications lors de ses changements
     * @param {string} key - La clé du localStorage à surveiller
     * @param {Function} callback - Fonction appelée avec la nouvelle valeur lors d'un changement
     * @returns {Function} Fonction de désinscription à appeler pour arrêter les notifications
     */
    subscribe(key, callback)  {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set())
        }

        this.subscribers.get(key).add(callback)

        return () => this.unsubscribe(key, callback)
    }

    /**
     * Désinscrit un callback des notifications pour une clé donnée
     * @param {string} key - La clé du localStorage
     * @param {Function} callback - Le callback à désinscrire
     */
    unsubscribe(key, callback) {
        if (this.subscribers.has(key)) {
            this.subscribers.get(key)?.delete(callback)
            if (this.subscribers.get(key)?.size === 0) {
                this.subscribers.delete(key)
            }
        }
    }

    /**
     * Notifie tous les abonnés d'une clé qu'une valeur a changé
     * @param {string} key - La clé dont la valeur a changé
     * @param {*} value - La nouvelle valeur (déjà désérialisée)
     */
    notify(key, value) {
        if (this.subscribers.has(key)) {
            this.subscribers.get(key)?.forEach((callback) => callback(value))
        }
    }

    /**
     * Récupère une valeur du localStorage
     * @param {string} key - La clé à récupérer
     * @returns {*} La valeur désérialisée ou null si elle n'existe pas ou en cas d'erreur
     */
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? null
        } catch (e) {
            console.error(`Une erreur est survenue lors de la lecture de la valeur associée à la clé "${ key }" : `, e)
            return null
        }
    }

    /**
     * Enregistre une valeur dans le localStorage et notifie les abonnés
     * @param {string} key - La clé sous laquelle sauvegarder
     * @param {*} value - La valeur à sauvegarder (sera sérialisée en JSON)
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value))
            this.notify(key, value)
        } catch (e) {
            console.error(`Une erreur est survenue lors de l'écriture de la valeur "${ JSON.stringify(value) }" associée à la clé "${ key }" : `, e)
        }
    }

    /**
     * Supprime une valeur du localStorage et notifie les abonnés
     * @param {string} key - La clé à supprimer
     */
    remove(key) {
        try {
            localStorage.removeItem(key)
            this.notify(key, null)
        } catch (e) {
            console.error(`Une erreur est survenue lors de la suppression de la valeur associée à la clé "${ key }" : `, e)
        }
    }

    /**
     * Vide complètement le localStorage et notifie tous les abonnés
     */
    clear() {
        try {
            localStorage.clear()
            Array.from(this.subscribers.keys())?.forEach((key) => this.notify(key, null))
        } catch (e) {
            console.error(`Une erreur est survenue lors de la suppression des valeurs du storage : `, e)
        }
    }
}

export const storage = new Storage()