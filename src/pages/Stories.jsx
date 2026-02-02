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
    {
      id: 1,
      countryCode: 'ES',
      author: language === 'zh' ? '伞伞' : 'San San',
      location: language === 'zh' ? '巴塞罗那, 西班牙' : 'Barcelona, Spain',
      title: language === 'zh' ? '赞到麻木的旅程' : 'A Stunning Journey',
      content: language === 'zh' ? '赞到麻木的旅程，坐拥山上大豪斯处处都是精心装修的yoyo真的很贴心！提前把暖气开好带两个广东人喝暖汤而且还超会照顾植物给我们讲了很多自然界的知识，感觉心静下来了，在纷扰的物理世界在她家给自己悄悄放了一个假，期待下次有机会一起去徒步去山间小屋看一看~' : 'A stunning journey in a beautiful house on the hill. Yoyo was so thoughtful, preparing warm soup for us and sharing her knowledge of nature. It felt like a peaceful retreat from the busy world. Looking forward to hiking and visiting mountain cabins together next time!',
      date: language === 'zh' ? '2025年3月4日' : 'Mar 4, 2025',
      image: `${import.meta.env.BASE_URL}images/stories/换宿故事/1.jpg`,
      coordinates: { x: 45, y: 32 }
    },
    {
      id: 2,
      countryCode: 'CH',
      author: language === 'zh' ? '伞伞' : 'San San',
      location: language === 'zh' ? '日内瓦, 瑞士' : 'Geneva, Switzerland',
      title: language === 'zh' ? '隈研吾设计的学生宿舍' : 'Kengo Kuma Designed Dorm',
      content: language === 'zh' ? '超级酷的，住进去之前不知道，一住吓一跳，居然是隈研吾设计的学生宿舍！在瑞士体验日式简约好神奇，好吃的可乐鸡翅大碗奶茶一起打游戏一起看再见爱人一起聊天到半夜，期待下次在另一个地方见面！' : 'Super cool experience! Didn\'t know beforehand that it was a student dorm designed by Kengo Kuma. Experiencing Japanese minimalism in Switzerland was amazing. Great food, gaming, and late-night chats. Can\'t wait to meet again in another place!',
      date: language === 'zh' ? '2024年11月28日' : 'Nov 28, 2024',
      image: `${import.meta.env.BASE_URL}images/stories/换宿故事/2.jpg`,
      coordinates: { x: 49.5, y: 26 }
    },
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
  // 移除自动关闭，由用户点击关闭
  /*
  useEffect(() => {
    if (!showNoStoryModal) return
    const timer = setTimeout(() => setShowNoStoryModal(false), 1500)
    return () => clearTimeout(timer)
  }, [showNoStoryModal])
  */

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
      title: language === 'zh' ? '新春饺子会' : 'CNY Dumpling Party',
      date: '2025.01',
      location: '🇳🇱 Amsterdam',
      description: language === 'zh' ? '在阿姆斯特丹举行的华人新年聚会，大家一起包饺子迎接新春。' : 'CNY party in Amsterdam, making dumplings together.',
      emoji: '🥟',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/DSC01532.jpg`
    },
    {
      id: 2,
      title: language === 'zh' ? '社群桌游之夜' : 'Board Game Night',
      date: '2025.01',
      location: '🇳🇱 Rotterdam',
      description: language === 'zh' ? '周末的社群小聚，在欢声笑语中增进彼此的了解。' : 'Weekend community gathering with board games and laughter.',
      emoji: '🎲',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/DSC01534.jpg`
    },
    {
      id: 3,
      title: language === 'zh' ? '开发者面基' : 'Dev Meetup',
      date: '2025.01',
      location: '🇳🇱 Delft',
      description: language === 'zh' ? 'EuroStay 幕后团队与热心用户的线下交流会。' : 'Offline exchange between EuroStay team and active users.',
      emoji: '💻',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/DSC01615.jpg`
    },
    {
      id: 4,
      title: language === 'zh' ? '海牙海滩漫步' : 'The Hague Beach Walk',
      date: '2025.01',
      location: '🇳🇱 The Hague',
      description: language === 'zh' ? '呼吸海边的新鲜空气，分享各自的换宿故事。' : 'Walking by the sea and sharing homestay stories.',
      emoji: '🌊',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/DSC01653.jpg`
    },
    {
      id: 5,
      title: language === 'zh' ? '换宿友友集锦' : 'Homestay Friends',
      date: '2025.02',
      location: '🇪🇸 Barcelona',
      description: language === 'zh' ? '在巴塞罗那的阳光下，见证跨越国界的友谊。' : 'Sunlight in Barcelona, witnessing cross-border friendships.',
      emoji: '☀️',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/DSC02046.jpg`
    },
    {
      id: 6,
      title: language === 'zh' ? '伦敦艺术之旅' : 'London Art Tour',
      date: '2025.02',
      location: '🇬🇧 London',
      description: language === 'zh' ? '一起打卡大英博物馆，探索艺术的奥秘。' : 'Visiting the British Museum and exploring art wonders together.',
      emoji: '🎨',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/DSC02416.jpg`
    },
    {
      id: 7,
      title: language === 'zh' ? '巴黎浪漫邂逅' : 'Paris Rendezvous',
      date: '2025.02',
      location: '🇫🇷 Paris',
      description: language === 'zh' ? '塞纳河畔的下午茶，聊聊未来的旅行计划。' : 'Afternoon tea by the Seine, chatting about future travel plans.',
      emoji: '☕',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/DSC02451.jpg`
    },
    {
      id: 8,
      title: language === 'zh' ? '柏林墙下的分享' : 'Berlin Wall Sharing',
      date: '2025.01',
      location: 'DE Berlin',
      description: language === 'zh' ? '在历史遗迹前，感悟跨越隔阂的连接。' : 'Thinking about connections in front of historical sites.',
      emoji: '🧱',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/IMG_3687.jpg`
    },
    {
      id: 9,
      title: language === 'zh' ? '米兰时尚之约' : 'Milan Fashion Date',
      date: '2025.01',
      location: '🇮🇹 Milan',
      description: language === 'zh' ? '在时尚之都，寻找那些独特的换宿体验。' : 'Finding unique homestay experiences in the city of fashion.',
      emoji: '👠',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/IMG_4083.jpg`
    },
    {
      id: 10,
      title: language === 'zh' ? '换宿经验分享' : 'Homestay Tips Sync',
      date: '2025.01',
      location: '🇬🇧 London',
      description: language === 'zh' ? '资深 Host 分享如何打造一个温馨的家。' : 'Experienced hosts sharing how to create a welcoming home.',
      emoji: '📒',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/IMG_4356.jpg`
    },
    {
      id: 11,
      title: language === 'zh' ? '里斯本的阳光' : 'Lisbon Sun',
      date: '2025.01',
      location: '🇵🇹 Lisbon',
      description: language === 'zh' ? '体验南欧的热情，感受大航海时代的遗风。' : 'Experiencing Southern European passion and maritime history.',
      emoji: '⛵',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/IMG_4378.jpg`
    },
    {
      id: 12,
      title: language === 'zh' ? '苏黎世湖畔小聚' : 'Lake Zurich Meetup',
      date: '2025.01',
      location: '🇨🇭 Zurich',
      description: language === 'zh' ? '在湖光山色中，开启一段全新的旅程。' : 'Starting a new journey amidst lake and mountain views.',
      emoji: '🏔️',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/IMG_4388.jpg`
    },
    {
      id: 13,
      title: language === 'zh' ? '维也纳音乐夜' : 'Vienna Music Night',
      date: '2025.01',
      location: '🇦🇹 Vienna',
      description: language === 'zh' ? '聆听城市的律动，感受音乐之都的魅力。' : 'Listening to the rhythm of the city of music.',
      emoji: '🎶',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/IMG_4391.jpg`
    },
    {
      id: 14,
      title: language === 'zh' ? '社群成员集照' : 'Community Portrait',
      date: '2025.01',
      location: '🇨🇳 Beijing',
      description: language === 'zh' ? 'EuroStay 的大家庭，让世界不再孤独。' : 'The EuroStay family making the world a smaller place.',
      emoji: '👨‍👩‍👧‍👦',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/20250125_133519506_iOS.jpg`
    },
    {
      id: 15,
      title: language === 'zh' ? '户外徒步活动' : 'Outdoor Hiking',
      date: '2025.01',
      location: '🇳🇱 Utrecht',
      description: language === 'zh' ? '在大自然中结识新朋友，探索未知的足迹。' : 'Making new friends and exploring unknown paths in nature.',
      emoji: '🥾',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/20250128_205808399_iOS.jpg`
    },
    {
      id: 16,
      title: language === 'zh' ? '元宵节特别活动' : 'Lantern Festival',
      date: '2025.02',
      location: '🇳🇱 Rotterdam',
      description: language === 'zh' ? '吃元宵、赏花灯，身在海外也能感受家乡年味。' : 'Traditional lantern festival vibes even overseas.',
      emoji: '🏮',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/20250223_111331000_iOS.jpg`
    },
    {
      id: 17,
      title: language === 'zh' ? '社群分享会' : 'Stories sharing Night',
      date: '2026.02',
      location: 'Global',
      description: language === 'zh' ? '在 EuroStay 社交平台上分享你的换宿精彩瞬间。' : 'Share your brilliant homestay moments on EuroStay social platforms.',
      emoji: '📸',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/图片_20260203060054.jpg`
    },
    {
      id: 18,
      title: language === 'zh' ? '全球换宿地图' : 'Global Homestay Map',
      date: '2026.02',
      location: 'Global',
      description: language === 'zh' ? '连接全球有趣的灵魂，开启无限生活维度。' : 'Connecting interesting souls worldwide.',
      emoji: '🗺️',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/图片_20260203060445.jpg`
    }
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
          <div className="stat-column">
            <div className="stat-number">
              <CountUpNumber value={t.stat5Number} duration={2000} />
            </div>
            <div className="stat-label">{t.stat5Label}</div>
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
          <div className="photo-wall-container">
            <div className="photo-wall">
              {activities.map((activity, index) => (
                <div key={activity.id} className={`polaroid-card polaroid-card-${index + 1}`}>
                  <div className="polaroid-decorations">
                    <div className="washi-tape"></div>
                    <span className="polaroid-star polaroid-star-1">✦</span>
                    <span className="polaroid-star polaroid-star-2">★</span>
                  </div>
                  <div className="polaroid-inner">
                    <div className="polaroid-media">
                      <img src={activity.image} alt={activity.title} className="polaroid-img" loading="lazy" />
                    </div>
                    <div className="polaroid-caption">
                      <div className="polaroid-date">{activity.date}</div>
                      <h3 className="polaroid-title">{activity.title}</h3>
                      <div className="polaroid-location">📍 {activity.location}</div>
                    </div>
                  </div>
                  <div className="polaroid-overlay">
                    <div className="polaroid-overlay-content">
                      <p className="polaroid-desc">{activity.description}</p>
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
              {t.noStoryModalMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stories
