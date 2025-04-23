import { useState } from "react"
import { motion } from "framer-motion"
import { APP_NAME, API_BACKEND } from "../data"
import { useToast } from "../context/ToastContext"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const AuthScreen = () => {
    const [isSignIn, setIsSignIn] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [callingApi, setCallingApi] = useState(false)
    const [showEmailError, setShowEmailError] = useState(false)
    const { addToast } = useToast()
    const navigate = useNavigate()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setCallingApi(true)
        if (!isSignIn) {
            if (!email || !password || !username || !name) {
                setCallingApi(false)
                addToast("Please fill in all fields", "error")
                return
            }

            try {
                const response = await fetch(`${API_BACKEND}/api/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        username,
                        displayName: name
                    })
                })

                if (response.status === 201) {
                    addToast("Account created successfully, please verify your email", "success")
                } else {
                    const data = await response.json()
                    addToast("Error: " + data.message, "error")
                }
            } catch (error) {
                addToast("Error: " + error.message, "error")
            } finally {
                setCallingApi(false)
            }
        } else {
            if (!email || !password) {
                setCallingApi(false)
                addToast("Please fill in all fields", "error")
                return
            }

            try {
                const response = await fetch(`${API_BACKEND}/api/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                })

                if (response.status === 200) {
                    const data = await response.json()
                    localStorage.setItem("token", data.data.token)
                    localStorage.setItem("user", JSON.stringify(data.data.user))
                    navigate("/")
                } else {
                    const data = await response.json()
                    addToast("Error: " + data.message, "error")
                }
            } catch (error) {
                addToast("Error: " + error.message, "error")
            } finally {
                setCallingApi(false)
            }
        }
    }

    const handleEmailChange = (e) => {
        const value = e.target.value
        setEmail(value)
        if (value.endsWith('@gmail.com')) {
            setShowEmailError(false)
        } else {
            setShowEmailError(true)
        }
    }

    const toggleMode = () => {
        setIsSignIn(!isSignIn)
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
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-md w-full mb-8 md:mb-0 md:mr-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div className="bg-black text-white p-8 rounded-xl shadow-lg" variants={itemVariants}>
                    <h2 className="text-2xl font-bold mb-4">Meet MFC Chatbot</h2>
                    <p className="mb-4">Our intelligent assistant designed to help you with all your questions and tasks.</p>
                    <div className="flex items-center justify-center mb-4">
                        <img
                            src="https://openfxt.vercel.app/images/favicon.png"
                            alt="MFC Chatbot Logo"
                            className="w-32 h-32 rounded-full bg-white p-2"
                        />
                    </div>
                    <p className="text-sm mb-4">
                        Experience the power of AI with our advanced chatbot technology. Get instant answers, creative content, and
                        helpful assistance.
                    </p>
                    <a
                        href="https://mfc.reseter.space"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white ${callingApi ? "cursor-not-allowed opacity-50 pointer-events-none" : "cursor-pointer"}`}
                    >
                        Visit MFC Chatbot
                    </a>
                </motion.div>
            </motion.div>

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
                        {isSignIn ? "Sign in to your account" : "Create your account"}
                    </motion.h2>
                    <motion.p className="mt-2 text-center text-sm text-gray-600" variants={itemVariants}>
                        {isSignIn ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={toggleMode} className={`font-medium text-black hover:text-gray-800 ${callingApi ? "cursor-not-allowed opacity-50 pointer-events-none" : "cursor-pointer"}`}>
                            {isSignIn ? "Sign up" : "Sign in"}
                        </button>
                    </motion.p>
                </div>
                <motion.form className="mt-8 space-y-6" onSubmit={handleSubmit} variants={containerVariants}>
                    <div className="rounded-md space-y-4">
                        {!isSignIn && (
                            <>
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Display name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required={!isSignIn}
                                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                        placeholder="Display name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required={!isSignIn}
                                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </motion.div>
                            </>
                        )}
                        <motion.div variants={itemVariants}>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {showEmailError && (
                                <p className="mt-1 text-sm text-red-600 font-medium">
                                    Note: System only accepts authentication with @gmail.com accounts.
                                </p>
                            )}
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isSignIn ? "current-password" : "new-password"}
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </motion.div>
                    </div>

                    {isSignIn && (
                        <motion.div className="flex items-center justify-end " variants={itemVariants}>
                            <div className={`text-sm ${callingApi ? "cursor-not-allowed opacity-50 pointer-events-none" : "cursor-pointer"}`}>
                                <Link to="/forgot-password" className="font-medium text-black hover:text-gray-800">
                                    Forgot your password?
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    <motion.div variants={itemVariants}>
                        <button
                            type="submit"
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${callingApi ? "cursor-not-allowed opacity-50 pointer-events-none" : "cursor-pointer"}`}
                        >
                            {isSignIn ? `${callingApi ? "Signing in..." : "Sign in"}` : `${callingApi ? "Signing up..." : "Sign up"}`}
                        </button>
                    </motion.div>
                </motion.form>
            </motion.div>
        </div>
    )
}

export default AuthScreen