import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import './Footer.css'

const Footer = () => {
  const { language } = useLanguage()
  const [showDonateModal, setShowDonateModal] = useState(false)
  const t = translations[language]
  const nav = t.nav
  const footer = t.footer

  const handleDonateClick = () => {
    setShowDonateModal(true)
  }

  const closeDonateModal = () => {
    setShowDonateModal(false)
  }

  return (
    <footer id="site-footer" className="footer">
      <div className="footer-top">
        <div className="footer-section footer-left">
          <div className="footer-logo-container">
            <img
              src={`${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/images/footage/0.png`}
              alt="EuroStay Logo"
              className="footer-logo-image"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </div>
          <p className="footer-description">{footer.description}</p>
        </div>

        <div className="footer-section footer-nav">
          <h3 className="footer-title">EuroStay</h3>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link">
                {nav.home}
              </Link>
            </li>
            <li>
              <Link to="/products" className="footer-link">
                {nav.products}
              </Link>
            </li>
            <li>
              <Link to="/stories" className="footer-link">
                {nav.stories}
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer-link">
                {nav.about}
              </Link>
            </li>
            <li>
              <Link to="/products#qa-section" className="footer-link">
                Q&A
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section footer-contact">
          <h3 className="footer-title">{footer.coCreation}</h3>
          <div className="footer-contact-item">
            <span className="footer-icon">✉️</span>
            <a href="mailto:EuroStay@163.com" className="footer-contact-link">
              EuroStay@163.com
            </a>
          </div>
          <div className="footer-contact-item">
            <span className="footer-icon">💬</span>
            <span className="footer-contact-text">{footer.wechatId}: EuroStay</span>
          </div>
        </div>
      </div>

      <div id="footer-likes" className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="qr-codes">
            <div className="qr-code-item qr-code-item-1">
              <div className="qr-code-box">
                <span className="qr-corner-star qr-corner-star-tl" aria-hidden="true">★</span>
                <div className="qr-code-placeholder">
                  <img src={`${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/images/footage/rednote.png`} alt="" className="qr-code-image" loading="lazy" decoding="async" />
                </div>
              </div>
              <p className="qr-code-label">{footer.xiaohongshu}</p>
            </div>
            <div className="qr-code-item qr-code-item-2">
              <div className="qr-code-box">
                <span className="qr-corner-star qr-corner-star-bl" aria-hidden="true">★</span>
                <div className="qr-code-placeholder">
                  <img src={`${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/images/footage/${encodeURIComponent('公众号.png')}`} alt="" className="qr-code-image" loading="lazy" decoding="async" />
                </div>
              </div>
              <p className="qr-code-label">{footer.wechatOfficial}</p>
            </div>
            <div className="qr-code-item qr-code-item-3 qr-code-item-wechat">
              <div className="qr-code-box">
                <span className="qr-corner-star qr-corner-star-tr" aria-hidden="true">★</span>
                <div className="qr-code-placeholder">
                  <img src={`${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/images/footage/${encodeURIComponent('小助手微信号.png')}`} alt="" className="qr-code-image" loading="lazy" decoding="async" />
                </div>
              </div>
              <p className="qr-code-label">{footer.wechat}</p>
            </div>
            <div className="qr-code-item qr-code-item-4 qr-code-item-douyin">
              <div className="qr-code-box">
                <span className="qr-corner-star qr-corner-star-br" aria-hidden="true">★</span>
                <div className="qr-code-placeholder">
                  <img src={`${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/images/footage/${encodeURIComponent('抖音.png')}`} alt="" className="qr-code-image" loading="lazy" decoding="async" />
                </div>
              </div>
              <p className="qr-code-label">{footer.douyin}</p>
            </div>
          </div>
          <div className="support-section">
            <div className="support-tooltip">
              <p className="support-title">{footer.supportUs}</p>
              <p className="support-message">{footer.supportDesc}</p>
            </div>
            <div className="support-heart" onClick={handleDonateClick}>
              ❤️
            </div>
            <p className="support-label" onClick={handleDonateClick}>{t.nav.tip}</p>
          </div>
        </div>
      </div>

      {showDonateModal && (
        <div className="donate-modal-overlay" onClick={closeDonateModal}>
          <div className="donate-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="donate-modal-close" onClick={closeDonateModal}>×</button>
            <div className="donate-image-container">
              <img
                src={`${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/images/globe/icon.png`}
                alt="Donation QR Code"
                className="donate-image"
              />
            </div>
            <p className="donate-text">{footer.donateThankYou} ❤️</p>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
