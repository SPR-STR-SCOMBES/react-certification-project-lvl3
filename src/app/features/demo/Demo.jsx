import { useEffect } from 'react'
import { useFakeApi } from '@/src/app/shared/utils/fake-api/useFakeApi'
import { useModal } from '@/src/app/shared/components/modal/useModal'
import { useStorage } from '@/src/app/shared/utils/storage/useStorage'
import { AutoFilterDropdown } from '@/src/app/shared/components/auto-filter-dropdown/AutoFilterDropdown'
import StorageDisplay from '@/src/app/features/demo/components/StorageDisplay'
import ItemDisplay from '@/src/app/features/demo/components/ItemDisplay'
import { IoClose, IoWarning } from 'react-icons/io5'

/**
 * Composant de démonstration principal
 *
 * Page de démonstration présentant les fonctionnalités développées :
 * - useStorage : Persistance des sélections dans le localStorage
 * - ModalProvider/useModal : Affichage de modales et dialogues
 * - AutoFilterDropdown : Sélection avec filtrage automatique d'utilisateurs et posts
 * - useFakeApi : Récupération de données depuis une API REST
 *
 * Les utilisateurs et posts sélectionnés sont automatiquement sauvegardés
 * et peuvent être visualisés via différents types de modales.
 */
export default function Demo() {
    /**
     * Fonctions pour ouvrir des modales
     */
    const { openModal } = useModal()

    /**
     * Gestion de l'utilisateur sélectionné avec persistance localStorage
     */
    const [user, setUser, clearUser] = useStorage('user', null)

    /**
     * Gestion du post sélectionné avec persistance localStorage
     */
    const [post, setPost, clearPost] = useStorage('post', null)

    /**
     * Récupération de la liste des utilisateurs depuis l'API
     */
    const [users, getUsers] = useFakeApi('users')

    /**
     * Récupération de la liste des posts depuis l'API
     */
    const [posts, getPosts] = useFakeApi('posts')

    /**
     * Ouvre une modale classique avec bouton de fermeture
     * Le fond sombre ne ferme pas la modale au clic en dehors
     */
    function handleOpenStorageModal() {
        openModal({
            header: '[Modal] Etat du localStorage',
            body: <StorageDisplay />,
            footer:
                <div className='flex items-center space-x-2 bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-800'>
                    <IoWarning/>
                    <span className='text-sm'>Ce composant est une 'modale' classique : pour la fermer il suffit de cliquer sur la croix en haut à droite de la fenêtre.</span>
                </div>,
            closeOnBackdropClick: false,
            showCloseButton: true
        })
    }

    /**
     * Ouvre une modale avec fermeture au clic sur l'arrière-plan
     * Pas de bouton de fermeture visible
     */
    function handleOpenStorageModalWithCloseOnBackdropClick() {
        openModal({
            header: '[Modal + backdrop click] Etat du localStorage',
            body: <StorageDisplay />,
            footer:
                <div className='flex items-center space-x-2 bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-800'>
                    <IoWarning/>
                    <span className='text-sm'>Ce composant est une 'modale' avec 'closeOnBackdropClick' : pour la fermer il suffit de cliquer en dehors de la fenêtre.</span>
                </div>,
            closeOnBackdropClick: true,
            showCloseButton: false,
        })
    }

    /**
     * Ouvre une fenêtre de dialogue (sans arrière-plan bloquant)
     * Permet d'interagir avec la page en arrière-plan
     */
    function handleOpenStorageDialog() {
        openModal({
            isModal: false,
            header: '[Dialog] Etat du localStorage',
            body: <StorageDisplay className='h-[100px]'/>,
            footer:
                <div className='flex items-center space-x-2 bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-800'>
                    <IoWarning/>
                    <span className='text-sm'>Ce composant est une 'fenêtre de dialogue' : elle ne bloque pas les actions réalisées sur l'écran derrière elle.</span>
                </div>,
            showCloseButton: true
        })
    }

    /**
     * Charge les données des utilisateurs et posts au montage du composant
     */
    useEffect(() => {
        void getUsers()
        void getPosts()
    }, [])

    return (
        <div className='p-8 max-w-4xl mx-auto space-y-8 bg-gray-50'>
            <h1 className='text-3xl font-bold mb-6 text-center'>{ import.meta.env.VITE_APP_TITLE }</h1>

            <section className='bg-white p-6 rounded-lg shadow-md space-y-6'>
                <div>
                    <h3 className='text-lg font-semibold mb-3'>Sélectionnez un utilisateur</h3>
                    { users && (
                        <>
                            <div className='flex gap-2 items-start'>
                                <AutoFilterDropdown
                                    className='flex-1'
                                    options={ users || [] }
                                    labelKey='name'
                                    value={ user?.name }
                                    onChange={ (value) => setUser(value) }
                                    placeholder='Rechercher un utilisateur...'
                                    noResultMessage='Aucun utilisateur trouvé'
                                />
                                { user && (
                                    <button className='px-3 py-3 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white rounded-lg transition-colors font-bold' onClick={ () => clearUser() }>
                                        <IoClose/>
                                    </button>
                                )}
                            </div>
                            { user && (<ItemDisplay item={ user } labelKey='name' storageKey='user' />) }
                        </>
                    ) }
                </div>

                <div>
                    <h3 className='text-lg font-semibold mb-3'>Sélectionnez un post</h3>
                    { posts && (
                        <>
                            <div className='flex gap-2 items-start'>
                                <AutoFilterDropdown
                                    className='flex-1'
                                    options={ posts || [] }
                                    labelKey='title'
                                    value={ post?.title }
                                    onChange={ (value) => setPost(value) }
                                    placeholder='Rechercher un post...'
                                    noResultMessage='Aucun post trouvé'
                                />
                                { post && (
                                    <button className='px-3 py-3 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white rounded-lg transition-colors font-bold' onClick={ () => clearPost() }>
                                        <IoClose/>
                                    </button>
                                )}
                            </div>
                            { post && (<ItemDisplay item={ post } labelKey='title' storageKey='post' />) }
                        </>
                    ) }
                </div>
            </section>
            
            <section className='flex justify-center space-x-3'>
                <button className='px-8 py-3 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white rounded-lg transition-colors font-medium shadow-lg' onClick={ handleOpenStorageModal }>
                    Ouvrir une modal
                </button>
                <button className='px-8 py-3 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white rounded-lg transition-colors font-medium shadow-lg' onClick={ handleOpenStorageModalWithCloseOnBackdropClick }>
                    Ouvrir une modal (backdrop)
                </button>
                <button className='px-8 py-3 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white rounded-lg transition-colors font-medium shadow-lg' onClick={ handleOpenStorageDialog }>
                    Ouvrir une fenêtre de dialogue
                </button>
            </section>
        </div>
    )
}