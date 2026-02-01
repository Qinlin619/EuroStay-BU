import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import { useCountUp } from '../hooks/useCountUp'
import Globe3D from '../components/Globe3D'
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
    setCurrentPage(Math.floor(index / CARDS_PER_PAGE))
  }

  const handleCountryClick = (isoCode, storyIndex, countryName) => {
    if (storyIndex != null) {
      scrollToStory(storyIndex)
      setHighlightCountryForMap(isoCode)
    } else {
      setHighlightCountryForMap(isoCode)
      setTimeout(() => {
        setNoStoryCountryCode(isoCode || '')
        setNoStoryCountryName(countryName || isoCode)
        setShowNoStoryModal(true)
      }, 700)
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
    const nextPage =
      direction === 1
        ? Math.min(currentPage + 1, totalPages - 1)
        : Math.max(currentPage - 1, 0)
    setCurrentPage(nextPage)
    setCurrentIndex(nextPage * CARDS_PER_PAGE)
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
              <CountUpNumber value={t.stat3Number} duration={2000} />
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
              <Globe3D
                stories={stories}
                currentIndex={currentIndex}
                highlightCountry={highlightCountryForMap}
                rotationTransitionMs={700}
                onMarkerClick={scrollToStory}
                onCountryClick={handleCountryClick}
                onCountryHighlight={setHighlightCountryForMap}
                hoveredMarker={hoveredMapMarker}
                onMarkerHover={setHoveredMapMarker}
                showCountryTooltip={false}
              />
            </div>
            
            <div className="stories-gallery-wrapper">
            <div className="stories-gallery" ref={galleryRef}>
              <div
                className="stories-gallery-track"
                style={{
                  width: `${totalPages * 100}%`,
                  transform: `translateX(-${currentPage * (100 / totalPages)}%)`,
                }}
              >
                {Array.from({ length: totalPages }, (_, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="stories-gallery-page"
                    style={{ flex: `0 0 ${100 / totalPages}%` }}
                  >
                    <div className="stories-gallery-grid">
                      {stories
                        .slice(pageIndex * CARDS_PER_PAGE, pageIndex * CARDS_PER_PAGE + CARDS_PER_PAGE)
                        .map((story, i) => {
                          const globalIndex = pageIndex * CARDS_PER_PAGE + i
                          const isSelected = globalIndex === currentIndex
                          return (
                          <div
                            key={story.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleStoryCardClick(globalIndex, story.countryCode)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleStoryCardClick(globalIndex, story.countryCode) } }}
                            className={`story-card ${i % 2 === 0 ? 'story-card-extend-right' : 'story-card-extend-left'} ${isSelected ? 'story-card-selected' : ''}`}
                          >
                            <div className="story-info-bar">
                              <div className="story-user-overlay">
                                <span className="story-author">{story.author}</span>
                                <span className="story-date">{story.date}</span>
                              </div>
                              <div className="story-location-badge">
                                <span className="location-icon">📍</span>
                                <span>{story.location}</span>
                              </div>
                            </div>
                            <div className="story-image-container">
                              <img src={story.image} alt={story.title} className="story-image" loading="lazy" decoding="async" fetchPriority="low" />
                              <div className="story-image-overlay"></div>
                            </div>
                            <div className="story-hover-overlay">
                              <h3 className="story-title">{story.title}</h3>
                              <p className="story-content">{story.content}</p>
                            </div>
                          </div>
                          )
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="gallery-nav-row">
              <button
                className="gallery-nav-btn gallery-nav-prev"
                onClick={() => scrollGallery(-1)}
                disabled={currentPage === 0}
                aria-label="Previous page"
              >
                ‹
              </button>
              <div className="gallery-dots">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`gallery-dot ${i === currentPage ? 'gallery-dot-active' : ''}`}
                    onClick={() => scrollToStory(i * CARDS_PER_PAGE)}
                    aria-label={language === 'zh' ? `第 ${i + 1} 页` : `Page ${i + 1}`}
                    aria-current={i === currentPage ? 'true' : undefined}
                  />
                ))}
              </div>
              <button
                className="gallery-nav-btn gallery-nav-next"
                onClick={() => scrollGallery(1)}
                disabled={currentPage >= totalPages - 1}
                aria-label="Next page"
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
              {(noStoryCountryCode && (translations[language]?.globeTooltip?.countryNames?.[noStoryCountryCode] ?? translations[language]?.globeTooltip?.countryNames?.[String(noStoryCountryCode).toUpperCase()])) ?? noStoryCountryName} {t.noStoryModalMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stories
