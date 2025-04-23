import { useSearchParams } from "react-router-dom"
import { API_BACKEND } from "../data"
import Notification from "../pages/Notification"
import { useState, useEffect } from "react"

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const userId = searchParams.get('userId')
    const token = searchParams.get('token')
    const [message, setMessage] = useState(null)
    
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`${API_BACKEND}/api/auth/verify-email`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId, token })
                })

                const data = await response.json()
                
                if (response.ok) {
                    setMessage(data.message || "Email verified successfully!")
                } else {
                    setMessage(data.message || "Email verification failed, please contact support!")
                }
            } catch (error) {
                setMessage("An error occurred during verification. Please try again later.")
            }
        }

        if (userId && token) {
            verifyEmail()
        } else {
            setMessage("Invalid verification link. Please check your email.")
        }
    }, [userId, token])

    return (
        <>
            {message && <Notification message={message} />}
        </>
    )
}

export default VerifyEmail