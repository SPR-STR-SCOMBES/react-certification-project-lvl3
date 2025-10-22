import Demo from '@/src/app/features/demo/Demo'
import { ModalProvider } from '@/src/app/shared/components/modal/ModalProvider'

export default function App() {
    return (
        <div className='flex flex-col min-h-screen'>
                <main className='flex-1'>
                    <ModalProvider>
                        <Demo/>
                    </ModalProvider>
                </main>
        </div>
    )
}