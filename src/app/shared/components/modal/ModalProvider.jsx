import { isValidElement, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import ModalContext from '@/src/app/shared/components/modal/ModalContext'

export function ModalProvider({ children }) {
    const initialState = {
        isOpen: false,
        isModal: true,
        header: null,
        body: null,
        footer: null,
        closeOnBackdropClick: true,
        showCloseButton: true,
    }

    const [state, setState] = useState(initialState)

    function openModal(options) {
        setState(prevState => ({
            isOpen: true,
            isModal: !options ? prevState?.isModal : options?.isModal !== undefined ? options?.isModal : true,
            header: !options ? prevState?.header : options?.header || null,
            body: !options ? prevState?.body : options?.body || null,
            footer: !options ? prevState?.footer : options?.footer || null,
            closeOnBackdropClick: !options ? prevState?.closeOnBackdropClick : options?.closeOnBackdropClick !== undefined ? options?.closeOnBackdropClick : true,
            showCloseButton: !options ? prevState?.showCloseButton : options?.showCloseButton !== undefined ? options?.showCloseButton : true,
        }))
    }

    function closeModal() {
        setState(prevState => ({
            ...prevState,
            isOpen: false,
        }))
    }

    function handleBackdropClick(e) {
        if (state?.isModal && state?.closeOnBackdropClick && e?.target === e?.currentTarget) {
            closeModal()
        }
    }

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            { children }
            { state?.isOpen && (
                <div className={ `fixed flex inset-0 items-center justify-center ${ state?.isModal ? 'bg-black/50 backdrop-blur-sm' : 'pointer-events-none' } z-50 p-4` } onClick={ handleBackdropClick }>
                    <div className='bg-white opacity-100 rounded-2xl shadow-lg w-11/12 max-w-4xl max-h-[calc(100vh-2rem)] my-auto flex flex-col pointer-events-auto' onClick={ (e) => e.stopPropagation() }>
                        <div className='flex justify-center items-center p-6 pb-4 relative'>
                            { state?.showCloseButton &&
                                <button className='absolute right-6 hover:cursor-pointer' onClick={ closeModal }>
                                    <IoClose size={ 24 }/>
                                </button>
                            }
                            { state?.header && (
                                typeof state?.header === 'string'
                                    ? (<h2 className='text-xl font-bold text-center'>{ state?.header }</h2>)
                                    : isValidElement(state?.header) && state?.header
                            ) }
                        </div>
                        <div className='flex-1 overflow-y-auto p-6 flex flex-col items-center'>
                            { state?.body && (
                                typeof state?.body === 'string'
                                    ? (<p className='text-center'>{ state?.body }</p>)
                                    : isValidElement(state?.body) && state?.body
                            ) }
                        </div>
                        { state?.footer && (
                            <div className='p-6 pt-4 flex justify-center'>
                                { typeof state?.footer === 'string'
                                    ? (<h2 className='text-center'>{ state?.footer }</h2>)
                                    : isValidElement(state?.footer) && state?.footer
                                }
                            </div>
                        ) }
                    </div>
                </div>
            ) }
        </ModalContext.Provider>
    )
}