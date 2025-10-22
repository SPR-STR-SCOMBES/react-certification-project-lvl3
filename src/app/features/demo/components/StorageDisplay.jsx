import { useStorage } from '@/src/app/shared/utils/storage/useStorage'

export default function StorageDisplay({ className }) {
    const [user] = useStorage('user', null)
    const [post] = useStorage('post', null)

    return (
        <div className={ `space-y-6 w-full ${ className }` }>
            <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='font-bold text-lg mb-3 text-blue-700'>Utilisateur (clé: 'user')</h3>
                { user ? (
                    <div className='space-y-2'>
                        <p><strong>Nom:</strong> { user?.name }</p>
                        <p><strong>Email:</strong> { user?.email }</p>
                        <p><strong>Téléphone:</strong> { user?.phone }</p>
                        <p><strong>Site web:</strong> { user?.website }</p>
                        <p><strong>Entreprise:</strong> { user?.company?.name }</p>
                        <p><strong>Adresse:</strong> { user?.address?.street }, { user?.address?.city }</p>
                    </div>
                ) : (
                    <p className='text-gray-500 italic'>Aucun utilisateur sélectionné</p>
                ) }
            </div>

            <div className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='font-bold text-lg mb-3 text-blue-700'>Post (clé: 'post')</h3>
                { post ? (
                    <div className='space-y-2'>
                        <p><strong>Titre:</strong> { post?.title }</p>
                        <p><strong>Contenu:</strong> { post?.body }</p>
                        <span className='text-sm text-gray-600'>User ID: { post?.userId } | Post ID: { post?.id }</span>
                    </div>
                ) : (
                    <p className='text-gray-500 italic'>Aucun post sélectionné</p>
                ) }
            </div>
        </div>
    )
}