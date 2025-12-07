import React from 'react'
import AnimatedBG from '../components/AnimatedBg'
import { Logo } from '../components/Logo'
import { Footer } from '../components/Footer'
import { Button } from '../components/Button'
import { Link } from "react-router-dom";
export function LandingPage() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Background Animation */}
      <AnimatedBG />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center px-4 pt-32">

        {/* Logo */}
        <Logo />

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold mt-10 leading-tight">
          Design Your <span className="bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text animate-pulse">Dream Home</span> with AI
        </h1>

        {/* Tagline */}
        <p className="mt-6 text-lg md:text-xl max-w-2xl opacity-80">
          Create intelligent, realistic, and inspiring house plans in just a few seconds.
        </p>

        {/* CTA Button */}
        <div className="mt-10">
          <Link to="/login">
            <Button textValue="Get Started"/>
          </Link>
        </div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>

    </div>
  )
}
