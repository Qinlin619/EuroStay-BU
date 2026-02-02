import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import FadeSection from '../components/FadeSection'
import './About.css'

const About = () => {
  const { language } = useLanguage()
  const t = translations[language].about

  return (
    <div className="about-page">
      <section className="about-hero-banner">
        <div className="banner-images-grid hero-single-image">
          <img src={`${import.meta.env.BASE_URL}images/aboutus/2.jpg`} alt="About EuroStay" className="hero-grid-img" />
        </div>
        <div className="banner-overlay">
          <div className="hero-content-box">
            <h1 className="hero-main-title">{t.storyTitle}</h1>
            <p className="hero-intro-text">{t.storyIntro}</p>
          </div>
        </div>
      </section>

      <FadeSection as="section" className="about-brand-story">
        <div className="container">
          <div className="brand-story-grid">
            <div className="brand-story-text-content">
              <div className="story-node">
                <h3>{t.whyExistTitle}</h3>
                <p>{t.whyExistDesc}</p>
              </div>
              <div className="story-node">
                <h3>{t.whatWeDoTitle}</h3>
                <p>{t.whatWeDoDesc}</p>
              </div>
              <div className="story-node">
                <h3>{t.communityTitle}</h3>
                <p>{t.communityDesc}</p>
              </div>
              <div className="story-footer">
                <p className="join-cta-text">{t.joinCta}</p>
              </div>
            </div>
            <div className="brand-story-visual">
              <img src={`${import.meta.env.BASE_URL}images/aboutus/1.jpg`} alt="EuroStay Story" className="story-featured-img" />
            </div>
          </div>
        </div>
      </FadeSection>


      <FadeSection as="section" className="values-section">
        <div className="container">
          <div className="page-hero-title-wrapper">
            <div className="page-hero-title-line">
              <h2 className="page-hero-title-main">{t.valuesTitle}</h2>
              <span className="page-hero-title-star" aria-hidden="true">★</span>
            </div>
          </div>
          <div className="values-cards">
            <div className="value-card-modern">
              <div className="value-icon-circle purple-light">
                <span>🚀</span>
              </div>
              <h3>{t.value1Title}</h3>
              <p>{t.value1Desc}</p>
            </div>
            <div className="value-card-modern">
              <div className="value-icon-circle yellow-light">
                <span>🍀</span>
              </div>
              <h3>{t.value2Title}</h3>
              <p>{t.value2Desc}</p>
            </div>
            <div className="value-card-modern">
              <div className="value-icon-circle purple-light">
                <span>🔭</span>
              </div>
              <h3>{t.value3Title}</h3>
              <p>{t.value3Desc}</p>
            </div>
            <div className="value-card-modern">
              <div className="value-icon-circle yellow-light">
                <span>🎡</span>
              </div>
              <h3>{t.value4Title}</h3>
              <p>{t.value4Desc}</p>
            </div>
          </div>
        </div>
      </FadeSection>


      <FadeSection as="section" className="team-section">
        <div className="container">
          <div className="page-hero-title-wrapper">
            <div className="page-hero-title-line">
              <h2 className="page-hero-title-main">{t.teamTitle}</h2>
              <span className="page-hero-title-star" aria-hidden="true">★</span>
            </div>
          </div>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-member-avatar">
                <span>👤</span>
              </div>
              <h3 className="team-member-name">{t.teamMember1Name}</h3>
              <p className="team-member-role">{t.teamMember1Role}</p>
              <p className="team-member-desc">{t.teamMember1Desc}</p>
            </div>
            <div className="team-member">
              <div className="team-member-avatar">
                <span>👤</span>
              </div>
              <h3 className="team-member-name">{t.teamMember2Name}</h3>
              <p className="team-member-role">{t.teamMember2Role}</p>
              <p className="team-member-desc">{t.teamMember2Desc}</p>
            </div>
            <div className="team-member">
              <div className="team-member-avatar">
                <span>👤</span>
              </div>
              <h3 className="team-member-name">{t.teamMember3Name}</h3>
              <p className="team-member-role">{t.teamMember3Role}</p>
              <p className="team-member-desc">{t.teamMember3Desc}</p>
            </div>
            <div className="team-member">
              <div className="team-member-avatar">
                <span>👤</span>
              </div>
              <h3 className="team-member-name">{t.teamMember4Name}</h3>
              <p className="team-member-role">{t.teamMember4Role}</p>
              <p className="team-member-desc">{t.teamMember4Desc}</p>
            </div>
          </div>
        </div>
      </FadeSection>
    </div>
  )
}

export default About
