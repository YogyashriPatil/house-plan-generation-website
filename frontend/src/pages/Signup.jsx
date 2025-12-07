import AnimatedBG from "../components/AnimatedBg"
import { Logo } from "../components/Logo"
import { InputBox } from '../components/InputBox'
import { Button } from '../components/Button'
import { Heading } from '../components/Heading'
import { Link } from "react-router-dom"

export const Signup = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <AnimatedBG />

      {/* Logo - Center Top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <Logo />
      </div>

      {/* Signup Container */}
      <div className="absolute bg-white/10 backdrop-blur-md border border-white/20 
        rounded-2xl shadow-2xl mt-14 md:mt-19 p-5 w-[650px] text-white 
        flex flex-col items-center gap-6 opacity-95">

        <Heading textValue="Create Your Account" />

        {/* First + Last Name */}
        <div className="grid grid-cols-2 gap-4 w-full">
            <InputBox placeholder="Full Name" />
            <InputBox placeholder="Email Address" type="email" />
        </div>

        {/* District (Company in screenshot) */}
        <div className="grid grid-cols-2 gap-4 w-full">
            <InputBox placeholder="State" />
            <InputBox placeholder="District" />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <InputBox placeholder="Password" type="password" />
          <InputBox placeholder="Re-Password" type="password" />
        </div>
        <Link to="/login">
            <Button textValue="Sign Me Up"/>
        </Link>
        <p className="text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/Login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
