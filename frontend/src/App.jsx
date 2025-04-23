import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthScreen from './pages/AuthScreen'
import NotFoundPage from './pages/404'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'
import VerifyEmail from './utils/VerifyEmail'
import RouteProtect from './utils/RouteProtect'
import Redirect from './utils/Redirect'
import Logout from './utils/Logout'
import Home from './pages/Home'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Redirect><AuthScreen /></Redirect>} />
        <Route path="/reset-password" element={<Redirect><ResetPassword /></Redirect>} />
        <Route path="/forgot-password" element={<Redirect><ForgotPassword /></Redirect>} />
        <Route path="/verify-email" element={<Redirect><VerifyEmail /></Redirect>} />
        <Route path="/" element={<RouteProtect><Home /></RouteProtect>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App