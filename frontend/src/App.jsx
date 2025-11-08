import React from 'react'
import Home from './pages/Home'
import { Route, Router, Routes } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element{<Home />}/>
      </Routes>
      
    </div>
  )
}

export default App