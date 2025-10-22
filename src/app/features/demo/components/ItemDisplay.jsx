export default function ItemDisplay({ item, labelKey = 'LABEL', storageKey }) {
    return (
    <div className='mt-3 p-3 bg-blue-50 rounded border border-blue-200'>
        <span><strong>Sélectionné&nbsp;:&nbsp;</strong>{ item?.[labelKey] }</span>
        <pre className='text-sm text-gray-600 mt-1 whitespace-pre-wrap'>{ JSON.stringify(item, null, 2) }</pre>
        <span className='text-xs text-blue-600 mt-1'>✓ Enregistré dans le localStorage (clé: '{ storageKey }')</span>
    </div>
    )
}