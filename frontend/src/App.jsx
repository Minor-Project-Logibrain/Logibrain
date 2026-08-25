
import './App.css'
import Login from './components/Login'
import Otp from './components/Otp'
import Signup from './components/SignUp'
import Home from './pages/Home'
import AskRole from './components/AskRole'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import ForgotPassEmail from './components/ForgotPassEmail'
import UpdatePass from './components/updatePass'
import OwnerDashBoard from './components/OwnerDashBoard'
import AddDriverForm from './components/addDriverForm'
import ProtectedOwnerRoutes from './utils/ProtectedOwnerRoutes'
import DriverDashBoard from './components/DriverDashBoard'
import ProtectedDriverRoutes from './utils/ProtectedDriverRoutes'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/otp' element={<Otp />} />
          <Route path='/signup-otp' element={<Otp />} />
          <Route path='/login-otp' element={<Otp />} />
          <Route path='/forgot-pass-otp' element={<Otp />} />
          <Route path='/ask-role' element={<AskRole />} />
          <Route path='/auth/forgot-password' element={<ForgotPassEmail />} />
          <Route path='/reset-password' element={<UpdatePass />} />
          <Route element={<ProtectedOwnerRoutes />}>
            <Route path='/owner/dashboard' element={<OwnerDashBoard />} />
            <Route path='/owner/add-driver' element={<AddDriverForm />} />
          </Route>
          <Route element={<ProtectedDriverRoutes />}>
            <Route path='/driver/dashboard' element={<DriverDashBoard />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
