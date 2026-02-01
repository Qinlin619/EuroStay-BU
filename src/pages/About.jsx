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
        <div className="banner-image">
          <div className="banner-placeholder">
            <span>{language === 'zh' ? '品牌宣传图片' : 'Brand Banner'}</span>
          </div>
        </div>
        <div className="banner-overlay">
          <div className="container">
            <div className="page-hero-title-wrapper">
              <div className="page-hero-title-line">
                <h1 className="page-hero-title-main page-hero-title-main-on-dark">{t.title}</h1>
                <span className="page-hero-title-star page-hero-title-star-on-dark" aria-hidden="true">★</span>
              </div>
            </div>
            <p className="page-subtitle">{t.subtitle}</p>
          </div>
        </div>
      </section>

      <FadeSection as="section" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>{t.storyTitle}</h2>
              <p>{t.story1}</p>
              <p>{t.story2}</p>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span>{language === 'zh' ? '团队照片' : 'Team Photo'}</span>
              </div>
            </div>
          </div>
        </div>
      </FadeSection>

      <FadeSection as="section" className="mission-section">
        <div className="container">
          <div className="page-hero-title-wrapper">
            <div className="page-hero-title-line">
              <h2 className="page-hero-title-main">{t.missionTitle}</h2>
              <span className="page-hero-title-star" aria-hidden="true">★</span>
            </div>
          </div>
          <div className="mission-cards">
            <div className="mission-card">
              <div className="mission-icon purple">
                <span>🌍</span>
              </div>
              <h3>{t.mission1Title}</h3>
              <p>{t.mission1Desc}</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon yellow">
                <span>💚</span>
              </div>
              <h3>{t.mission2Title}</h3>
              <p>{t.mission2Desc}</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon purple">
                <span>🤝</span>
              </div>
              <h3>{t.mission3Title}</h3>
              <p>{t.mission3Desc}</p>
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
          <div className="values-list">
            <div className="value-item">
              <div className="value-icon">🙏</div>
              <h4>{t.value1Title}</h4>
              <p>{t.value1Desc}</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <h4>{t.value2Title}</h4>
              <p>{t.value2Desc}</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🔗</div>
              <h4>{t.value3Title}</h4>
              <p>{t.value3Desc}</p>
            </div>
            <div className="value-item">
              <div className="value-icon">✨</div>
              <h4>{t.value4Title}</h4>
              <p>{t.value4Desc}</p>
            </div>
          </div>
        </div>
      </FadeSection>

      <FadeSection as="section" className="contact-section">
        <div className="container">
          <div className="page-hero-title-wrapper">
            <div className="page-hero-title-line">
              <h2 className="page-hero-title-main">{t.contactTitle}</h2>
              <span className="page-hero-title-star" aria-hidden="true">★</span>
            </div>
          </div>
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <h4>{t.email}</h4>
                <p>contact@eurostay.com</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📱</div>
              <div>
                <h4>{t.phone}</h4>
                <p>400-888-8888</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <h4>{t.address}</h4>
                <p>{language === 'zh' ? '北京市朝阳区xxx路xxx号' : 'Chaoyang District, Beijing, China'}</p>
              </div>
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
