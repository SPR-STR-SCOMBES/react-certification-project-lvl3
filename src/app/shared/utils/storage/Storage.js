class Storage {
    constructor() {
        this.subscribers = new Map()

        if (window && typeof window !== 'undefined') {
            window.addEventListener('storage', this.handleStorageEvent.bind(this))
        }
    }

    handleStorageEvent(e) {
        if (e && e?.key && this.subscribers.has(e?.key)) {
            this.notify(e?.key, e?.newValue ? JSON.parse(e?.newValue) : null)
        }
    }

    subscribe(key, callback)  {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set())
        }

        this.subscribers.get(key).add(callback)

        return () => this.unsubscribe(key, callback)
    }

    unsubscribe(key, callback) {
        if (this.subscribers.has(key)) {
            this.subscribers.get(key)?.delete(callback)
            if (this.subscribers.get(key)?.size === 0) {
                this.subscribers.delete(key)
            }
        }
    }

    notify(key, value) {
        if (this.subscribers.has(key)) {
            this.subscribers.get(key)?.forEach((callback) => callback(value))
        }
    }

    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? null
        } catch (e) {
            console.error(`Une erreur est survenue lors de la lecture de la valeur associée à la clé "${ key }" : `, e)
            return null
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value))
            this.notify(key, value)
        } catch (e) {
            console.error(`Une erreur est survenue lors de l'écriture de la valeur "${ JSON.stringify(value) }" associée à la clé "${ key }" : `, e)
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key)
            this.notify(key, null)
        } catch (e) {
            console.error(`Une erreur est survenue lors de la suppression de la valeur associée à la clé "${ key }" : `, e)
        }
    }

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