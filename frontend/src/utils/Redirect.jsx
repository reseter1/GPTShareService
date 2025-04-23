import { Navigate } from "react-router-dom"

const Redirect = ({ children }) => {
    const token = localStorage.getItem("token")
    if (token) {
        return <Navigate to="/" />
    }
    return children
}

export default Redirect
