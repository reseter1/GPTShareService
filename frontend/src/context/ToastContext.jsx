import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Toast from '../components/Toast'

const ToastContext = createContext(undefined)

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now()

        setToasts(prevToasts => [
            ...prevToasts,
            { id, message, type, duration }
        ])

        if (duration !== Infinity) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }

        return id
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
    }, [])

    const success = useCallback((message, duration) =>
        addToast(message, 'success', duration), [addToast])

    const error = useCallback((message, duration) =>
        addToast(message, 'error', duration), [addToast])

    const info = useCallback((message, duration) =>
        addToast(message, 'info', duration), [addToast])

    return (
        <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
            {children}
            <div className="fixed top-0 right-0 z-50 p-4 flex flex-col items-end gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const context = useContext(ToastContext)

    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }

    return context
}