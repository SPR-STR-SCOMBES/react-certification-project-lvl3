import { useContext } from 'react'
import ModalContext from '@/src/app/shared/components/modal/ModalContext'

export function useModal() {
    return useContext(ModalContext)
}