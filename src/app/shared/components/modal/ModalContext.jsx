import { createContext } from 'react'

/**
 * Contexte React pour la gestion des modales
 *
 * Ce contexte permet de partager les fonctions d'ouverture et de fermeture
 * de modale entre tous les composants de l'application sans avoir à passer
 * des props à travers plusieurs niveaux de composants.
 *
 * Fourni par ModalProvider et consommé via le hook useModal.
 */
const ModalContext = createContext()
export default ModalContext