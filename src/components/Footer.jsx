import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import './Footer.css'

const Footer = () => {
  const { language } = useLanguage()
  const t = translations[language].footer

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section footer-left">
          <div className="footer-logo-container">
            <img 
              src={`${import.meta.env.BASE_URL}images/globe/logo_footer.png`} 
              alt="EuroStay Logo" 
              className="footer-logo-image"
            />
          </div>
          <p className="footer-description">{t.description}</p>
        </div>

        <div className="footer-section footer-nav">
          <h3 className="footer-title">EuroStay</h3>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link">
                {t.homepage}
              </Link>
            </li>
            <li>
              <Link to="/products" className="footer-link">
                {t.homestayGuide}
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer-link">
                {t.aboutUs}
              </Link>
            </li>
            <li>
              <a href="#" className="footer-link">
                Q&A
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section footer-contact">
          <h3 className="footer-title">{t.coCreation}</h3>
          <div className="footer-contact-item">
            <span className="footer-icon">✉️</span>
            <a href="mailto:EuroStay@163.com" className="footer-contact-link">
              EuroStay@163.com
            </a>
          </div>
          <div className="footer-contact-item">
            <span className="footer-icon">💬</span>
            <span className="footer-contact-text">{t.wechatId}: EuroStay</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="qr-codes">
          <div className="qr-code-item">
            <div className="qr-code-placeholder">
              <span>{t.xiaohongshu}</span>
            </div>
            <p className="qr-code-label">{t.xiaohongshu}</p>
          </div>
          <div className="qr-code-item">
            <div className="qr-code-placeholder">
              <span>{t.wechatOfficial}</span>
            </div>
            <p className="qr-code-label">{t.wechatOfficial}</p>
          </div>
          <div className="qr-code-item">
            <div className="qr-code-placeholder">
              <span>{t.wechatMini}</span>
            </div>
            <p className="qr-code-label">{t.wechatMini}</p>
          </div>
          <div className="qr-code-item">
            <div className="qr-code-placeholder">
              <span>{t.wechat}</span>
            </div>
            <p className="qr-code-label">{t.wechat}</p>
          </div>
          <div className="qr-code-item">
            <div className="qr-code-placeholder">
              <span>{t.douyin}</span>
            </div>
            <p className="qr-code-label">{t.douyin}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
