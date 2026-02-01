import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import FadeSection from '../components/FadeSection'
import './Products.css'

const Products = () => {
  const location = useLocation()
  const { language } = useLanguage()
  const t = translations[language].products
  const [expandedSteps, setExpandedSteps] = useState({})
  const [expandedQA, setExpandedQA] = useState({})

  useEffect(() => {
    if (location.hash === '#qa-section') {
      const el = document.getElementById('qa-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [location.pathname, location.hash])

  const toggleStep = (stepNumber) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }))
  }

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
          <div className="guide-steps">
            <div className={`guide-step ${expandedSteps[1] ? 'expanded' : ''}`}>
              <div className="step-header" onClick={() => toggleStep(1)}>
                <div className="step-number purple">1</div>
                <div className="step-content">
                  <h3>{t.step1Title}</h3>
                </div>
                <div className="step-toggle">
                  <span className={`toggle-icon ${expandedSteps[1] ? 'expanded' : ''}`}>▼</span>
                </div>
              </div>
              <div className={`step-details ${expandedSteps[1] ? 'expanded' : ''}`}>
                <div className="step-description">
                  <p>{t.step1Desc}</p>
                </div>
                <div className="step-image">
                  <img src="/images/home/guide/1.jpg" alt={t.step1Title} />
                  <img src="/images/home/guide/2.jpg" alt={t.step1Title} />
                  <img src="/images/home/guide/1.jpg" alt={t.step1Title} />
                </div>
              </div>
            </div>
            <div className={`guide-step ${expandedSteps[2] ? 'expanded' : ''}`}>
              <div className="step-header" onClick={() => toggleStep(2)}>
                <div className="step-number yellow">2</div>
                <div className="step-content">
                  <h3>{t.step2Title}</h3>
                </div>
                <div className="step-toggle">
                  <span className={`toggle-icon ${expandedSteps[2] ? 'expanded' : ''}`}>▼</span>
                </div>
              </div>
              <div className={`step-details ${expandedSteps[2] ? 'expanded' : ''}`}>
                <div className="step-description">
                  <p>{t.step2Desc}</p>
                </div>
                <div className="step-image">
                  <img src="/images/home/guide/2.jpg" alt={t.step2Title} />
                  <img src="/images/home/guide/1.jpg" alt={t.step2Title} />
                  <img src="/images/home/guide/2.jpg" alt={t.step2Title} />
                </div>
              </div>
            </div>
            <div className={`guide-step ${expandedSteps[3] ? 'expanded' : ''}`}>
              <div className="step-header" onClick={() => toggleStep(3)}>
                <div className="step-number purple">3</div>
                <div className="step-content">
                  <h3>{t.step3Title}</h3>
                </div>
                <div className="step-toggle">
                  <span className={`toggle-icon ${expandedSteps[3] ? 'expanded' : ''}`}>▼</span>
                </div>
              </div>
              <div className={`step-details ${expandedSteps[3] ? 'expanded' : ''}`}>
                <div className="step-description">
                  <p>{t.step3Desc}</p>
                </div>
                <div className="step-image">
                  <img src="/images/home/guide/1.jpg" alt={t.step3Title} />
                  <img src="/images/home/guide/2.jpg" alt={t.step3Title} />
                  <img src="/images/home/guide/1.jpg" alt={t.step3Title} />
                </div>
              </div>
            </div>
            <div className={`guide-step ${expandedSteps[4] ? 'expanded' : ''}`}>
              <div className="step-header" onClick={() => toggleStep(4)}>
                <div className="step-number yellow">4</div>
                <div className="step-content">
                  <h3>{t.step4Title}</h3>
                </div>
                <div className="step-toggle">
                  <span className={`toggle-icon ${expandedSteps[4] ? 'expanded' : ''}`}>▼</span>
                </div>
              </div>
              <div className={`step-details ${expandedSteps[4] ? 'expanded' : ''}`}>
                <div className="step-description">
                  <p>{t.step4Desc}</p>
                </div>
                <div className="step-image">
                  <img src="/images/home/guide/2.jpg" alt={t.step4Title} />
                  <img src="/images/home/guide/1.jpg" alt={t.step4Title} />
                  <img src="/images/home/guide/2.jpg" alt={t.step4Title} />
                </div>
              </div>
            </div>
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
        </div>
      </FadeSection>
    </div>
  )
}

export default Products
