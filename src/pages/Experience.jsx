import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import FadeSection from '../components/FadeSection'
import './Experience.css'

const Experience = () => {
    const { language } = useLanguage()
    const t = translations[language].experience

    return (
        <div className="experience-page">
            <section className="experience-hero">
                <div className="container">
                    <FadeSection>
                        <div className="page-hero-title-wrapper">
                            <p className="page-hero-title-slogan">{t.title}</p>
                            <div className="page-hero-title-line">
                                <h1 className="page-hero-title-main">{t.heroTitle}</h1>
                                <span className="page-hero-title-star">★</span>
                            </div>
                        </div>
                        <p className="experience-hero-desc">{t.heroDesc}</p>
                    </FadeSection>
                </div>
            </section>

            <section className="experience-features">
                <div className="container">
                    <div className="experience-grid">
                        <FadeSection className="experience-card">
                            <div className="experience-icon">📱</div>
                            <h3>{t.feature1Title}</h3>
                            <p>{t.feature1Desc}</p>
                        </FadeSection>

                        <FadeSection className="experience-card">
                            <div className="experience-icon">🤖</div>
                            <h3>{t.feature2Title}</h3>
                            <p>{t.feature2Desc}</p>
                        </FadeSection>

                        <FadeSection className="experience-card">
                            <div className="experience-icon">🧪</div>
                            <h3>{t.feature3Title}</h3>
                            <p>{t.feature3Desc}</p>
                        </FadeSection>
                    </div>
                </div>
            </section>

            <FadeSection as="section" className="experience-cta">
                <div className="container">
                    <div className="cta-box">
                        <h2>{t.ctaTitle}</h2>
                        <p>{t.ctaDesc}</p>
                        <button className="cta-btn">{t.ctaBtn}</button>
                    </div>
                </div>
            </FadeSection>
        </div>
    )
}

export default Experience
