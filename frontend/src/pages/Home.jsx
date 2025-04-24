import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    LockIcon,
    KeyIcon,
    LogOutIcon,
    MessageSquareIcon,
    SettingsIcon,
    CopyIcon,
    RefreshCwIcon,
    CheckCircleIcon,
    InfoIcon,
    ExternalLinkIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { API_BACKEND } from "../data"
import { useRef } from "react"
import { useToast } from "../context/ToastContext"
const mockAccounts = [
    {
        id: 1,
        email: "Can't load accounts",
        password: "Can't load accounts",
        status: "disabled",
    },
    {
        id: 2,
        email: "Can't load accounts",
        password: "Can't load accounts",
        status: "disabled",
    },
    {
        id: 3,
        email: "Can't load accounts",
        password: "Can't load accounts",
        status: "disabled",
    },
]



const Home = () => {
    const [activeTab, setActiveTab] = useState("accounts")
    const [feedback, setFeedback] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState({})
    const [loading2FA, setLoading2FA] = useState({})
    const [twoFACode, setTwoFACode] = useState({})
    const [copiedPassword, setCopiedPassword] = useState({})
    const [copiedEmail, setCopiedEmail] = useState({})
    const [accounts, setAccounts] = useState(mockAccounts)
    const [submittingFeedback, setSubmittingFeedback] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)
    const [loadingAccounts, setLoadingAccounts] = useState(true)
    const [longLoading, setLongLoading] = useState(false)
    const loadingTimer = useRef(null)
    const hasFetchedAccounts = useRef(false)
    const { addToast } = useToast()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAccounts = async () => {
            if (hasFetchedAccounts.current) return
            hasFetchedAccounts.current = true
            setLoadingAccounts(true)

            loadingTimer.current = setTimeout(() => {
                setLongLoading(true)
            }, 10000)

            const response = await fetch(`${API_BACKEND}/api/gpt-fetcher/fetch-gpt-account`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            const dataResponse = await response.json()

            clearTimeout(loadingTimer.current)
            setLoadingAccounts(false)
            setLongLoading(false)

            if (dataResponse.success) {
                const { success, data } = dataResponse;

                if (success && data) {
                    const updatedAccounts = [
                        {
                            id: 1,
                            email: data.email1 || "Unavailable",
                            password: data.password1 || "Unavailable",
                            status: data.email1 ? "active" : "disabled",
                        },
                        {
                            id: 2,
                            email: data.email2 || "Unavailable",
                            password: data.password2 || "Unavailable",
                            status: data.email2 ? "active" : "disabled",
                        },
                        {
                            id: 3,
                            email: data.email3 || "Unavailable",
                            password: data.password3 || "Unavailable",
                            status: data.email3 ? "active" : "disabled",
                        },
                    ];

                    setAccounts(updatedAccounts);

                    if (data.storeApiNonce && data.wcStoreApiNonceTimestamp) {
                        localStorage.setItem("storeApiNonce", data.storeApiNonce);
                        localStorage.setItem("wcStoreApiNonceTimestamp", data.wcStoreApiNonceTimestamp);
                    }
                } else {
                    addToast("Error: " + dataResponse.message, "error")
                }
            } else {
                addToast("Error: " + dataResponse.message, "error")
            }
        }
        fetchAccounts()
    }, [addToast])

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

    const tabContentVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                duration: 0.5
            }
        },
        exit: {
            opacity: 0,
            x: 20,
            transition: { duration: 0.2 }
        }
    }

    const glowingBorderVariants = {
        animate: {
            boxShadow: [
                "0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(0, 0, 0, 0.3)",
                "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)",
                "0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(0, 0, 0, 0.3)",
            ],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    const logoPulseVariants = {
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.05,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        },
        tap: { scale: 0.95 }
    }

    const accountCardVariants = {
        hover: {
            y: -5,
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
    }

    const handleSubmitFeedback = async (e) => {
        e.preventDefault()

        if (!feedback.trim()) {
            addToast("Please enter your feedback", "error")
            return
        }

        setSubmittingFeedback(true)

        try {
            const token = localStorage.getItem("token")
            const userData = JSON.parse(localStorage.getItem("user") || "{}")
            const userEmail = userData.email || ""

            const response = await fetch(`${API_BACKEND}/api/support/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: userEmail,
                    feedback: feedback
                })
            })

            const data = await response.json()

            if (data.success) {
                addToast("Feedback submitted successfully", "success")
                setFeedback("")
            } else {
                addToast(`Error: ${data.message || "Failed to submit feedback"}`, "error")
            }
        } catch (error) {
            addToast(`Error: ${error.message || "Something went wrong"}`, "error")
        } finally {
            setSubmittingFeedback(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            addToast("New passwords don't match!", "error")
            return
        }

        if (!currentPassword || !newPassword) {
            addToast("Please fill in all password fields", "error")
            return
        }

        setChangingPassword(true)

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(`${API_BACKEND}/api/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: currentPassword,
                    password: newPassword
                })
            })

            const data = await response.json()

            if (data.success) {
                addToast("Password changed successfully!", "success")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            } else {
                addToast(`Error: ${data.message || "Failed to change password"}`, "error")
            }
        } catch (error) {
            addToast(`Error: ${error.message || "Something went wrong"}`, "error")
        } finally {
            setChangingPassword(false)
        }
    }

    const handleLogout = () => {
        navigate("/logout")
    }

    const togglePasswordVisibility = (id) => {
        setShowPassword((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const copyPassword = (id, password) => {
        navigator.clipboard.writeText(password)
        setCopiedPassword((prev) => ({
            ...prev,
            [id]: true,
        }))

        setTimeout(() => {
            setCopiedPassword((prev) => ({
                ...prev,
                [id]: false,
            }))
        }, 2000)
    }

    const copyEmail = (id, email) => {
        navigator.clipboard.writeText(email)
        setCopiedEmail((prev) => ({
            ...prev,
            [id]: true,
        }))

        setTimeout(() => {
            setCopiedEmail((prev) => ({
                ...prev,
                [id]: false,
            }))
        }, 2000)
    }

    const generate2FACode = async (id) => {
        setLoading2FA((prev) => ({
            ...prev,
            [id]: true,
        }))

        try {
            const nonce = localStorage.getItem("storeApiNonce")
            const response = await fetch(`${API_BACKEND}/api/gpt-fetcher/fetch-2fa-code`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    account: id.toString(),
                    nonce: nonce
                })
            })

            const data = await response.json()

            if (data.success) {
                setTwoFACode((prev) => ({
                    ...prev,
                    [id]: data.data
                }))
                addToast("2FA code generated successfully", "success")
            } else {
                addToast("Error: " + data.message, "error")
            }
        } catch (error) {
            addToast("Error: " + (error.message || "Unknown error"), "error")
        } finally {
            setLoading2FA((prev) => ({
                ...prev,
                [id]: false,
            }))
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                css={{
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)",
                    animation: "pulse 3s infinite ease-in-out"
                }}
            >
                <style jsx>{`
                    @keyframes pulse {
                        0% {
                            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(0, 0, 0, 0.3);
                        }
                        50% {
                            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
                        }
                        100% {
                            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(0, 0, 0, 0.3);
                        }
                    }
                `}</style>
                <div className="flex flex-col md:flex-row">
                    <motion.div
                        className="bg-black text-white p-8 md:w-1/3"
                        variants={itemVariants}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold mb-4">MFC Chatbot</h2>
                        <motion.div
                            className="flex items-center justify-center mb-4"
                            variants={logoPulseVariants}
                            animate="animate"
                        >
                            <motion.img
                                src="https://openfxt.vercel.app/images/favicon.png"
                                alt="MFC Chatbot Logo"
                                className="w-24 h-24 rounded-full bg-white p-2"
                                whileHover={{ rotate: 360, transition: { duration: 1 } }}
                            />
                        </motion.div>
                        <p className="text-sm mb-6">
                            Experience the power of AI with our advanced chatbot technology. Get instant answers, creative content,
                            and helpful assistance with MFC Chatbot.
                        </p>
                        <div className="space-y-2">
                            <motion.div
                                className="flex items-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-400" />
                                <span>Advanced AI capabilities</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-400" />
                                <span>Multiple account management</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-400" />
                                <span>Secure authentication</span>
                            </motion.div>
                        </div>
                        <motion.a
                            href="https://mfc.reseter.space"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            Visit MFC Chatbot
                        </motion.a>
                    </motion.div>

                    <div className="p-8 md:w-2/3">
                        <motion.div className="flex border-b border-gray-200 mb-6" variants={itemVariants}>
                            {["accounts", "settings", "feedback", "about"].map((tab) => (
                                <motion.button
                                    key={tab}
                                    className={`py-2 px-4 font-medium text-sm ${activeTab === tab ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    onClick={() => handleTabChange(tab)}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: tab === "accounts" ? 0.2 : tab === "settings" ? 0.3 : tab === "feedback" ? 0.4 : 0.5 }}
                                >
                                    {tab === "accounts" ? (
                                        <MessageSquareIcon className="w-4 h-4 inline mr-1" />
                                    ) : tab === "settings" ? (
                                        <SettingsIcon className="w-4 h-4 inline mr-1" />
                                    ) : tab === "about" ? (
                                        <InfoIcon className="w-4 h-4 inline mr-1" />
                                    ) : (
                                        <MessageSquareIcon className="w-4 h-4 inline mr-1" />
                                    )}
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </motion.button>
                            ))}
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {activeTab === "accounts" && (
                                <motion.div
                                    key="accounts"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={tabContentVariants}
                                    className="space-y-6"
                                >
                                    <motion.h2
                                        className="text-xl font-bold text-gray-900"
                                        variants={itemVariants}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        Free ChatGPT Plus Accounts
                                    </motion.h2>

                                    {loadingAccounts && (
                                        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="loading-spinner mb-4">
                                                    <div className="spinner-circle"></div>
                                                    <div className="spinner-circle-inner"></div>
                                                </div>
                                                <span className="shimmer-text font-medium text-center">
                                                    {longLoading ?
                                                        "System is still loading, please be patient..." :
                                                        "Loading accounts from server..."}
                                                </span>
                                            </div>
                                            <style jsx>{`
                                                .loading-spinner {
                                                    position: relative;
                                                    width: 50px;
                                                    height: 50px;
                                                }
                                                .spinner-circle {
                                                    position: absolute;
                                                    border: 3px solid rgba(0, 0, 0, 0.1);
                                                    border-top-color: #000000;
                                                    border-radius: 50%;
                                                    width: 100%;
                                                    height: 100%;
                                                    animation: spin 1s linear infinite;
                                                }
                                                .spinner-circle-inner {
                                                    position: absolute;
                                                    top: 10px;
                                                    left: 10px;
                                                    right: 10px;
                                                    bottom: 10px;
                                                    border: 3px solid transparent;
                                                    border-bottom-color: #555555;
                                                    border-radius: 50%;
                                                    animation: spin 0.8s linear infinite reverse;
                                                }
                                                .shimmer-text {
                                                    color: #333;
                                                    position: relative;
                                                    overflow: hidden;
                                                }
                                                .shimmer-text::before {
                                                    content: '';
                                                    position: absolute;
                                                    top: 0;
                                                    left: -100%;
                                                    width: 100%;
                                                    height: 100%;
                                                    background: linear-gradient(
                                                        90deg,
                                                        rgba(255, 255, 255, 0) 0%,
                                                        rgba(255, 255, 255, 0.8) 50%,
                                                        rgba(255, 255, 255, 0) 100%
                                                    );
                                                    animation: shimmer 2s infinite;
                                                }
                                                @keyframes spin {
                                                    0% { transform: rotate(0deg); }
                                                    100% { transform: rotate(360deg); }
                                                }
                                                @keyframes shimmer {
                                                    0% { left: -100%; }
                                                    100% { left: 100%; }
                                                }
                                            `}</style>
                                        </div>
                                    )}

                                    {!loadingAccounts && accounts.map((account, index) => (
                                        <motion.div
                                            key={account.id}
                                            className="bg-gray-50 p-4 rounded-lg shadow-sm"
                                            variants={accountCardVariants}
                                            whileHover="hover"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * (index + 1) }}
                                        >
                                            <div className="flex items-center mb-2">
                                                <motion.div
                                                    className={`w-3 h-3 rounded-full mr-2 ${account.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                                                    animate={{
                                                        scale: account.status === "active" ? [1, 1.2, 1] : 1,
                                                        opacity: account.status === "active" ? [0.8, 1, 0.8] : 0.8
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: account.status === "active" ? Infinity : 0,
                                                        ease: "easeInOut"
                                                    }}
                                                ></motion.div>
                                                <span className="font-medium">{account.status === "active" ? "Active" : "Inactive"}</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={account.email}
                                                            className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                        />
                                                        <motion.button
                                                            className="ml-2 p-1 text-gray-500 hover:text-black"
                                                            onClick={() => copyEmail(account.id, account.email)}
                                                            variants={buttonVariants}
                                                            whileHover="hover"
                                                            whileTap="tap"
                                                        >
                                                            {copiedEmail[account.id] ? (
                                                                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <CopyIcon className="w-4 h-4" />
                                                            )}
                                                        </motion.button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                    <div className="flex items-center">
                                                        <input
                                                            type={showPassword[account.id] ? "text" : "password"}
                                                            readOnly
                                                            value={account.password}
                                                            className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                        />
                                                        <motion.button
                                                            className="ml-2 p-1 text-gray-500 hover:text-black"
                                                            onClick={() => togglePasswordVisibility(account.id)}
                                                            variants={buttonVariants}
                                                            whileHover="hover"
                                                            whileTap="tap"
                                                        >
                                                            <LockIcon className="w-4 h-4" />
                                                        </motion.button>
                                                        <motion.button
                                                            className="ml-1 p-1 text-gray-500 hover:text-black"
                                                            onClick={() => copyPassword(account.id, account.password)}
                                                            variants={buttonVariants}
                                                            whileHover="hover"
                                                            whileTap="tap"
                                                        >
                                                            {copiedPassword[account.id] ? (
                                                                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                                            ) : (
                                                                <CopyIcon className="w-4 h-4" />
                                                            )}
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">2FA Code</label>
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={twoFACode[account.id] || ""}
                                                        placeholder="Click button to generate 2FA code"
                                                        className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                    />
                                                    <motion.button
                                                        className={`ml-2 px-2 py-1.5 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex items-center ${loading2FA[account.id] ? "opacity-75" : ""}`}
                                                        onClick={() => generate2FACode(account.id)}
                                                        disabled={loading2FA[account.id]}
                                                        variants={buttonVariants}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                    >
                                                        {loading2FA[account.id] ? (
                                                            <RefreshCwIcon className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <KeyIcon className="w-4 h-4" />
                                                        )}
                                                        <span className="ml-1 whitespace-nowrap">
                                                            {loading2FA[account.id] ? "Loading..." : "Get Code"}
                                                        </span>
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === "settings" && (
                                <motion.div
                                    key="settings"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={tabContentVariants}
                                    className="space-y-6"
                                >
                                    <motion.h2
                                        className="text-xl font-bold text-gray-900"
                                        variants={itemVariants}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        Account Settings
                                    </motion.h2>

                                    <motion.form
                                        onSubmit={handleChangePassword}
                                        variants={itemVariants}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="space-y-4">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Current Password
                                                </label>
                                                <input
                                                    id="currentPassword"
                                                    type="password"
                                                    required
                                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                                    placeholder="Enter current password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    disabled={changingPassword}
                                                />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                    New Password
                                                </label>
                                                <input
                                                    id="newPassword"
                                                    type="password"
                                                    required
                                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                                    placeholder="Enter new password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    disabled={changingPassword}
                                                />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    id="confirmPassword"
                                                    type="password"
                                                    required
                                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                                    placeholder="Confirm new password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    disabled={changingPassword}
                                                />
                                            </motion.div>
                                        </div>

                                        <div className="mt-6">
                                            <motion.button
                                                type="submit"
                                                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${changingPassword ? 'opacity-75 cursor-not-allowed' : ''}`}
                                                disabled={changingPassword}
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                {changingPassword ? (
                                                    <>
                                                        <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
                                                        Changing Password...
                                                    </>
                                                ) : (
                                                    "Change Password"
                                                )}
                                            </motion.button>
                                        </div>
                                    </motion.form>

                                    <motion.div
                                        className="pt-4 border-t border-gray-200"
                                        variants={itemVariants}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <motion.button
                                            onClick={handleLogout}
                                            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                        >
                                            <LogOutIcon className="w-4 h-4 mr-2" />
                                            Logout
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            )}

                            {activeTab === "feedback" && (
                                <motion.div
                                    key="feedback"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={tabContentVariants}
                                    className="space-y-6"
                                >
                                    <motion.h2
                                        className="text-xl font-bold text-gray-900"
                                        variants={itemVariants}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        Send Feedback
                                    </motion.h2>

                                    <motion.form
                                        onSubmit={handleSubmitFeedback}
                                        variants={itemVariants}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                                                Your Feedback
                                            </label>
                                            <textarea
                                                id="feedback"
                                                rows={4}
                                                required
                                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                                placeholder="Tell us what you think about our service..."
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                disabled={submittingFeedback}
                                            />
                                        </motion.div>

                                        <div className="mt-6">
                                            <motion.button
                                                type="submit"
                                                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${submittingFeedback ? 'opacity-75 cursor-not-allowed' : ''}`}
                                                disabled={submittingFeedback}
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                {submittingFeedback ? (
                                                    <>
                                                        <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    "Submit Feedback"
                                                )}
                                            </motion.button>
                                        </div>
                                    </motion.form>
                                </motion.div>
                            )}

                            {activeTab === "about" && (
                                <motion.div
                                    key="about"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={tabContentVariants}
                                    className="space-y-6"
                                >
                                    <motion.h2
                                        className="text-xl font-bold text-gray-900"
                                        variants={itemVariants}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        About Our Service
                                    </motion.h2>

                                    <motion.div
                                        variants={itemVariants}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="prose prose-sm max-w-none"
                                    >
                                        <p className="text-gray-700 mb-4">
                                            This service is provided by Reseter with the purpose of making advanced AI technologies
                                            more accessible to the broader community. We believe that everyone should have the opportunity
                                            to experience OpenAI's premium models before deciding whether to purchase their own subscription.
                                        </p>

                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <span className="text-yellow-400">⚠️</span>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                                                    <div className="mt-2 text-sm text-yellow-700">
                                                        <p>
                                                            This service is provided for educational and trial purposes only. We strongly discourage
                                                            the prolonged or abusive use of these accounts. Our system is designed to monitor
                                                            and prevent misuse, and we reserve the right to restrict access to users who
                                                            attempt to exploit this community resource.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-md font-semibold mt-6 mb-2">Our Mission</h3>
                                        <p className="text-gray-700 mb-4">
                                            We aim to bridge the gap between advanced AI technology and the general public.
                                            By providing temporary access to ChatGPT Plus features, we enable users to:
                                        </p>

                                        <ul className="list-disc pl-5 space-y-2 mb-4">
                                            <li>Experience the full capabilities of premium AI models</li>
                                            <li>Make informed decisions about purchasing their own subscriptions</li>
                                            <li>Learn and experiment with AI in ways that might otherwise be financially inaccessible</li>
                                        </ul>

                                        <h3 className="text-md font-semibold mt-6 mb-2">Compliance Statement</h3>
                                        <p className="text-gray-700 mb-4">
                                            Reseter has sought permission from OpenAI to operate this community service.
                                            We are committed to operating within ethical boundaries and will promptly
                                            discontinue this service if requested by OpenAI. We respect intellectual
                                            property rights and the terms of service of all platforms we interact with.
                                        </p>

                                        <div className="mt-6 border-t border-gray-200 pt-6">
                                            <motion.a
                                                href="https://portfolio.reseter.space"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                Visit Reseter's Portfolio
                                                <ExternalLinkIcon className="ml-2 -mr-1 h-4 w-4" aria-hidden="true" />
                                            </motion.a>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Home