import { motion } from "framer-motion"

const Toast = ({ message, onClose, type = "info" }) => {
    const getToastStyle = () => {
        switch (type) {
            case "error":
                return "text-red-500"
            case "success":
                return "text-green-500"
            case "info":
            default:
                return "text-blue-400"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="max-w-xs w-full"
        >
            <div className={`bg-black px-4 py-3 rounded-lg shadow-lg flex items-center justify-between border border-gray-800 ${getToastStyle()}`}>
                <p className="text-sm">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-4 hover:text-gray-400 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </motion.div>
    )
}

export default Toast
