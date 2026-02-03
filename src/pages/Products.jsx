import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import FadeSection from '../components/FadeSection'
import './Products.css'

const Products = () => {
  const location = useLocation()
  const { language } = useLanguage()
  const t = translations[language].products
  const [expandedQA, setExpandedQA] = useState({})
  const [showCopyToast, setShowCopyToast] = useState(false)

  const handleCopyWeChat = () => {
    navigator.clipboard.writeText('EuroStay').then(() => {
      setShowCopyToast(true)
      setTimeout(() => setShowCopyToast(false), 3000)
    })
  }

  useEffect(() => {
    if (location.hash === '#qa-section') {
      const el = document.getElementById('qa-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.pathname, location.hash])

  const toggleQA = (qaNumber) => {
    setExpandedQA(prev => ({
      ...prev,
      [qaNumber]: !prev[qaNumber]
    }))
  }

  return (
    <div className="products-page">
      <FadeSection as="section" className="tips-section guidelines-section">
        <div className="container">
          <div className="page-hero-title-wrapper">
            <div className="page-hero-title-line">
              <h2 className="page-hero-title-main">{t.tipsTitle}</h2>
              <span className="page-hero-title-star" aria-hidden="true">★</span>
            </div>
          </div>
          <div className="guidelines-list">
            <div className="guideline-card">
              <span className="guideline-card-star guideline-card-star-tl" aria-hidden="true">★</span>
              <span className="guideline-card-star guideline-card-star-br" aria-hidden="true">★</span>
              <h3 className="guideline-title">{t.guideline1Title}</h3>
              <p className="guideline-desc">{t.guideline1DescPart1}<span className="guideline-highlight">{t.guideline1DescHighlight}</span>{t.guideline1DescPart2}</p>
            </div>
            <div className="guideline-card">
              <span className="guideline-card-star guideline-card-star-tl" aria-hidden="true">★</span>
              <span className="guideline-card-star guideline-card-star-br" aria-hidden="true">★</span>
              <h3 className="guideline-title">{t.guideline2Title}</h3>
              <p className="guideline-desc">{t.guideline2DescPart1}<span className="guideline-highlight">{t.guideline2DescHighlight}</span>{t.guideline2DescPart2}</p>
            </div>
            <div className="guideline-card">
              <span className="guideline-card-star guideline-card-star-tl" aria-hidden="true">★</span>
              <span className="guideline-card-star guideline-card-star-br" aria-hidden="true">★</span>
              <h3 className="guideline-title">{t.guideline3Title}</h3>
              <p className="guideline-desc">{t.guideline3DescPart1}<span className="guideline-highlight">{t.guideline3DescHighlight}</span>{t.guideline3DescPart2}</p>
            </div>
            <div className="guideline-card">
              <span className="guideline-card-star guideline-card-star-tl" aria-hidden="true">★</span>
              <span className="guideline-card-star guideline-card-star-br" aria-hidden="true">★</span>
              <h3 className="guideline-title">{t.guideline4Title}</h3>
              <p className="guideline-desc">{t.guideline4Desc}</p>
            </div>
            <div className="guideline-card">
              <span className="guideline-card-star guideline-card-star-tl" aria-hidden="true">★</span>
              <span className="guideline-card-star guideline-card-star-br" aria-hidden="true">★</span>
              <h3 className="guideline-title">{t.guideline5Title}</h3>
              <p className="guideline-desc">{t.guideline5Desc}</p>
            </div>
            <div className="guideline-card">
              <span className="guideline-card-star guideline-card-star-tl" aria-hidden="true">★</span>
              <span className="guideline-card-star guideline-card-star-br" aria-hidden="true">★</span>
              <h3 className="guideline-title">{t.guideline6Title}</h3>
              <p className="guideline-desc">{t.guideline6Desc}</p>
            </div>
          </div>
        </div>
      </FadeSection>

      <FadeSection as="section" className="guide-section">
        <div className="container">
          <div className="page-hero-title-wrapper">
            <div className="page-hero-title-line">
              <h2 className="page-hero-title-main">{t.guideTitle}</h2>
              <span className="page-hero-title-star" aria-hidden="true">★</span>
            </div>
          </div>
          <p className="guide-subtitle">{t.guideSubtitle}</p>
          <div className="guide-steps-grid">
            <div className="guide-step-card">
              <div className="step-info">
                <div className="step-title-row">
                  <div className="step-number-badge">1</div>
                  <h3>{t.step1Title}</h3>
                </div>
                <p>{t.step1Desc}</p>
              </div>
              <div className="step-image-wrap">
                <img src={`${import.meta.env.BASE_URL}images/product/guide/1.png`} alt={t.step1Title} />
              </div>
            </div>
            <div className="guide-step-card">
              <div className="step-info">
                <div className="step-title-row">
                  <div className="step-number-badge alternate">2</div>
                  <h3>{t.step2Title}</h3>
                </div>
                <p>{t.step2Desc}</p>
              </div>
              <div className="step-image-wrap">
                <img src={`${import.meta.env.BASE_URL}images/product/guide/2.png`} alt={t.step2Title} />
              </div>
            </div>
            <div className="guide-step-card">
              <div className="step-info">
                <div className="step-title-row">
                  <div className="step-number-badge">3</div>
                  <h3>{t.step3Title}</h3>
                </div>
                <p>{t.step3Desc}</p>
              </div>
              <div className="step-image-wrap">
                <img src={`${import.meta.env.BASE_URL}images/product/guide/3.png`} alt={t.step3Title} />
              </div>
            </div>
            <div className="guide-step-card">
              <div className="step-info">
                <div className="step-title-row">
                  <div className="step-number-badge alternate">4</div>
                  <h3>{t.step4Title}</h3>
                </div>
                <p>{t.step4Desc}</p>
              </div>
              <div className="step-image-wrap">
                <img src={`${import.meta.env.BASE_URL}images/product/guide/4.png`} alt={t.step4Title} />
              </div>
            </div>
          </div>
        </div>
      </FadeSection>

      <FadeSection as="section" className="membership-section">
        <div className="container">
          <div className="page-hero-title-wrapper">
            <div className="page-hero-title-line">
              <h2 className="page-hero-title-main">{t.membershipTitle}</h2>
              <span className="page-hero-title-star" aria-hidden="true">★</span>
            </div>
          </div>

          <div className="membership-grid">
            {/* Basic Column */}
            <div className="membership-column basic">
              <span className="membership-basic-crown">👑</span>
              <div className="membership-header">
                <div className="membership-type-title">
                  <h3>{t.membershipBasicTitle}</h3>
                  <span className="membership-type-subtitle">{t.membershipBasicSubtitle}</span>
                </div>
              </div>
              <ul className="membership-list">
                <li>
                  <span className="check-icon">✓</span>
                  <span>{t.membershipBasicItem1}</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span>{t.membershipBasicItem2}</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span>{t.membershipBasicItem3}</span>
                </li>
              </ul>
            </div>

            {/* Pro Column */}
            <div className="membership-column pro">
              <span className="membership-crown">👑</span>
              <div className="membership-header">
                <div className="membership-type-title">
                  <h3>{t.membershipProTitle}</h3>
                </div>
              </div>
              <div className="membership-pro-items">
                <div className="membership-pro-item">
                  <h4>{t.membershipProItem1Title}</h4>
                  <p>{t.membershipProItem1Desc}</p>
                </div>
                <div className="membership-pro-item">
                  <h4>{t.membershipProItem2Title}</h4>
                  <p>{t.membershipProItem2Desc}</p>
                </div>
                <div className="membership-pro-item">
                  <h4>{t.membershipProItem3Title}</h4>
                  <p>{t.membershipProItem3Desc}</p>
                </div>
                <div className="membership-pro-item">
                  <h4>{t.membershipProItem4Title}</h4>
                  <p>{t.membershipProItem4Desc}</p>
                </div>
                <div className="membership-pro-item">
                  <h4>{t.membershipProItem5Title}</h4>
                  <p>{t.membershipProItem5Desc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="membership-referral">
            <div className="referral-box">
              <h3><span className="gift-emoji">🎁</span> {t.membershipReferralTitle.replace('🎁 ', '')}</h3>
              <p className="referral-highlight">{t.membershipReferralDesc}</p>
              <Link to="/" className="membership-download-btn">
                {t.membershipDownloadBtn}
              </Link>
            </div>
          </div>
        </div>
      </FadeSection>

      <FadeSection as="section" className="experience-section">
        <div className="container">
          <div className="page-hero-title-wrapper">
            <div className="page-hero-title-line">
              <h2 className="page-hero-title-main">{t.experienceTitle}</h2>
              <span className="page-hero-title-star" aria-hidden="true">★</span>
            </div>
          </div>
          <p className="experience-hero-desc">{t.experienceHeroDesc}</p>

          <div className="experience-grid">
            <div className="experience-card">
              <div className="experience-icon">📱</div>
              <h3>{t.experienceFeature1Title}</h3>
              <p>{t.experienceFeature1Desc}</p>
            </div>

            <div className="experience-card">
              <div className="experience-icon">🤖</div>
              <h3>{t.experienceFeature2Title}</h3>
              <p>{t.experienceFeature2Desc}</p>
            </div>

            <div className="experience-card">
              <div className="experience-icon">🧪</div>
              <h3>{t.experienceFeature3Title}</h3>
              <p>{t.experienceFeature3Desc}</p>
            </div>
          </div>

          <div className="experience-cta-simple">
            <h3>{t.experienceCtaTitle}</h3>
            <p>{t.experienceCtaDesc}</p>
            <Link to="/" className="cta-btn-simple">
              {t.experienceCtaBtn}
            </Link>
          </div>
        </div>
      </FadeSection>

      <FadeSection as="section" id="qa-section" className="qa-section">
        <div className="container">
          <div className="page-hero-title-wrapper">
            <div className="page-hero-title-line">
              <h2 className="page-hero-title-main">{t.qaTitle}</h2>
              <span className="page-hero-title-star" aria-hidden="true">★</span>
            </div>
          </div>
          <div className="qa-list">
            <div className={`qa-item qa-item-prohibited ${expandedQA['prohibited'] ? 'expanded' : ''}`}>
              <div className="qa-question" onClick={() => setExpandedQA(prev => ({ ...prev, prohibited: !prev.prohibited }))}>
                <h3>{t.qaProhibitedTitle}</h3>
                <span className={`qa-toggle ${expandedQA['prohibited'] ? 'expanded' : ''}`}>▼</span>
              </div>
              <div className={`qa-answer ${expandedQA['prohibited'] ? 'expanded' : ''}`}>
                <div
                  className="qa-answer-content"
                  style={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{ __html: t.qaProhibitedContent }}
                />
              </div>
            </div>
            <div className={`qa-item ${expandedQA[1] ? 'expanded' : ''}`}>
              <div className="qa-question" onClick={() => toggleQA(1)}>
                <h3>{t.qa1Question}</h3>
                <span className={`qa-toggle ${expandedQA[1] ? 'expanded' : ''}`}>▼</span>
              </div>
              <div className={`qa-answer ${expandedQA[1] ? 'expanded' : ''}`}>
                <p>{t.qa1Answer}</p>
              </div>
            </div>
            <div className={`qa-item ${expandedQA[2] ? 'expanded' : ''}`}>
              <div className="qa-question" onClick={() => toggleQA(2)}>
                <h3>{t.qa2Question}</h3>
                <span className={`qa-toggle ${expandedQA[2] ? 'expanded' : ''}`}>▼</span>
              </div>
              <div className={`qa-answer ${expandedQA[2] ? 'expanded' : ''}`}>
                <p>{t.qa2Answer}</p>
              </div>
            </div>
            <div className={`qa-item ${expandedQA[3] ? 'expanded' : ''}`}>
              <div className="qa-question" onClick={() => toggleQA(3)}>
                <h3>{t.qa3Question}</h3>
                <span className={`qa-toggle ${expandedQA[3] ? 'expanded' : ''}`}>▼</span>
              </div>
              <div className={`qa-answer ${expandedQA[3] ? 'expanded' : ''}`}>
                <p>{t.qa3Answer}</p>
              </div>
            </div>
            <div className={`qa-item ${expandedQA[4] ? 'expanded' : ''}`}>
              <div className="qa-question" onClick={() => toggleQA(4)}>
                <h3>{t.qa4Question}</h3>
                <span className={`qa-toggle ${expandedQA[4] ? 'expanded' : ''}`}>▼</span>
              </div>
              <div className={`qa-answer ${expandedQA[4] ? 'expanded' : ''}`}>
                <p>{t.qa4Answer}</p>
              </div>
            </div>
          </div>
          <div className="qa-support-footer">
            <p>{t.qaSupportPrompt}</p>
            <button className="qa-contact-btn" onClick={handleCopyWeChat}>
              <span className="wechat-icon">💬</span>
              {t.qaContactBtn}
            </button>
          </div>
        </div>

        {showCopyToast && (
          <div className="copy-toast">
            <p>{t.qaCopySuccess}</p>
          </div>
        )}
      </FadeSection>
    </div>
  )
}

export default Products
