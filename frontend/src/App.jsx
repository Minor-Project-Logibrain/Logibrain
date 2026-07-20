
import './App.css'
import Login from './components/Login'
import Otp from './components/Otp'
import Signup from './components/SignUp'
import Home from './pages/Home'
import { Routes, Route, BrowserRouter } from "react-router-dom"
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/otp' element={<Otp />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
