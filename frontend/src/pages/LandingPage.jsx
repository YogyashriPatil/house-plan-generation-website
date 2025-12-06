import React from 'react'
import AnimatedBG from '../components/AnimatedBg'
import { Logo } from '../components/Logo'
import { Footer } from '../components/Footer'
import { Button } from '../components/Button'

export function LandingPage(){
  return (
    <div className='text-white'>
      <AnimatedBG />        
      <Logo />
        <div className='bg-center md:pl-60 md:pr-60 pt-20 '>
          <h1 className='text-center'>Design Your Dream Home <span>with AI</span></h1>

          <br />
          <br />
          <p className='text-center'>Create intelligent, realistic, and inspiring house plans in just a few second.</p>
        </div>
        <Button textValue={"Get Started"}/>
        <Footer />       
    </div>
  )
}
