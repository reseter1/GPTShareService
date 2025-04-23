import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { APP_NAME } from "../data"
import { useSearchParams } from "react-router-dom"
import { API_BACKEND } from "../data"
import { useToast } from "../context/ToastContext"
import Notification from "./Notification"

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [callingApi, setCallingApi] = useState(false)
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')
    const [message, setMessage] = useState("")
    const { addToast } = useToast()
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setPasswordsMatch(false)
            return
        }
        setPasswordsMatch(true)
        setCallingApi(true)
        try {
            const response = await fetch(`${API_BACKEND}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, userId, password: newPassword })
            })
            const data = await response.json()
            if (response.ok) {
                setMessage("Password reset successfully")
            } else {
                addToast("Error: " + data.message, "error")
            }
        } catch (error) {
            addToast("Error: " + error.message, "error")
        } finally {
            setCallingApi(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
    }

    return (
        <>
            {message ? <Notification message={message} /> : <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <div>
                        <motion.div className="flex justify-center" variants={itemVariants}>
                            <div className="flex flex-col items-center">
                                <img
                                    src="https://openfxt.vercel.app/images/favicon.png"
                                    alt="GPT Share Logo"
                                    className="w-12 h-12 rounded-full p-2 shadow-xl"
                                />
                                <h1 className="mt-2 text-2xl font-bold text-black">{APP_NAME}</h1>
                            </div>
                        </motion.div>
                        <motion.h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900" variants={itemVariants}>
                            Reset Password
                        </motion.h2>
                    </div>

                    <motion.form className="mt-8 space-y-6" onSubmit={handleSubmit} variants={containerVariants}>
                        <div className="rounded-md space-y-4">
                            <motion.div variants={itemVariants}>
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    id="new-password"
                                    name="new-password"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {!passwordsMatch && (
                                    <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                                )}
                            </motion.div>
                        </div>

                        <motion.div variants={itemVariants}>
                            <button
                                type="submit"
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${callingApi ? "cursor-not-allowed opacity-50 pointer-events-none" : "cursor-pointer"
                                    }`}
                                disabled={callingApi}
                            >
                                {callingApi ? "Processing..." : "Reset Password"}
                            </button>
                        </motion.div>

                        <motion.div className="text-center" variants={itemVariants}>
                            <Link
                                to="/auth"
                                className="text-sm font-medium text-black hover:text-gray-800"
                            >
                                Back to Login
                            </Link>
                        </motion.div>
                    </motion.form>
                </motion.div>
            </div>}
        </>
    )
}

export default ResetPassword
