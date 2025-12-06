import React from 'react'
import AnimatedBG from '../components/AnimatedBg'
import { Logo } from '../components/Logo'
import { Footer } from '../components/Footer'

export function LandingPage(){
  return (
    <div>
        <Logo />

        
        <div className='bg-center md:pl-60 md:pr-60 pt-20 '>
          <h1 className='text-center'>Design Your Dream Home <span>with AI</span></h1>

          <br />
          <br />
          <p className='text-center'>Create intelligent, realistic, and inspiring house plans in just a few second.</p>
        </div>

        <Footer />       
    </div>
  )
}
