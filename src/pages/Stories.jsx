import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import { useCountUp } from '../hooks/useCountUp'
import Globe3D from '../components/Globe3D'
import './Stories.css'

// 数字递增动画组件
const CountUpNumber = ({ value, duration = 2000 }) => {
  const elementRef = useRef(null)
  const { value: displayValue } = useCountUp(value, duration, true, elementRef)
  return <span ref={elementRef}>{displayValue}</span>
}

const Stories = () => {
  const { language } = useLanguage()
  const t = translations[language].stories
  const [currentIndex, setCurrentIndex] = useState(0)
  const galleryRef = useRef(null)

  const stories = [
    {
      id: 1,
      author: language === 'zh' ? '张小明' : 'Zhang Xiaoming',
      location: language === 'zh' ? '巴黎, 法国' : 'Paris, France',
      title: t.story1Title,
      content: t.story1Content,
      date: language === 'zh' ? '2024年1月' : 'Jan 2024',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      coordinates: { x: 48.5, y: 28 }, // Paris: x = longitude (0-100), y = latitude (0-50)
    },
    {
      id: 2,
      author: language === 'zh' ? '李小红' : 'Li Xiaohong',
      location: language === 'zh' ? '巴塞罗那, 西班牙' : 'Barcelona, Spain',
      title: t.story2Title,
      content: t.story2Content,
      date: language === 'zh' ? '2024年2月' : 'Feb 2024',
      image: 'https://images.unsplash.com/photo-1539037116277-4b2087b3c6c3?w=800',
      coordinates: { x: 45, y: 32 }, // Barcelona
    },
    {
      id: 3,
      author: language === 'zh' ? '王小华' : 'Wang Xiaohua',
      location: language === 'zh' ? '阿姆斯特丹, 荷兰' : 'Amsterdam, Netherlands',
      title: t.story3Title,
      content: t.story3Content,
      date: language === 'zh' ? '2024年3月' : 'Mar 2024',
      image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
      coordinates: { x: 49, y: 20 }, // Amsterdam
    },
  ]

  const [hoveredMapMarker, setHoveredMapMarker] = useState(null)

  const scrollToStory = (index) => {
    if (galleryRef.current) {
      const cardWidth = galleryRef.current.offsetWidth / 1.2 // Show 1.2 cards at a time
      const scrollPosition = index * cardWidth
      galleryRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      })
      setCurrentIndex(index)
    }
  }

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const cardWidth = galleryRef.current.offsetWidth / 1.2
      const currentScroll = galleryRef.current.scrollLeft
      const targetIndex = direction === 1 
        ? Math.min(currentIndex + 1, stories.length - 1)
        : Math.max(currentIndex - 1, 0)
      scrollToStory(targetIndex)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current) {
        const cardWidth = galleryRef.current.offsetWidth / 1.2
        const newIndex = Math.round(galleryRef.current.scrollLeft / cardWidth)
        setCurrentIndex(newIndex)
      }
    }

    const gallery = galleryRef.current
    if (gallery) {
      gallery.addEventListener('scroll', handleScroll)
      return () => gallery.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const activities = [
    {
      id: 1,
      title: t.activity1Title,
      date: language === 'zh' ? '2024年4月' : 'Apr 2024',
      location: language === 'zh' ? '线上+线下' : 'Online + Offline',
      description: t.activity1Desc,
      gradient: 'purple-yellow',
      emoji: '🌸',
    },
    {
      id: 2,
      title: t.activity2Title,
      date: language === 'zh' ? '2024年3月' : 'Mar 2024',
      location: language === 'zh' ? '全球' : 'Global',
      description: t.activity2Desc,
      gradient: 'yellow-purple',
      emoji: '📖',
    },
    {
      id: 3,
      title: t.activity3Title,
      date: language === 'zh' ? '2024年2月' : 'Feb 2024',
      location: language === 'zh' ? '北京、上海、广州' : 'Beijing, Shanghai, Guangzhou',
      description: t.activity3Desc,
      gradient: 'purple-blue',
      emoji: '🎓',
    },
    {
      id: 4,
      title: t.activity4Title,
      date: language === 'zh' ? '2024年1月' : 'Jan 2024',
      location: language === 'zh' ? '全球' : 'Global',
      description: t.activity4Desc,
      gradient: 'yellow-orange',
      emoji: '🏆',
    },
  ]

  return (
    <div className="stories-page">
      <section className="stories-hero">
        <div 
          className="stories-hero-background"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/stories/cover.jpeg)`
          }}
        ></div>
        <div className="stories-hero-content">
          <div className="stories-hero-text-box">
            <p className="stories-hero-line1">{t.heroLine1}</p>
            <p className="stories-hero-line2">{t.heroLine2}</p>
          </div>
        </div>
        <div className="stories-hero-stats">
          <div className="stat-column">
            <div className="stat-number">
              <CountUpNumber value={t.stat1Number} duration={2000} />
            </div>
            <div className="stat-label">{t.stat1Label}</div>
          </div>
          <div className="stat-column">
            <div className="stat-number">
              <CountUpNumber value={t.stat2Number} duration={2000} />
            </div>
            <div className="stat-label">{t.stat2Label}</div>
          </div>
          <div className="stat-column">
            <div className="stat-number">
              <CountUpNumber value={t.stat3Number} duration={2000} />
            </div>
            <div className="stat-label">{t.stat3Label}</div>
          </div>
        </div>
      </section>

      <section className="stories-section">
        <div className="container">
          <h1 className="stories-main-title">{t.storiesTagline}</h1>
          <h2 className="section-title">{t.userStoriesTitle}</h2>
          
          <div className="stories-map-gallery-layout">
            <div className="stories-map-container">
              <Globe3D
                stories={stories}
                currentIndex={currentIndex}
                onMarkerClick={scrollToStory}
                hoveredMarker={hoveredMapMarker}
                onMarkerHover={setHoveredMapMarker}
              />
            </div>
            
            <div className="stories-gallery-wrapper">
            <button 
              className="gallery-nav-btn gallery-nav-prev"
              onClick={() => scrollGallery(-1)}
              disabled={currentIndex === 0}
              aria-label="Previous story"
            >
              ‹
            </button>
            
            <div className="stories-gallery" ref={galleryRef}>
              <div className="stories-gallery-track">
                {stories.map((story, index) => (
                  <div
                    key={story.id}
                    className={`story-card ${currentIndex === index ? 'story-card-active' : ''}`}
                  >
                    <div className="story-image-container">
                      <img src={story.image} alt={story.title} className="story-image" />
                      <div className="story-image-overlay"></div>
                      <div className="story-location-badge">
                        <span className="location-icon">📍</span>
                        <span>{story.location}</span>
                      </div>
                    </div>
                    <div className="story-content-wrapper">
                      <div className="story-header">
                        <div className="story-author-info">
                          <div className="story-avatar">{story.author[0]}</div>
                          <div>
                            <div className="story-author">{story.author}</div>
                            <div className="story-date">{story.date}</div>
                          </div>
                        </div>
                      </div>
                      <h3 className="story-title">{story.title}</h3>
                      <p className="story-content">{story.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="gallery-nav-btn gallery-nav-next"
              onClick={() => scrollGallery(1)}
              disabled={currentIndex === stories.length - 1}
              aria-label="Next story"
            >
              ›
            </button>
            </div>
          </div>

          <div className="gallery-indicators">
            {stories.map((_, index) => (
              <button
                key={index}
                className={`gallery-indicator ${currentIndex === index ? 'active' : ''}`}
                onClick={() => scrollToStory(index)}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="activities-section">
        <div className="container">
          <h2 className="section-title">{t.activityHistoryTitle}</h2>
          <p className="activity-history-intro">{t.activityHistoryIntro}</p>
          <div className="activities-timeline">
            {activities.map((activity) => (
              <div key={activity.id} className={`activity-item activity-${activity.gradient}`}>
                <div className="activity-image">
                  <div className="activity-emoji">{activity.emoji}</div>
                  <div className="activity-gradient-overlay"></div>
                </div>
                <div className="activity-content">
                  <div className="activity-date-badge">
                    <span className="date-text">{activity.date}</span>
                  </div>
                  <h3 className="activity-title">{activity.title}</h3>
                  <div className="activity-location">
                    <span className="location-icon">📍</span>
                    <span>{activity.location}</span>
                  </div>
                  <p className="activity-description">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Stories
