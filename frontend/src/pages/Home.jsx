import React from 'react'
import Topnavbar from '../components/Topnavbar'
import AnimatedBG from '../components/AnimatedBg'
import { Logo } from '../components/Logo'
import { TopSidebar } from '../components/TopSidebar'
import { Button } from '../components/Button'
import { StepsToFollow } from '../components/StepstoFollow'

export const Home = () => {
  return (
    <div>
        <AnimatedBG />
        <div className='flex '>
          <div className='top-6 m-4'>
            <Logo />
          </div>
          <div className='ml-90'>
            <TopSidebar />
          </div>
        </div>
        <div>
          <div className='text-white'>
            <StepsToFollow />
          </div>
            <Button textValue="Generate a Plan"/>
        </div>
        
    </div>
  )
}

export default Home