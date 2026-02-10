import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
      image: `${import.meta.env.BASE_URL}images/stories/stories/1.jpg`,
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
      image: `${import.meta.env.BASE_URL}images/stories/stories/2.jpg`,
      coordinates: { x: 49.5, y: 26 }
    },
    {
      id: 3,
      countryCode: 'IT',
      author: language === 'zh' ? 'Sherry' : 'Sherry',
      location: language === 'zh' ? '米兰, 意大利' : 'Milan, Italy',
      title: language === 'zh' ? '睡觉时头上会长猫耶！' : 'Cats Grow on Your Head While Sleeping!',
      content: language === 'zh' ? '成功和苏苏以房换房啦！她住进我在巴塞的房间里，然后我再去米兰住她家，刚刚好！真的好幸运能够有这样的一段缘分！在房间里聊天到深夜，睡觉时一起裹成木乃伊，一醒来还能面对猫猫的大屁股…太多有趣的回忆啦～苏苏还给我们推荐了好多好吃的餐厅，跟着本地人逛街就是爽！' : 'Swapped rooms with Susu! She stayed in my Barcelona room, and I stayed at her place in Milan—perfect match! So lucky to have this connection. Late-night chats, wrapping ourselves like mummies to sleep, and waking up to a cat\'s big butt... so many fun memories! Susu recommended amazing restaurants; exploring with a local is the best. Even though it was only three days, it felt like we’ve been friends for years.',
      date: language === 'zh' ? '2026年1月10日' : 'Jan 10, 2026',
      image: `${import.meta.env.BASE_URL}images/stories/stories/3.jpg`,
      coordinates: { x: 52.5, y: 37.6 }
    },
    {
      id: 4,
      countryCode: 'CH',
      author: language === 'zh' ? 'Chin' : 'Chin',
      location: language === 'zh' ? '苏黎世, 瑞士' : 'Zurich, Switzerland',
      title: language === 'zh' ? '瑞士雪山前的大平层' : 'High-rise Apartment by the Swiss Alps',
      content: language === 'zh' ? '做梦都没想到能住进这样美丽的房子里～姐不仅开车来接我，还带着我去山上兜风，太幸福了。这个房子超级有设计感的，手工家具、装饰、每一个角落都有小巧思，而且在阳台就能看到对面的雪山，看着雪山读书，也是过上了梦中的日子了。姐还给我做早餐，真的好感动，我们聊了好多好多，关于事业、人生……给我好多的启发！' : 'Never dreamed of staying in such a beautiful house! My host picked me up and even took me for a mountain drive—pure happiness. The house is so well-designed, with handmade furniture and thoughtful details in every corner. Reading on the balcony facing the snow-capped mountains felt like a dream come true. She even made breakfast for me; our deep conversations about career and life gave me so much inspiration!',
      date: language === 'zh' ? '2025年' : '2025',
      image: `${import.meta.env.BASE_URL}images/stories/stories/4.png`,
      coordinates: { x: 48.5, y: 24.5 }
    },
    {
      id: 5,
      countryCode: 'FR',
      author: language === 'zh' ? 'Siri' : 'Siri',
      location: language === 'zh' ? '巴黎, 法国' : 'Paris, France',
      title: language === 'zh' ? '住进巴黎的教师公寓' : 'Stayed in a Teacher\'s Apartment in Paris',
      content: language === 'zh' ? '住进了巴黎的教师公寓，太酷了。在一个像城堡一样的建筑里，楼梯都很华丽。但是也能感受到巴黎真是寸土寸金了hhh姐推荐的附近的面包店出品简直惊为天人！特别是泡芙，太好吃了！我给她带上了我们特制的徽章和冰箱贴，小小的礼物代表我们的心意～虽然只有短短的一晚缘分，希望国内还能有缘相见呀！' : 'Stayed in a teacher\'s apartment in Paris—so cool! It was in a castle-like building with grand staircases. You can really feel how expensive space is in Paris though, haha. The nearby bakery recommended by my host was mind-blowing, especially the cream puffs! I gave her our special badges and fridge magnets as a small token of appreciation. Though it was only for one night, I hope we meet again in China!',
      date: language === 'zh' ? '2025年' : '2025',
      image: `${import.meta.env.BASE_URL}images/stories/stories/5.png`,
      coordinates: { x: 50.6, y: 38.5 }
    },
    {
      id: 6,
      countryCode: 'MT',
      author: language === 'zh' ? 'Chin' : 'Chin',
      location: language === 'zh' ? '马耳他' : 'Malta',
      title: language === 'zh' ? '面对海岸的超级大房子' : 'Grand House Facing the Coast',
      content: language === 'zh' ? '面对海岸的超级大房子真的好美，姐的厨艺真是杠杠的，一个人给我们做了一桌的菜，简直是家的味道，太幸福了，晚上我们还玩上switch了，好有家的氛围～姐对我们的事业很感兴趣，同时她也在做一些相关的事情，所以我们很愉快地交流了很多，同时很巧的是她的女儿马上要来我们学校念书了耶' : 'A massive house facing the sea; it was stunning. My host is an incredible cook—she prepared a full table of food just for us; it truly tasted like home. We even played Switch in the evening! The atmosphere was so warm. She was very interested in our work, and since she\'s doing something similar, we had a great exchange. Small world: her daughter is about to start studying at our university!',
      date: language === 'zh' ? '2024年' : '2024',
      image: `${import.meta.env.BASE_URL}images/stories/stories/6.png`,
      coordinates: { x: 55, y: 48 }
    },
  ]

  const [hoveredMapMarker, setHoveredMapMarker] = useState(null)
  const [activeActivityId, setActiveActivityId] = useState(null)

  const handleActivityClick = (id) => {
    setActiveActivityId(id)
  }

  const totalPages = Math.ceil(stories.length / CARDS_PER_PAGE)
  const pageStories = stories.slice(
    currentPage * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE + CARDS_PER_PAGE
  )

  const trackRef = useRef(null)

  const scrollToStory = (index) => {
    setCurrentIndex(index)
    setCurrentPage(index)
    if (trackRef.current) {
      const card = trackRef.current.children[index]
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
      }
    }
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
    scrollToStory(nextIndex)
    setHighlightCountryForMap(stories[nextIndex].countryCode)
  }

  const handleScroll = () => {
    if (!trackRef.current) return

    // 简单的防抖或直接计算当前最左侧对齐的卡片
    const track = trackRef.current
    const scrollLeft = track.scrollLeft
    const containerLeft = track.getBoundingClientRect().left

    let newIndex = -1
    let minDiff = Number.MAX_VALUE

    // 遍历所有子元素，找到最接近容器左边缘的那个
    Array.from(track.children).forEach((child, index) => {
      const childRect = child.getBoundingClientRect()
      // 计算卡片左边缘与容器左边缘的距离
      const diff = Math.abs(childRect.left - containerLeft)

      if (diff < minDiff) {
        minDiff = diff
        newIndex = index
      }
    })

    if (newIndex !== -1 && newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
      setCurrentPage(newIndex)
      // 注意：这里不要 setHighlightCountryForMap，否则滑动时地图也会疯狂旋转，体验可能不好
      // 或者如果想要联动，可以加个防抖。这里暂时仅更新下方圆点和高亮卡片
      // 如果确实需要地图联动：
      // setHighlightCountryForMap(stories[newIndex].countryCode) 
    }
  }

  const activities = [
    {
      id: 1,
      date: '2024',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2024鹿特丹.jpg`
    },
    {
      id: 2,
      date: '2024',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2024鹿特丹2.jpg`
    },
    {
      id: 3,
      date: '2024',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2024鹿特丹3.jpg`
    },
    {
      id: 4,
      date: '2024',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2024鹿特丹4.jpg`
    },
    {
      id: 5,
      date: '2024',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2024鹿特丹5.jpg`
    },
    {
      id: 6,
      date: '2024',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2024鹿特丹6.jpg`
    },
    {
      id: 7,
      date: '2024',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2024鹿特丹7.jpg`
    },
    {
      id: 8,
      date: '2024',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2024鹿特丹13.jpg`
    },
    {
      id: 9,
      date: '2024',
      location: '🇳🇱 Amsterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2024阿姆斯特丹.jpg`
    },
    {
      id: 10,
      date: '2025',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2025鹿特丹.jpg`
    },
    {
      id: 11,
      date: '2025',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2025鹿特丹8.jpg`
    },
    {
      id: 12,
      date: '2025',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2025鹿特丹9.jpg`
    },
    {
      id: 13,
      date: '2025',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2025鹿特丹10.jpg`
    },
    {
      id: 14,
      date: '2025',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2025鹿特丹11.jpg`
    },
    {
      id: 15,
      date: '2025',
      location: '🇳🇱 Rotterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2025鹿特丹12.jpg`
    },
    {
      id: 16,
      date: '2025',
      location: '🇳🇱 Amsterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2025阿姆斯特丹.jpg`
    },
    {
      id: 17,
      date: '2026',
      location: '🇳🇱 Amsterdam',
      image: `${import.meta.env.BASE_URL}images/stories/历史活动/compressed/2026阿姆斯特丹2.jpg`
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

      <FadeSection as="section" id="stories-map" className="stories-section">
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
                  ref={trackRef}
                  onScroll={handleScroll}
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

      <FadeSection as="section" id="stories-history" className="activities-section">
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
                <div
                  key={activity.id}
                  className={`polaroid-card polaroid-card-${index + 1} ${activeActivityId === activity.id ? 'active' : ''}`}
                  onClick={() => handleActivityClick(activity.id)}
                >
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
                      <div className="polaroid-location">📍 {activity.location}</div>
                      <div className="polaroid-date">{activity.date}</div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeSection>

      {showNoStoryModal && createPortal(
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
        </div>,
        document.body
      )}
    </div>
  )
}

export default Stories
