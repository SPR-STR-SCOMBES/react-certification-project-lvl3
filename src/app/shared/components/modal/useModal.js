import { useContext } from 'react'
import ModalContext from '@/src/app/shared/components/modal/ModalContext'

/**
 * Hook React pour contrôler les modales de l'application
 *
 * Ce hook donne accès aux fonctions openModal et closeModal permettant
 * d'afficher ou de fermer une modale depuis n'importe quel composant.
 *
 * @returns {Object} Objet contenant { openModal, closeModal }
 *   - openModal: Fonction pour ouvrir une modale avec des options personnalisées
 *   - closeModal: Fonction pour fermer la modale actuellement ouverte
 *
 * @example
 * const { openModal, closeModal } = useModal()
 *
 * openModal({
 *   header: 'Titre de la modale',
 *   body: <MonComposant />,
 *   footer: <button onClick={closeModal}>Fermer</button>
 * })
 */
export function useModal() {
    return useContext(ModalContext)
}