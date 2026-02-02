import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import { useCountUp } from '../hooks/useCountUp'
import StoriesGlobe from '../components/StoriesGlobe'
import FadeSection from '../components/FadeSection'
import './Stories.css'

// 数字递增动画组件
const CountUpNumber = ({ value, duration = 2000 }) => {
  const elementRef = useRef(null)
  const { value: displayValue } = useCountUp(value, duration, true, elementRef)
  return <span ref={elementRef}>{displayValue}</span>
}

const CARDS_PER_PAGE = 4

const Stories = () => {
  const { language } = useLanguage()
  const t = translations[language].stories
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [showNoStoryModal, setShowNoStoryModal] = useState(false)
  const [noStoryCountryName, setNoStoryCountryName] = useState('')
  const [noStoryCountryCode, setNoStoryCountryCode] = useState('') // ISO_A2，用于按语言显示国家名
  const [highlightCountryForMap, setHighlightCountryForMap] = useState(null) // 右侧点故事时传给地图高亮并旋转
  const galleryRef = useRef(null)

  const stories = [
    { id: 1, countryCode: 'FR', author: language === 'zh' ? '张小明' : 'Zhang Xiaoming', location: language === 'zh' ? '巴黎, 法国' : 'Paris, France', title: t.story1Title, content: t.story1Content, date: language === 'zh' ? '2024年1月' : 'Jan 2024', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', coordinates: { x: 48.5, y: 28 } },
    { id: 2, countryCode: 'ES', author: language === 'zh' ? '李小红' : 'Li Xiaohong', location: language === 'zh' ? '巴塞罗那, 西班牙' : 'Barcelona, Spain', title: t.story2Title, content: t.story2Content, date: language === 'zh' ? '2024年2月' : 'Feb 2024', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', coordinates: { x: 45, y: 32 } },
    { id: 3, countryCode: 'NL', author: language === 'zh' ? '王小华' : 'Wang Xiaohua', location: language === 'zh' ? '阿姆斯特丹, 荷兰' : 'Amsterdam, Netherlands', title: t.story3Title, content: t.story3Content, date: language === 'zh' ? '2024年3月' : 'Mar 2024', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800', coordinates: { x: 49, y: 20 } },
    { id: 4, countryCode: 'IT', author: language === 'zh' ? '陈思远' : 'Chen Siyuan', location: language === 'zh' ? '罗马, 意大利' : 'Rome, Italy', title: t.story4Title, content: t.story4Content, date: language === 'zh' ? '2024年4月' : 'Apr 2024', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', coordinates: { x: 52, y: 35 } },
    { id: 5, countryCode: 'DE', author: language === 'zh' ? '刘雨晴' : 'Liu Yuqing', location: language === 'zh' ? '柏林, 德国' : 'Berlin, Germany', title: t.story5Title, content: t.story5Content, date: language === 'zh' ? '2024年5月' : 'May 2024', image: 'https://images.unsplash.com/photo-1560930950-5cc20e80e392?w=800', coordinates: { x: 52, y: 22 } },
    { id: 6, countryCode: 'GB', author: language === 'zh' ? '赵明轩' : 'Zhao Mingxuan', location: language === 'zh' ? '伦敦, 英国' : 'London, UK', title: t.story6Title, content: t.story6Content, date: language === 'zh' ? '2024年6月' : 'Jun 2024', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', coordinates: { x: 38, y: 28 } },
    { id: 7, countryCode: 'PT', author: language === 'zh' ? '孙雅琪' : 'Sun Yaqi', location: language === 'zh' ? '里斯本, 葡萄牙' : 'Lisbon, Portugal', title: t.story7Title, content: t.story7Content, date: language === 'zh' ? '2024年7月' : 'Jul 2024', image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800', coordinates: { x: 42, y: 32 } },
    { id: 8, countryCode: 'AT', author: language === 'zh' ? '周浩然' : 'Zhou Haoran', location: language === 'zh' ? '维也纳, 奥地利' : 'Vienna, Austria', title: t.story8Title, content: t.story8Content, date: language === 'zh' ? '2024年8月' : 'Aug 2024', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800', coordinates: { x: 55, y: 28 } },
  ]

  const [hoveredMapMarker, setHoveredMapMarker] = useState(null)

  const totalPages = Math.ceil(stories.length / CARDS_PER_PAGE)
  const pageStories = stories.slice(
    currentPage * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE + CARDS_PER_PAGE
  )

  const scrollToStory = (index) => {
    setCurrentIndex(index)
    setCurrentPage(index)
  }

  const handleCountryClick = (isoCode, storyIndex, countryName) => {
    console.log('handleCountryClick:', { isoCode, storyIndex, countryName, language })
    if (storyIndex != null) {
      scrollToStory(storyIndex)
      setHighlightCountryForMap(isoCode)
    } else {
      setHighlightCountryForMap(isoCode)
      setTimeout(() => {
        setNoStoryCountryCode(isoCode || '')
        setNoStoryCountryName(countryName || isoCode)
        setShowNoStoryModal(true)
      }, 400)
    }
  }

  const handleStoryCardClick = (index, countryCode) => {
    scrollToStory(index)
    setHighlightCountryForMap(countryCode || null)
  }

  // 弹窗显示 1.5 秒后自动关闭
  useEffect(() => {
    if (!showNoStoryModal) return
    const timer = setTimeout(() => setShowNoStoryModal(false), 1500)
    return () => clearTimeout(timer)
  }, [showNoStoryModal])

  const scrollGallery = (direction) => {
    const nextIndex =
      direction === 1
        ? Math.min(currentPage + 1, stories.length - 1)
        : Math.max(currentPage - 1, 0)
    setCurrentPage(nextIndex)
    setCurrentIndex(nextIndex)
    setHighlightCountryForMap(stories[nextIndex].countryCode)
  }

  const activities = [
    {
      id: 1,
      title: t.activity1Title,
      date: language === 'zh' ? '2024年4月' : 'Apr 2024',
      location: language === 'zh' ? '线上+线下' : 'Online + Offline',
      description: t.activity1Desc,
      gradient: 'purple-yellow',
      emoji: '🌸',
      image: 'https://images.unsplash.com/photo-1490750967868-88aa354d700f?w=800'
    },
    {
      id: 2,
      title: t.activity2Title,
      date: language === 'zh' ? '2024年3月' : 'Mar 2024',
      location: language === 'zh' ? '全球' : 'Global',
      description: t.activity2Desc,
      gradient: 'yellow-purple',
      emoji: '📖',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800'
    },
    {
      id: 3,
      title: t.activity3Title,
      date: language === 'zh' ? '2024年2月' : 'Feb 2024',
      location: language === 'zh' ? '北京、上海、广州' : 'Beijing, Shanghai, Guangzhou',
      description: t.activity3Desc,
      gradient: 'purple-blue',
      emoji: '🎓',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800'
    },
    {
      id: 4,
      title: t.activity4Title,
      date: language === 'zh' ? '2024年1月' : 'Jan 2024',
      location: language === 'zh' ? '全球' : 'Global',
      description: t.activity4Desc,
      gradient: 'yellow-orange',
      emoji: '🏆',
      image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=800'
    },
  ]

  return (
    <div className="stories-page">
      <section className={`stories-hero ${language === 'en' ? 'stories-hero-en' : ''}`}>
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
              <CountUpNumber value="400+" duration={2000} />
            </div>
            <div className="stat-label">{t.stat3Label}</div>
          </div>
          <div className="stat-column">
            <div className="stat-number">
              <CountUpNumber value={t.stat4Number} duration={2000} />
            </div>
            <div className="stat-label">{t.stat4Label}</div>
          </div>
        </div>
      </section>

      <FadeSection as="section" className="stories-section">
        <div className="container">
          <div className="page-hero-title-wrapper">
            <div className="page-hero-title-line">
              <h1 className="page-hero-title-main">{t.storiesTagline}</h1>
              <span className="page-hero-title-star" aria-hidden="true">★</span>
            </div>
            <p className="stories-hero-subtitle">{t.mapDragHint}</p>
          </div>
          <div className="stories-map-gallery-layout">
            <div className="stories-map-container">
              <div className="globe-3d-wrapper">
                <StoriesGlobe
                  onCountryClick={handleCountryClick}
                  highlightCountry={highlightCountryForMap}
                  stories={stories}
                  currentIndex={currentIndex}
                  rotationTransitionMs={400}
                  onMarkerClick={scrollToStory}
                  onCountryHighlight={setHighlightCountryForMap}
                  hoveredMarker={hoveredMapMarker}
                  onMarkerHover={setHoveredMapMarker}
                  showCountryTooltip={false}
                />
              </div>
              <div className="map-intro-overlay">
                <div className="map-hint-badge">
                  <span className="hint-icon">🖱️</span>
                  <span>{t.mapDragHint}</span>
                </div>
              </div>
            </div>

            <div className="stories-gallery-wrapper">
              <div className="stories-gallery">
                <div
                  className="stories-gallery-track"
                  style={{ transform: `translateX(-${currentPage * 72}%)` }}
                >
                  {stories.map((story, index) => (
                    <div
                      key={story.id}
                      className={`story-card ${currentIndex === index ? 'story-card-selected' : ''}`}
                      onClick={() => handleStoryCardClick(index, story.countryCode)}
                    >
                      <div className="story-info-bar">
                        <div className="story-user-overlay">
                          <h4 className="story-author">{story.author}</h4>
                          <span className="story-date">{story.date}</span>
                        </div>
                        <div className="story-location-badge">
                          <span className="location-pin">📍</span>
                          <span className="location-name">{story.location}</span>
                        </div>
                      </div>
                      <div className="story-image-container">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="story-image"
                          loading="lazy"
                        />
                        <div className="story-image-overlay"></div>
                        <div className="story-hover-overlay">
                          <h3 className="story-hover-title">{story.title}</h3>
                          <p className="story-hover-desc">{story.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gallery-footer">
                <button
                  className="gallery-nav-btn"
                  onClick={() => scrollGallery(-1)}
                  disabled={currentPage === 0}
                  aria-label="Previous story"
                >
                  ‹
                </button>
                <div className="gallery-dots">
                  {stories.map((_, index) => (
                    <button
                      key={index}
                      className={`gallery-dot ${currentPage === index ? 'gallery-dot-active' : ''}`}
                      onClick={() => {
                        setCurrentPage(index);
                        setCurrentIndex(index);
                        setHighlightCountryForMap(stories[index].countryCode);
                      }}
                      aria-label={`Go to story ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  className="gallery-nav-btn"
                  onClick={() => scrollGallery(1)}
                  disabled={currentPage >= stories.length - 1}
                  aria-label="Next story"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </FadeSection>

      <FadeSection as="section" className="activities-section">
        <div className="container">
          <div className="page-hero-title-wrapper">
            <div className="page-hero-title-line">
              <h2 className="page-hero-title-main">{t.activityHistoryTitle}</h2>
              <span className="page-hero-title-star" aria-hidden="true">★</span>
            </div>
          </div>
          <p className="activity-history-intro">{t.activityHistoryIntro}</p>
          <div className="storyboard-container">
            <div className="z-path-bg" aria-hidden="true">
              <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 200 L1100 200 L100 600 L1100 600" stroke="url(#z-gradient)" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 15" />
                <defs>
                  <linearGradient id="z-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-purple-primary)" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="var(--color-yellow-primary)" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="var(--color-purple-primary)" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="storyboard-grid">
              {activities.map((activity) => (
                <div key={activity.id} className="storyboard-card">
                  <div className="storyboard-media">
                    <img src={activity.image} alt={activity.title} className="storyboard-img" loading="lazy" />
                    <div className="storyboard-emoji-badge">{activity.emoji}</div>
                    <div className="storyboard-gradient-overlay"></div>
                  </div>
                  <div className="storyboard-overlay">
                    <div className="storyboard-content">
                      <div className="storyboard-date">{activity.date}</div>
                      <h3 className="storyboard-title">{activity.title}</h3>
                      <div className="storyboard-location">📍 {activity.location}</div>
                      <p className="storyboard-desc">{activity.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeSection>

      {showNoStoryModal && (
        <div
          className="stories-no-story-modal-overlay"
          onClick={() => setShowNoStoryModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="no-story-modal-title"
        >
          <div className="stories-no-story-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="no-story-modal-title" className="stories-no-story-modal-title">{t.noStoryModalTitle}</h3>
            <p className="stories-no-story-modal-message">
              {noStoryCountryCode
                ? (translations[language]?.globeTooltip?.countryNames?.[noStoryCountryCode] || noStoryCountryCode)
                : noStoryCountryName
              } {t.noStoryModalMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stories
