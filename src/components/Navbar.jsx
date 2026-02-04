import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import './Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const navRefs = useRef({})
  const t = translations[language]

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isMenuOpen])

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/products', label: t.nav.products },
    { path: '/stories', label: t.nav.stories },
    { path: '/about', label: t.nav.about },
  ]

  const [hoverStyle, setHoverStyle] = useState(null)
  const [expandedMobileItem, setExpandedMobileItem] = useState(null)

  const isActive = (path) => location.pathname === path

  const toggleMobileSubmenu = (path, e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setExpandedMobileItem(expandedMobileItem === path ? null : path);
    }
  };

  useEffect(() => {
    // Exact match for the indicator position
    const activeItem = navItems.find(item => item.path === location.pathname)
    if (activeItem && navRefs.current[activeItem.path]) {
      const el = navRefs.current[activeItem.path]
      setIndicatorStyle({
        left: el.offsetLeft + (el.offsetWidth - 40) / 2, // Center a 40px line
        width: 40,
        opacity: 1
      })
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }))
    }
  }, [location.pathname, language])

  const currentIndicatorStyle = hoverStyle || indicatorStyle;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={`${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/images/globe/icon.png`} alt="EuroStay Logo" className="navbar-logo-img" decoding="async" />
        </Link>
        <button
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <div
            className="navbar-sliding-indicator"
            style={{
              left: `${currentIndicatorStyle.left}px`,
              width: `${currentIndicatorStyle.width}px`,
              opacity: currentIndicatorStyle.opacity
            }}
          />
          {navItems.map((item) => (
            <li
              key={item.path}
              ref={el => navRefs.current[item.path] = el}
              className={`
                ${(item.path === '/' || item.path === '/about' || item.path === '/stories' || item.path === '/products') ? 'navbar-item-with-dropdown' : ''}
                ${expandedMobileItem === item.path ? 'mobile-expanded' : ''}
              `}
              onMouseEnter={() => {
                const el = navRefs.current[item.path];
                if (el) {
                  setHoverStyle({
                    left: el.offsetLeft + (el.offsetWidth - 40) / 2,
                    width: 40,
                    opacity: 1
                  });
                }
              }}
              onMouseLeave={() => setHoverStyle(null)}
            >
              <Link
                to={item.path}
                className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={(e) => {
                  if (item.path === '/' || item.path === '/about' || item.path === '/stories' || item.path === '/products') {
                    toggleMobileSubmenu(item.path, e);
                  } else {
                    setIsMenuOpen(false);
                  }
                }}
              >
                {item.label}
              </Link>
              {item.path === '/' && (
                <ul className={`navbar-dropdown ${expandedMobileItem === '/' ? 'show' : ''}`}>
                  <li>
                    <Link
                      to="/"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/') {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          // 从其他页面跳转到首页顶部
                          e.preventDefault();
                          navigate('/');
                          setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }, 100);
                        }
                      }}
                    >
                      {t.products.guideTitle}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#home-features"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/') {
                          e.preventDefault();
                          document.getElementById('home-features')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          e.preventDefault();
                          navigate('/');
                          setTimeout(() => {
                            document.getElementById('home-features')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }
                      }}
                    >
                      {language === 'zh' ? '为什么选择我们' : 'Why Us'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#home-vision"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/') {
                          e.preventDefault();
                          document.getElementById('home-vision')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          e.preventDefault();
                          navigate('/');
                          setTimeout(() => {
                            document.getElementById('home-vision')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }
                      }}
                    >
                      {t.home.visionTitlePrimary}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#home-reviews"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/') {
                          e.preventDefault();
                          document.getElementById('home-reviews')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          e.preventDefault();
                          navigate('/');
                          setTimeout(() => {
                            document.getElementById('home-reviews')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }
                      }}
                    >
                      {language === 'zh' ? '友友的评价' : 'User Reviews'}
                    </Link>
                  </li>
                </ul>
              )}
              {item.path === '/products' && (
                <ul className={`navbar-dropdown ${expandedMobileItem === '/products' ? 'show' : ''}`}>
                  <li>
                    <Link
                      to="/products#products-tips"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/products') {
                          e.preventDefault();
                          document.getElementById('products-tips')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          // 从其他页面跳转时，先跳转到产品页顶部
                          e.preventDefault();
                          navigate('/products');
                          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                        }
                      }}
                    >
                      {t.products.tipsTitle}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products#products-guide"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/products') {
                          e.preventDefault();
                          document.getElementById('products-guide')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {t.products.guideTitle}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products#products-membership"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/products') {
                          e.preventDefault();
                          document.getElementById('products-membership')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {t.products.membershipTitle}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products#products-experience"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/products') {
                          e.preventDefault();
                          document.getElementById('products-experience')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {t.products.experienceTitle}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products#qa-section"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/products') {
                          e.preventDefault();
                          document.getElementById('qa-section')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {t.products.qaTitle}
                    </Link>
                  </li>
                </ul>
              )}
              {item.path === '/stories' && (
                <ul className={`navbar-dropdown ${expandedMobileItem === '/stories' ? 'show' : ''}`}>
                  <li>
                    <Link
                      to="/stories#stories-map"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/stories') {
                          e.preventDefault();
                          document.getElementById('stories-map')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          // 从其他页面跳转时，先跳转到故事页顶部
                          e.preventDefault();
                          navigate('/stories');
                          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                        }
                      }}
                    >
                      {t.stories.storiesTagline}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/stories#stories-history"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/stories') {
                          e.preventDefault();
                          document.getElementById('stories-history')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {t.stories.activityHistoryTitle}
                    </Link>
                  </li>
                </ul>
              )}
              {item.path === '/about' && (
                <ul className={`navbar-dropdown ${expandedMobileItem === '/about' ? 'show' : ''}`}>
                  <li>
                    <Link
                      to="/about#about-brand-story"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/about') {
                          e.preventDefault();
                          document.getElementById('about-brand-story')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          // 从其他页面跳转时，先跳转到关于我们页顶部
                          e.preventDefault();
                          navigate('/about');
                          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                        }
                      }}
                    >
                      {t.about.storyTitle}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about#about-values"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/about') {
                          e.preventDefault();
                          document.getElementById('about-values')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {t.about.valuesTitle}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about#about-team"
                      onClick={(e) => {
                        setIsMenuOpen(false);
                        if (location.pathname === '/about') {
                          e.preventDefault();
                          document.getElementById('about-team')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {t.about.teamTitle}
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          ))}
          <li>
            <button
              className="navbar-tip-btn"
              onClick={() => {
                setIsMenuOpen(false)
                if (location.pathname === '/about') {
                  const footer = document.getElementById('footer-likes')
                  if (footer) {
                    footer.scrollIntoView({ behavior: 'smooth' })
                  }
                } else {
                  navigate('/about#footer-likes')
                }
              }}
              aria-label="Tip"
            >
              {t.nav.tip}
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
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150)
                }
              }}
              aria-label="Download"
            >
              {t.nav.download}
            </button>
          </li>
          <li>
            <button
              className="language-toggle"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
