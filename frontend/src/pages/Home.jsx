import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AnimatedBG from '../components/AnimatedBg'
import { Logo } from '../components/Logo'

export const Home = () => {
  return (
    <div>
        <AnimatedBG />
        <Logo />
    </div>
  )
}

export default Home