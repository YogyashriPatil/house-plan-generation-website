import React from 'react'
import {BrowserRouter, Routes, Route, Link, useNavigate, Outlet} from "react-router-dom"
import AnimatedBG from './components/AnimatedBg'
import { LandingPage } from './pages/LandingPage'
import Login from './pages/Login'
import Home from './pages/Home'
import { Signup } from './pages/Signup'

function App ()
{
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/SignUp' element={<Signup />} />
        </Routes>
      </BrowserRouter>
  )
}
export default App