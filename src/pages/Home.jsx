import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import { useCountUp } from '../hooks/useCountUp'
import Globe3D from '../components/Globe3D'
import './Home.css'

// 数字递增动画组件
const CountUpNumber = ({ value, duration = 2000 }) => {
  const elementRef = useRef(null)
  const { value: displayValue } = useCountUp(value, duration, true, elementRef)
  return <span ref={elementRef}>{displayValue}</span>
}

// 评价卡片组件
const ReviewCard = ({ review, language }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-avatar">{review.name.charAt(0)}</div>
        <div className="review-user-info">
          <div className="review-user-name">{review.name}</div>
          <div className="review-user-location">{review.location}</div>
        </div>
      </div>
      <div className="review-rating">
        {Array.from({ length: review.rating || 5 }, (_, i) => (
          <span key={i} className="review-star">★</span>
        ))}
      </div>
      <div className="review-content">{review.content}</div>
      <div className="review-date">{review.date}</div>
    </div>
  )
}

const Home = () => {
  const { language } = useLanguage()
  const t = translations[language].home
  const galleryContainerRef = useRef(null)
  const phoneGalleryRef = useRef(null)
  const stepsContainerRef = useRef(null)
  const communityGalleryRef = useRef(null)

  // Host card images - 3:4 aspect ratio
  const hostCardImages = [
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host1.PNG`, title: language === 'zh' ? '阿姆斯特丹 凭实力单身局' : 'Amsterdam: Single by Strength' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host2.PNG`, title: language === 'zh' ? '生活的100种可能性 01 荷兰玥哥' : '100 Possibilities of Life 01' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host3.PNG`, title: language === 'zh' ? '来荷兰 欢迎住我家!' : 'Come to Netherlands' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host4.PNG`, title: language === 'zh' ? '来意大利 欢迎住我家!' : 'Come to Italy' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host5.PNG`, title: language === 'zh' ? '来西班牙 欢迎住我家!' : 'Come to Spain' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host6.PNG`, title: language === 'zh' ? 'Host Card 6' : 'Host Card 6' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host7.PNG`, title: language === 'zh' ? 'Host Card 7' : 'Host Card 7' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host8.jpg`, title: language === 'zh' ? 'Host Card 8' : 'Host Card 8' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host9.jpg`, title: language === 'zh' ? 'Host Card 9' : 'Host Card 9' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host10.jpg`, title: language === 'zh' ? 'Host Card 10' : 'Host Card 10' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host11.jpg`, title: language === 'zh' ? 'Host Card 11' : 'Host Card 11' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host12.JPG`, title: language === 'zh' ? 'Host Card 12' : 'Host Card 12' },
    { src: `${import.meta.env.BASE_URL}images/home/host-cards/host13.jpg`, title: language === 'zh' ? 'Host Card 13' : 'Host Card 13' },
  ]

  // 国家用户数量数据（ISO国家代码 -> 用户数量）
  const countryUserCounts = {
    'FR': 1250,    // 法国
    'ES': 980,     // 西班牙
    'NL': 750,     // 荷兰
    'IT': 620,     // 意大利
    'DE': 580,     // 德国
    'PT': 450,     // 葡萄牙
    'GR': 380,     // 希腊
    'IE': 320,     // 爱尔兰
    'BE': 280,     // 比利时
    'AT': 250,     // 奥地利
    'CH': 220,     // 瑞士
    'DK': 200,     // 丹麦
    'SE': 180,     // 瑞典
    'NO': 160,     // 挪威
    'FI': 140,     // 芬兰
    'PL': 120,     // 波兰
    'CZ': 100,     // 捷克
    'HU': 90,      // 匈牙利
    'RO': 80,      // 罗马尼亚
    'BG': 70,      // 保加利亚
    'HR': 60,      // 克罗地亚
    'SI': 50,      // 斯洛文尼亚
    'SK': 45,      // 斯洛伐克
    'EE': 40,      // 爱沙尼亚
    'LV': 35,      // 拉脱维亚
    'LT': 30,      // 立陶宛
    'LU': 25,      // 卢森堡
    'MT': 20,      // 马耳他
    'CY': 15,      // 塞浦路斯
  }

  // 评价数据 - 可以直接在这里添加或修改评价
  const reviews = [
    {
      name: '小雨',
      location: language === 'zh' ? '🇨🇳 北京' : '🇨🇳 Beijing',
      content: language === 'zh' 
        ? '我之前去巴黎要是有这个app可以方便好多！！！巴黎好多用户呀！下次一定用！'
        : 'If I had this app when I went to Paris, it would have been so much more convenient!!! There are so many users in Paris! I\'ll definitely use it next time!',
      rating: 5,
      date: language === 'zh' ? '2024年4月' : 'April 2024'
    },
    {
      name: '小吴',
      location: language === 'zh' ? '🇨🇳 上海' : '🇨🇳 Shanghai',
      content: language === 'zh'
        ? '刚刚下载了EuroStay你们变化好大哈哈哈哈，记得一开始只是一个小程序，现在的App好好用好丝滑啊，加油！'
        : 'Just downloaded EuroStay and you\'ve changed so much hahaha! I remember it was just a mini-program at first, but now the App is so smooth and easy to use. Keep it up!',
      rating: 5,
      date: language === 'zh' ? '2024年4月' : 'April 2024'
    },
    {
      name: '小杨',
      location: language === 'zh' ? '🇨🇳 广州' : '🇨🇳 Guangzhou',
      content: language === 'zh'
        ? '加油啊！真的很好看，我在上面已经成功找到3个换宿了！体验都非常棒，我们后来也有联系，等待其中两位朋友来我家玩ing'
        : 'Keep it up! It\'s really great! I\'ve successfully found 3 homestays on the platform! All experiences were amazing, and we\'ve kept in touch. Waiting for two of those friends to come visit me!',
      rating: 5,
      date: language === 'zh' ? '2024年3月' : 'March 2024'
    },
    {
      name: '火星',
      location: language === 'zh' ? '🇨🇳 杭州' : '🇨🇳 Hangzhou',
      content: language === 'zh'
        ? '第一次知道你们的App，非常有趣，马上下载了成为新用户～期待我的第一次换宿体验！'
        : 'First time learning about your App, very interesting! Downloaded it immediately and became a new user. Looking forward to my first homestay experience!',
      rating: 5,
      date: language === 'zh' ? '2024年4月' : 'April 2024'
    },
    {
      name: 'Alex',
      location: language === 'zh' ? '🇳🇱 阿姆斯特丹' : '🇳🇱 Amsterdam',
      content: language === 'zh'
        ? '在EuroStay上找到了超棒的换宿机会！Host非常热情，带我体验了真正的荷兰生活。房间干净整洁，位置也很好。强烈推荐！'
        : 'Found an amazing homestay opportunity on EuroStay! The host was very welcoming and showed me the real Dutch life. The room was clean and tidy, and the location was great. Highly recommended!',
      rating: 5,
      date: language === 'zh' ? '2024年3月' : 'March 2024'
    },
    {
      name: 'Maria',
      location: language === 'zh' ? '🇫🇷 巴黎' : '🇫🇷 Paris',
      content: language === 'zh'
        ? '通过EuroStay在巴黎找到了完美的换宿机会。主人是一位艺术家，不仅提供了舒适的住所，还带我参观了当地的艺术场所。这是一次难忘的经历！'
        : 'Found the perfect homestay opportunity in Paris through EuroStay. The host was an artist who not only provided a comfortable place but also took me to local art venues. An unforgettable experience!',
      rating: 5,
      date: language === 'zh' ? '2024年2月' : 'February 2024'
    }
  ]

  const scrollGallery = (direction) => {
    if (galleryContainerRef.current) {
      const scrollAmount = 350
      galleryContainerRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const scrollPhoneGallery = (direction) => {
    if (phoneGalleryRef.current) {
      const container = phoneGalleryRef.current
      const scrollAmount = 202.5 // 187.5px width + 15px gap
      const currentScroll = container.scrollLeft
      const targetScroll = currentScroll + (direction * scrollAmount)
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
      
      // 滚动后更新中间屏幕
      setTimeout(() => {
        updateCenterPhone()
      }, 100)
    }
  }

  const scrollCommunityGallery = (direction) => {
    if (communityGalleryRef.current) {
      const container = communityGalleryRef.current
      const scrollAmount = 320 // 30rem (300px) 图片宽度 + 2rem (20px) gap
      const currentScroll = container.scrollLeft
      const targetScroll = currentScroll + (direction * scrollAmount)
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  const updateCenterPhone = () => {
    if (phoneGalleryRef.current) {
      const container = phoneGalleryRef.current
      const phoneMockups = container.querySelectorAll('.phone-mockup')
      
      phoneMockups.forEach((mockup) => {
        const rect = mockup.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const centerX = containerRect.left + containerRect.width / 2
        const mockupCenterX = rect.left + rect.width / 2
        const distance = Math.abs(centerX - mockupCenterX)
        const maxDistance = containerRect.width / 2 + 100
        
        if (distance < 150) {
          // 中间的屏幕
          mockup.style.transform = 'scale(1.15)'
          mockup.style.opacity = '1'
          mockup.style.zIndex = '2'
        } else {
          // 两侧的屏幕
          const scale = Math.max(0.85, 1 - (distance / maxDistance) * 0.3)
          const opacity = Math.max(0.6, 1 - (distance / maxDistance) * 0.4)
          mockup.style.transform = `scale(${scale})`
          mockup.style.opacity = opacity
          mockup.style.zIndex = '1'
        }
      })
    }
  }

  // 初始化时设置中间屏幕
  useEffect(() => {
    if (phoneGalleryRef.current) {
      const container = phoneGalleryRef.current
      // 初始化时滚动到中间
      setTimeout(() => {
        const scrollWidth = container.scrollWidth - container.clientWidth
        container.scrollLeft = scrollWidth / 2
        updateCenterPhone()
      }, 100)
      
      // 监听滚动事件
      container.addEventListener('scroll', updateCenterPhone)
      
      return () => {
        container.removeEventListener('scroll', updateCenterPhone)
      }
    }
  }, [])

  // 初始化社群gallery，让第一张图片居中
  useEffect(() => {
    if (communityGalleryRef.current) {
      const container = communityGalleryRef.current
      // 初始化时滚动到开始位置（第一张图片已经通过padding居中）
      setTimeout(() => {
        container.scrollLeft = 0
      }, 100)
    }
  }, [])

  // 步骤动画触发
  useEffect(() => {
    if (stepsContainerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // 为整个流程容器添加动画类
              const stepsFlow = entry.target.closest('.steps-flow')
              if (stepsFlow) {
                stepsFlow.classList.add('animate')
              }
              // 为每个步骤项添加延迟动画
              const stepItems = entry.target.querySelectorAll('.step-item')
              const connectors = entry.target.querySelectorAll('.step-connector')
              stepItems.forEach((item, index) => {
                setTimeout(() => {
                  item.classList.add('animate')
                }, index * 150 + 300)
              })
              connectors.forEach((connector, index) => {
                setTimeout(() => {
                  connector.classList.add('animate')
                }, (index + 1) * 150 + 450)
              })
            }
          })
        },
        { threshold: 0.2 }
      )
      observer.observe(stepsContainerRef.current)
      return () => observer.disconnect()
    }
  }, [])

  const copyWeChatId = async () => {
    const wechatId = 'EuroStay' // 可以替换为实际的微信号
    try {
      await navigator.clipboard.writeText(wechatId)
      alert(language === 'zh' ? '微信号已复制到剪贴板！' : 'WeChat ID copied to clipboard!')
    } catch (err) {
      // 降级方案：使用传统方法
      const textArea = document.createElement('textarea')
      textArea.value = wechatId
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        alert(language === 'zh' ? '微信号已复制到剪贴板！' : 'WeChat ID copied to clipboard!')
      } catch (err) {
        alert(language === 'zh' ? '复制失败，请手动复制：' + wechatId : 'Copy failed, please copy manually: ' + wechatId)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-main">
          <div className="hero-content">
            <div className="hero-title-wrapper">
              <div className="hero-title-line">
                <img 
                  src={`${import.meta.env.BASE_URL}images/globe/title.png`} 
                  alt="EURO STAY" 
                  className="hero-title-image"
                />
                <span className="hero-title-tag">世界不贵</span>
              </div>
            </div>
            <p className="hero-subtitle">{t.heroSubtitle}</p>
            <div className="hero-buttons">
              <a
                href="#"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault()
                  alert(language === 'zh' ? '下载链接将在这里添加' : 'Download link will be added here')
                }}
              >
                {t.downloadIOS}
              </a>
              <a
                href="#"
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault()
                  alert(language === 'zh' ? '下载链接将在这里添加' : 'Download link will be added here')
                }}
              >
                {t.downloadAndroid}
              </a>
            </div>
          </div>
          <div className="hero-image">
            <Globe3D 
              stories={[]} 
              countryUserCounts={countryUserCounts}
              language={language}
            />
            <div className="hero-links">
              <Link to="/products" className="link-text">
                {t.learnMore} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-stats">
        <div className="stat-item">
          <div className="stat-number stat-purple">2024</div>
          <div className="stat-label">{language === 'zh' ? '至今' : 'To Date'}</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-number stat-yellow">
            <CountUpNumber value="100万+" duration={2000} />
          </div>
          <div className="stat-label">{language === 'zh' ? '话题热度' : 'Topic Popularity'}</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-number stat-yellow">
            <CountUpNumber value="30000+" duration={2000} />
          </div>
          <div className="stat-label">{language === 'zh' ? '换宿会员' : 'Community Members'}</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-number stat-yellow">
            <CountUpNumber value="30+" duration={1500} />
          </div>
          <div className="stat-label">{language === 'zh' ? '覆盖国家' : 'Countries Covered'}</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-number stat-yellow">
            <CountUpNumber value="500+" duration={1500} />
          </div>
          <div className="stat-label">{language === 'zh' ? '房源总量' : 'House Resources'}</div>
        </div>
      </section>

      <section className="product-section">
        <div className="container">
          <div className="product-content">
            <div className="steps-flow">
              <h2 className="steps-title">{translations[language].products.guideTitle}</h2>
              <div className="steps-container" ref={stepsContainerRef}>
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-title">{translations[language].products.step1Title}</div>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-title">{translations[language].products.step2Title}</div>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-title">{translations[language].products.step3Title}</div>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                  <div className="step-number">4</div>
                  <div className="step-title">{translations[language].products.step4Title}</div>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                  <div className="step-number">5</div>
                  <div className="step-title">{translations[language].products.step5Title}</div>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                  <div className="step-number">6</div>
                  <div className="step-title">{translations[language].products.step6Title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">{t.featuresTitle}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-image feature-phone-gallery">
                <button className="phone-nav-btn phone-nav-prev" onClick={() => scrollPhoneGallery(-1)}>
                  ‹
                </button>
                <div className="phone-gallery-scroll" ref={phoneGalleryRef}>
                  <div className="phone-gallery-inner">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <div key={num} className="phone-mockup">
                        <div className="phone-screen-mockup">
                          <div className="phone-dynamic-island"></div>
                          <img 
                            src={`${import.meta.env.BASE_URL}images/home/phone-screens/${num}.png`}
                            alt={language === 'zh' ? `界面 ${num}` : `Screen ${num}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="phone-nav-btn phone-nav-next" onClick={() => scrollPhoneGallery(1)}>
                  ›
                </button>
              </div>
              <div className="feature-card-content">
                <h3>{t.feature1Title}</h3>
                <p>{t.feature1Desc}</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-image feature-image-grid">
                <div className="image-grid-container">
                  <div className="grid-image grid-image-1">
                    <img 
                      src={`${import.meta.env.BASE_URL}images/home/features/security/1.jpeg`}
                      alt={language === 'zh' ? '图片 1' : 'Image 1'}
                      className="grid-image-img"
                    />
                  </div>
                  <div className="grid-image grid-image-2">
                    <img 
                      src={`${import.meta.env.BASE_URL}images/home/features/security/2.jpeg`}
                      alt={language === 'zh' ? '图片 2' : 'Image 2'}
                      className="grid-image-img"
                    />
                  </div>
                  <div className="grid-image grid-image-3">
                    <img 
                      src={`${import.meta.env.BASE_URL}images/home/features/security/3.jpeg`}
                      alt={language === 'zh' ? '图片 3' : 'Image 3'}
                      className="grid-image-img"
                    />
                  </div>
                  <div className="grid-image grid-image-4">
                    <img 
                      src={`${import.meta.env.BASE_URL}images/home/features/security/4.jpeg`}
                      alt={language === 'zh' ? '图片 4' : 'Image 4'}
                      className="grid-image-img"
                    />
                  </div>
                </div>
              </div>
              <div className="feature-card-content">
                <h3>{t.feature2Title}</h3>
                <p>{t.feature2Desc}</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-image feature-community-gallery">
                <button className="community-nav-btn community-nav-prev" onClick={() => scrollCommunityGallery(-1)}>
                  ‹
                </button>
                <div className="community-gallery-scroll" ref={communityGalleryRef}>
                  <div className="community-gallery-inner">
                    <div className="community-image-item">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/home/features/community/1.jpeg`}
                        alt={language === 'zh' ? '社群图片 1' : 'Community Image 1'}
                        className="community-image"
                      />
                      <div className="community-image-info">
                        <div className="community-info-location">{t.communityGallery1Location}</div>
                        <div className="community-info-theme">{t.communityGallery1Theme}</div>
                      </div>
                    </div>
                    <div className="community-image-item">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/home/features/community/2.jpeg`}
                        alt={language === 'zh' ? '社群图片 2' : 'Community Image 2'}
                        className="community-image"
                      />
                      <div className="community-image-info">
                        <div className="community-info-location">{t.communityGallery2Location}</div>
                        <div className="community-info-theme">{t.communityGallery2Theme}</div>
                      </div>
                    </div>
                    <div className="community-image-item">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/home/features/community/3.jpeg`}
                        alt={language === 'zh' ? '社群图片 3' : 'Community Image 3'}
                        className="community-image"
                      />
                      <div className="community-image-info">
                        <div className="community-info-location">{t.communityGallery3Location}</div>
                        <div className="community-info-theme">{t.communityGallery3Theme}</div>
                      </div>
                    </div>
                    <div className="community-image-item">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/home/features/community/4.jpeg`}
                        alt={language === 'zh' ? '社群图片 4' : 'Community Image 4'}
                        className="community-image"
                      />
                      <div className="community-image-info">
                        <div className="community-info-location">{t.communityGallery4Location}</div>
                        <div className="community-info-theme">{t.communityGallery4Theme}</div>
                      </div>
                    </div>
                    <div className="community-image-item">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/home/features/community/5.jpeg`}
                        alt={language === 'zh' ? '社群图片 5' : 'Community Image 5'}
                        className="community-image"
                      />
                      <div className="community-image-info">
                        <div className="community-info-location">{t.communityGallery5Location}</div>
                        <div className="community-info-theme">{t.communityGallery5Theme}</div>
                      </div>
                    </div>
                    <div className="community-image-item">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/home/features/community/6.jpeg`}
                        alt={language === 'zh' ? '社群图片 6' : 'Community Image 6'}
                        className="community-image"
                      />
                      <div className="community-image-info">
                        <div className="community-info-location">{t.communityGallery6Location}</div>
                        <div className="community-info-theme">{t.communityGallery6Theme}</div>
                      </div>
                    </div>
                    <div className="community-image-item">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/home/features/community/7.jpeg`}
                        alt={language === 'zh' ? '社群图片 7' : 'Community Image 7'}
                        className="community-image"
                      />
                      <div className="community-image-info">
                        <div className="community-info-location">{t.communityGallery7Location}</div>
                        <div className="community-info-theme">{t.communityGallery7Theme}</div>
                      </div>
                    </div>
                    <div className="community-image-item">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/home/features/community/8.jpeg`}
                        alt={language === 'zh' ? '社群图片 8' : 'Community Image 8'}
                        className="community-image"
                      />
                      <div className="community-image-info">
                        <div className="community-info-location">{t.communityGallery8Location}</div>
                        <div className="community-info-theme">{t.communityGallery8Theme}</div>
                      </div>
                    </div>
                    <div className="community-image-item">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/home/features/community/9.jpeg`}
                        alt={language === 'zh' ? '社群图片 9' : 'Community Image 9'}
                        className="community-image"
                      />
                      <div className="community-image-info">
                        <div className="community-info-location">{t.communityGallery9Location}</div>
                        <div className="community-info-theme">{t.communityGallery9Theme}</div>
                      </div>
                    </div>
                    <div className="community-image-item">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/home/features/community/10.jpeg`}
                        alt={language === 'zh' ? '社群图片 10' : 'Community Image 10'}
                        className="community-image"
                      />
                      <div className="community-image-info">
                        <div className="community-info-location">{t.communityGallery10Location}</div>
                        <div className="community-info-theme">{t.communityGallery10Theme}</div>
                      </div>
                    </div>
                    <div className="community-image-item">
                      <img 
                        src={`${import.meta.env.BASE_URL}images/home/features/community/11.jpeg`}
                        alt={language === 'zh' ? '社群图片 11' : 'Community Image 11'}
                        className="community-image"
                      />
                      <div className="community-image-info">
                        <div className="community-info-location">{t.communityGallery11Location}</div>
                        <div className="community-info-theme">{t.communityGallery11Theme}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="community-nav-btn community-nav-next" onClick={() => scrollCommunityGallery(1)}>
                  ›
                </button>
              </div>
              <div className="feature-card-content">
                <h3>{t.feature3Title}</h3>
                <p>{t.feature3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="vision">
        <div className="container">
          <div className="vision-header">
            <h2 className="vision-title-primary">{t.visionTitlePrimary}</h2>
            <h2 className="vision-title-secondary">{t.visionTitleSecondary}</h2>
            <p className="vision-tagline">{t.visionTagline}</p>
          </div>

          <div className="vision-description">
            <p>{t.visionDesc1}</p>
            <p>{t.visionDesc2}</p>
            <p>{t.visionDesc3}</p>
          </div>


          <div className="vision-gallery">
            <div className="gallery-container" ref={galleryContainerRef}>
              <div className="gallery-track">
                {hostCardImages.map((card, index) => (
                  <div key={index} className="host-card">
                    <div className="host-card-image">
                      <img 
                        src={card.src} 
                        alt={card.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="gallery-btn gallery-btn-prev" onClick={() => scrollGallery(-1)}>
              ‹
            </button>
            <button className="gallery-btn gallery-btn-next" onClick={() => scrollGallery(1)}>
              ›
            </button>
          </div>


        </div>
      </section>

      <section className="reviews-section">
        <h2 className="reviews-title">{t.reviewsTitle}</h2>
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} language={language} />
          ))}
        </div>
        <div className="vision-cta">
            <p>{t.visionCta1}</p>
            <p>{t.visionCta2}</p>
            <button className="btn-copy-wechat" onClick={copyWeChatId}>
              {language === 'zh' ? '复制微信号' : 'Copy WeChat ID'}
            </button>
          </div>
      </section>

    </div>
  )
}

export default Home
