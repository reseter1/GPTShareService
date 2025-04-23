import { Navigate } from "react-router-dom"

const Logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    return <Navigate to="/auth" />
}

export default Logout