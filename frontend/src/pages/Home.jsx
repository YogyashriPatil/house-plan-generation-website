import React from 'react'
import Topnavbar from '../components/Topnavbar'
import AnimatedBG from '../components/AnimatedBg'
import { Logo } from '../components/Logo'
import { TopSidebar } from '../components/TopSidebar'

export const Home = () => {
  return (
    <div>
        <AnimatedBG />
        <div className='flex '>
          <div className=''>
            <Logo />
          </div>
          <div className='ml-90'>
            <TopSidebar />
          </div>
        </div>
    </div>
  )
}

export default Home