import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = translations[language]

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/products', label: t.nav.products },
    { path: '/stories', label: t.nav.stories },
    { path: '/about', label: t.nav.about },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={`${import.meta.env.BASE_URL}images/globe/logo.png`} alt="EuroStay Logo" className="navbar-logo-img" />
        </Link>
        <button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="language-toggle"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>
          </li>
          <li>
            <button
              className="download-button"
              onClick={() => {
                setIsMenuOpen(false)
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                } else {
                  navigate('/')
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }, 100)
                }
              }}
              aria-label="Download"
            >
              {t.nav.download}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
