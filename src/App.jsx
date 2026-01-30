import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Products from './pages/Products'
import Stories from './pages/Stories'
import About from './pages/About'
import './App.css'

function App() {
  // 获取 base 路径，用于 GitHub Pages
  const basename = import.meta.env.BASE_URL || '/'
  
  // 禁用页面缩放
  useEffect(() => {
    // 禁用 Ctrl/Cmd + 滚轮缩放
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
      }
    }

    // 禁用 Ctrl/Cmd + +/- 缩放
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.keyCode === 187 || e.keyCode === 189)) {
        e.preventDefault()
      }
      // 禁用 Ctrl/Cmd + 0 重置缩放
      if ((e.ctrlKey || e.metaKey) && (e.key === '0' || e.keyCode === 48)) {
        e.preventDefault()
      }
    }

    // 禁用触摸缩放手势
    const handleTouchStart = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    const handleTouchMove = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])
  
  return (
    <LanguageProvider>
      <Router basename={basename}>
        <ScrollToTop />
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
