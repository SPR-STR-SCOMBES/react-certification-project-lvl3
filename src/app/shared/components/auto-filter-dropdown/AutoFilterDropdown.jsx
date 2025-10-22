import { useEffect, useRef, useState } from 'react'
import { IoChevronDown } from 'react-icons/io5'

export function AutoFilterDropdown({ options = [], value, onChange, labelKey = 'LABEL', noResultMessage, className = '', ...props }) {
    const [inputValue, setInputValue] = useState('')
    const [filteredData, setFilteredData] = useState(options)
    const [isOpen, setIsOpen] = useState(false)
    const [dropdownPosition, setDropdownPosition] = useState('bottom')

    const containerRef = useRef(null)
    const inputRef = useRef(null)
    const dropdownRef = useRef(null)

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

    function handleInputChange(e) {
        setInputValue(e.target.value)
        setIsOpen(true)
    }

    function handleKeyDown(e) {
        if (inputRef.current === e.target && e.code === 'Enter' && filteredData?.length === 1) {
            handleOptionSelect(filteredData[0])
        }
    }

    function handleTriggerClick() {
        inputRef.current?.focus()
    }

    function handleOptionSelect(option) {
        setInputValue(option[labelKey]?.toString())
        setIsOpen(false)
        onChange?.(option)
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('onClick', handleClickOutside)
        return () => document.removeEventListener('onClick', handleClickOutside)
    }, [])

    useEffect(() => {
        setFilteredData(!inputValue.trim()
            ? options
            : options?.filter(option => option[labelKey]?.toString()?.toLowerCase().includes(inputValue.toLowerCase()))
        )
    }, [inputValue, options, labelKey])

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