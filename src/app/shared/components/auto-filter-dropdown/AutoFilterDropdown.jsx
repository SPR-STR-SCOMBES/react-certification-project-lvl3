import { useEffect, useRef, useState } from 'react'
import { IoChevronDown } from 'react-icons/io5'

/**
 * Composant de liste déroulante avec filtrage automatique
 *
 * Affiche un champ de saisie qui filtre automatiquement une liste d'options
 * au fur et à mesure de la frappe. Surligne les correspondances dans les résultats.
 * Gère le positionnement intelligent (en haut ou en bas selon l'espace disponible).
 *
 * @param {Object} props
 * @param {Array} props.options - Liste des options à afficher
 * @param {*} props.value - Valeur actuellement sélectionnée
 * @param {Function} props.onChange - Callback appelé lors de la sélection d'une option
 * @param {string} [props.labelKey='LABEL'] - Clé de l'objet à utiliser pour l'affichage
 * @param {string} props.noResultMessage - Message affiché quand aucun résultat ne correspond
 * @param {string} [props.className=''] - Classes CSS additionnelles
 * @param {Object} props...props - Autres props passées à l'input (placeholder, etc.)
 *
 * @example
 * <AutoFilterDropdown
 *   options={users}
 *   value={selectedUser?.name}
 *   onChange={(user) => setSelectedUser(user)}
 *   labelKey="name"
 *   placeholder="Rechercher un utilisateur..."
 *   noResultMessage="Aucun utilisateur trouvé"
 * />
 */
export function AutoFilterDropdown({ options = [], value, onChange, labelKey = 'LABEL', noResultMessage, className = '', ...props }) {
    /**
     * Valeur saisie dans l'input (texte de filtrage)
     */
    const [inputValue, setInputValue] = useState('')

    /**
     * Liste des options filtrées selon la saisie
     */
    const [filteredData, setFilteredData] = useState(options)

    /**
     * État d'ouverture du dropdown
     */
    const [isOpen, setIsOpen] = useState(false)

    /**
     * Position du dropdown ('top' ou 'bottom')
     */
    const [dropdownPosition, setDropdownPosition] = useState('bottom')

    /**
     * Références pour gérer les clics extérieurs et le positionnement
     */
    const containerRef = useRef(null)
    const inputRef = useRef(null)
    const dropdownRef = useRef(null)

    /**
     * Met en surbrillance les parties du label qui correspondent à la recherche
     * @param {string} label - Le texte à afficher
     * @param {string} value - Le texte recherché à surligner
     * @returns {React.ReactNode} Le label avec les parties correspondantes en gras
     */
    function highlight(label = '', value = '') {
        if (!value.trim()) return label

        return (
            <span>
                { label.split(new RegExp(`(${ value })`, 'gi')).map((part, i) =>
                    part.toLowerCase() === value.toLowerCase()
                        ? <strong key={ i }>{ part }</strong>
                        : part
                ) }
            </span>
        )
    }

    /**
     * Gère le changement de valeur dans l'input
     * Ouvre le dropdown automatiquement
     */
    function handleInputChange(e) {
        setInputValue(e.target.value)
        setIsOpen(true)
    }

    /**
     * Gère la touche Entrée pour sélectionner l'unique résultat filtré
     */
    function handleKeyDown(e) {
        if (inputRef.current === e.target && e.code === 'Enter' && filteredData?.length === 1) {
            handleOptionSelect(filteredData[0])
        }
    }

    /**
     * Donne le focus à l'input quand on clique sur le chevron
     */
    function handleTriggerClick() {
        inputRef.current?.focus()
    }

    /**
     * Gère la sélection d'une option dans la liste
     * Met à jour l'input, ferme le dropdown et appelle onChange
     * @param {Object} option - L'option sélectionnée
     */
    function handleOptionSelect(option) {
        setInputValue(option[labelKey]?.toString())
        setIsOpen(false)
        onChange?.(option)
    }

    /**
     * Ferme le dropdown quand on clique en dehors
     */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('onClick', handleClickOutside)
        return () => document.removeEventListener('onClick', handleClickOutside)
    }, [])

    /**
     * Filtre les options selon la saisie dans l'input
     */
    useEffect(() => {
        setFilteredData(!inputValue.trim()
            ? options
            : options?.filter(option => option[labelKey]?.toString()?.toLowerCase().includes(inputValue.toLowerCase()))
        )
    }, [inputValue, options, labelKey])

    /**
     * Synchronise l'input avec la valeur sélectionnée depuis l'extérieur
     */
    useEffect(() => {
        if (value) {
            const selected = options.find(opt => opt[labelKey] === value)
            if (selected) {
                setInputValue(selected[labelKey]?.toString())
            }
        } else {
            setInputValue('')
        }
    }, [value, options, labelKey])

    /**
     * Calcule la position optimale du dropdown (en haut ou en bas)
     * selon l'espace disponible à l'écran
     */
    useEffect(() => {
        if (isOpen && inputRef.current && dropdownRef.current) {
            const inputRect = inputRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - inputRect.bottom
            const spaceAbove = inputRect.top

            if (spaceBelow < 240 && spaceAbove > spaceBelow) {
                setDropdownPosition('top')
            } else {
                setDropdownPosition('bottom')
            }
        }
    }, [isOpen])

    return (
        <div ref={ containerRef } className={ `relative rounded-lg ${ className }` }>
            <div className='relative flex options-center'>
                <input
                    ref={ inputRef }
                    className={ `w-full px-3 py-2 border border-gray-300 rounded line-clamp-1 placeholder:text-gray-400 ${ className }` }
                    type='text'
                    value={ inputValue }
                    onChange={ handleInputChange }
                    onKeyDown={ handleKeyDown }
                    onFocus={ () => setIsOpen(true) }
                    onBlur={ () => setIsOpen(false) }
                    { ...props }
                />
                <button
                    className='absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none'
                    type='button'
                    onClick={ handleTriggerClick }>
                    <IoChevronDown className={ `transition-transform duration-200 ${ isOpen && 'rotate-180' }` } size={ 20 }/>
                </button>
            </div>
            { isOpen && (
                <div
                    ref={ dropdownRef }
                    className={ `absolute w-full z-10 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
                        dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                    }` }
                >
                    { filteredData.length === 0
                        ? (<div className='px-4 py-3 text-gray-500 text-sm'>{ noResultMessage }</div>)
                        : (
                            <ul className='py-1'>
                                { filteredData.map((option, i) => (
                                    <li key={ i }
                                        className='px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-150'
                                        onMouseDown={ () => handleOptionSelect(option) }>
                                        { highlight(option[labelKey]?.toString(), inputValue) }
                                    </li>
                                )) }
                            </ul>
                        )
                    }
                </div>
            ) }
        </div>
    )
}