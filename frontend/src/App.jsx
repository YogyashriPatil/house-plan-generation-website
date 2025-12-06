import React from 'react'
import AnimatedBackground from './components/AnimatedBg'
import ThreeJSAnimatedBackground from './components/AnimatedBg'

const App = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="flex items-center justify-center h-full text-white text-3xl">
        Your Website Content Here
      </div>
    </div>
  )
}

export default App