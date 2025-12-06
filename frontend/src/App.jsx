import React from 'react'
import {BrowserRouter, Routes, Route, Link, useNavigate, Outlet} from "react-router-dom"
import AnimatedBG from './components/AnimatedBg'
import { LandingPage } from './pages/LandingPage'

function App ()
{
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
  )
}
export default App