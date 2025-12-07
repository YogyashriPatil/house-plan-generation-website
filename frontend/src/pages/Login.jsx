import React from 'react'
import { InputBox } from '../components/InputBox'
import { Button } from '../components/Button'
import AnimatedBG from '../components/AnimatedBg'
import { Heading } from '../components/Heading'
import { Link } from 'react-router-dom'
const Login = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <AnimatedBG />

      <div className="absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-8 w-[350px] text-white flex flex-col items-center gap-6 opacity-80">
        
        <Heading textValue="Login" />

        <div className="w-full flex flex-col gap-4">
          <InputBox placeholder="Enter your name" />
          <InputBox placeholder="Enter your password" type="password" />
        </div>

        <Link to="/Home">
          <Button textValue="Login" className="w-full transition-all duration-300 hover:scale-105 hover:bg-blue-600" />
        </Link>
        <p className="text-sm text-gray-300 mt-2">
          Don't have an account? 
          <Link to="/Signup">
            <span className="text-blue-400 cursor-pointer hover:underline">Sign Up</span>
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
