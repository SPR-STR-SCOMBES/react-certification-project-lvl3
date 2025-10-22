/**
 * Composant d'affichage d'un élément sélectionné
 *
 * Affiche les informations d'un élément sélectionné sous forme de carte :
 * - Le label principal de l'élément
 * - Le contenu complet en JSON formaté avec indentation
 * - Un indicateur confirmant l'enregistrement dans le localStorage
 *
 * @param {Object} props
 * @param {Object} props.item - L'objet à afficher
 * @param {string} [props.labelKey='LABEL'] - La clé de l'objet à utiliser comme titre
 * @param {string} props.storageKey - Le nom de la clé utilisée dans le localStorage
 *
 * @example
 * <ItemDisplay
 *   item={user}
 *   labelKey="name"
 *   storageKey="user"
 * />
 */
export default function ItemDisplay({ item, labelKey = 'LABEL', storageKey }) {
    return (
    <div className='mt-3 p-3 bg-blue-50 rounded border border-blue-200'>
        <span><strong>Sélectionné&nbsp;:&nbsp;</strong>{ item?.[labelKey] }</span>
        <pre className='text-sm text-gray-600 mt-1 whitespace-pre-wrap'>{ JSON.stringify(item, null, 2) }</pre>
        <span className='text-xs text-blue-600 mt-1'>✓ Enregistré dans le localStorage (clé: '{ storageKey }')</span>
    </div>
    )
}