import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import './Products.css'

const Products = () => {
  const { language } = useLanguage()
  const t = translations[language].products
  const [expandedSteps, setExpandedSteps] = useState({})
  const [expandedQA, setExpandedQA] = useState({})

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
      <section className="tips-section">
        <div className="container">
          <h2 className="section-title">{t.tipsTitle}</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h4>{t.tip1Title}</h4>
              <p>{t.tip1Desc}</p>
            </div>
            <div className="tip-card">
              <h4>{t.tip2Title}</h4>
              <p>{t.tip2Desc}</p>
            </div>
            <div className="tip-card">
              <h4>{t.tip3Title}</h4>
              <p>{t.tip3Desc}</p>
            </div>
            <div className="tip-card">
              <h4>{t.tip4Title}</h4>
              <p>{t.tip4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="guide-section">
        <div className="container">
          <h2 className="section-title">{t.guideTitle}</h2>
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
                  <div className="image-placeholder">
                    <span>{language === 'zh' ? '步骤1图片' : 'Step 1 Image'}</span>
                  </div>
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
                  <div className="image-placeholder">
                    <span>{language === 'zh' ? '步骤2图片' : 'Step 2 Image'}</span>
                  </div>
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
                  <div className="image-placeholder">
                    <span>{language === 'zh' ? '步骤3图片' : 'Step 3 Image'}</span>
                  </div>
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
                  <div className="image-placeholder">
                    <span>{language === 'zh' ? '步骤4图片' : 'Step 4 Image'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`guide-step ${expandedSteps[5] ? 'expanded' : ''}`}>
              <div className="step-header" onClick={() => toggleStep(5)}>
                <div className="step-number purple">5</div>
                <div className="step-content">
                  <h3>{t.step5Title}</h3>
                </div>
                <div className="step-toggle">
                  <span className={`toggle-icon ${expandedSteps[5] ? 'expanded' : ''}`}>▼</span>
                </div>
              </div>
              <div className={`step-details ${expandedSteps[5] ? 'expanded' : ''}`}>
                <div className="step-description">
                  <p>{t.step5Desc}</p>
                </div>
                <div className="step-image">
                  <div className="image-placeholder">
                    <span>{language === 'zh' ? '步骤5图片' : 'Step 5 Image'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`guide-step ${expandedSteps[6] ? 'expanded' : ''}`}>
              <div className="step-header" onClick={() => toggleStep(6)}>
                <div className="step-number yellow">6</div>
                <div className="step-content">
                  <h3>{t.step6Title}</h3>
                </div>
                <div className="step-toggle">
                  <span className={`toggle-icon ${expandedSteps[6] ? 'expanded' : ''}`}>▼</span>
                </div>
              </div>
              <div className={`step-details ${expandedSteps[6] ? 'expanded' : ''}`}>
                <div className="step-description">
                  <p>{t.step6Desc}</p>
                </div>
                <div className="step-image">
                  <div className="image-placeholder">
                    <span>{language === 'zh' ? '步骤6图片' : 'Step 6 Image'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="qa-section">
        <div className="container">
          <h2 className="section-title">{t.qaTitle}</h2>
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
      </section>
    </div>
  )
}

export default Products
