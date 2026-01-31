import React, { useRef, useEffect, useState, useMemo, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../translations'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import FadeSection from '../components/FadeSection'
import './Home.css'

const Globe3D = lazy(() => import('../components/Globe3D'))

// 数字递增动画组件
const CountUpNumber = ({ value, duration = 2000 }) => {
  const elementRef = useRef(null)
  const { value: displayValue } = useCountUp(value, duration, true, elementRef)
  return <span ref={elementRef}>{displayValue}</span>
}

// 评价卡片组件
const ReviewCard = ({ review, language }) => {
  const base = import.meta.env.BASE_URL || ''
  const avatarUrl = review.avatar ? (review.avatar.startsWith('http') ? review.avatar : base + review.avatar) : null
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={review.name} loading="lazy" decoding="async" />
          ) : (
            review.name.charAt(0)
          )}
        </div>
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

  // 星星随机基准旋转角（挂载时生成一次，避免重复）
  const starRotations = useMemo(
    () => Array.from({ length: 10 }, () => Math.round((Math.random() - 0.5) * 80)),
    []
  )

  // 进入视口 1/3 处淡入，离开视口 1/8 处淡出（常见滚动交互）；首屏 hero+stats 不淡出
  const revealRootMargin = '-33.333% 0px -12.5% 0px'
  const [heroRef, heroInView] = useInView({ threshold: 0, rootMargin: revealRootMargin, once: true })
  const [statsRef, statsInView] = useInView({ threshold: 0, rootMargin: revealRootMargin, once: true })
  const [productRef, productInView] = useInView({ threshold: 0, rootMargin: revealRootMargin, once: false })
  const [featuresRef, featuresInView] = useInView({ threshold: 0, rootMargin: revealRootMargin, once: false })
  const [visionRef, visionInView] = useInView({ threshold: 0, rootMargin: revealRootMargin, once: false })
  const [reviewsRef, reviewsInView] = useInView({ threshold: 0, rootMargin: revealRootMargin, once: false })

  // 懒加载区块：进入过视口后不再卸载，仅用 in-view 控制淡入淡出
  const [productLoaded, setProductLoaded] = useState(false)
  const [featuresLoaded, setFeaturesLoaded] = useState(false)
  const [visionLoaded, setVisionLoaded] = useState(false)
  const [reviewsLoaded, setReviewsLoaded] = useState(false)
  const [heroRevealed, setHeroRevealed] = useState(false)
  const [statsRevealed, setStatsRevealed] = useState(false)
  const [productRevealed, setProductRevealed] = useState(false)
  const [featuresRevealed, setFeaturesRevealed] = useState(false)
  const [visionRevealed, setVisionRevealed] = useState(false)
  const [reviewsRevealed, setReviewsRevealed] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const copyToastTimer = useRef(null)
  const productFadeOutTimer = useRef(null)
  const featuresFadeOutTimer = useRef(null)
  const visionFadeOutTimer = useRef(null)
  const reviewsFadeOutTimer = useRef(null)
  const FADE_OUT_DELAY_MS = 180

  useEffect(() => { if (productInView) setProductLoaded(true) }, [productInView])
  useEffect(() => { if (featuresInView) setFeaturesLoaded(true) }, [featuresInView])
  useEffect(() => { if (visionInView) setVisionLoaded(true) }, [visionInView])
  useEffect(() => { if (reviewsInView) setReviewsLoaded(true) }, [reviewsInView])

  useEffect(() => {
    return () => { if (copyToastTimer.current) clearTimeout(copyToastTimer.current) }
  }, [])

  // 首屏（hero + 数据横幅）：只淡入、不淡出
  useEffect(() => {
    if (heroInView) {
      const id = requestAnimationFrame(() => setHeroRevealed(true))
      return () => cancelAnimationFrame(id)
    }
  }, [heroInView])
  useEffect(() => {
    if (statsInView) {
      const id = requestAnimationFrame(() => setStatsRevealed(true))
      return () => cancelAnimationFrame(id)
    }
  }, [statsInView])
  // 其余区块：进入视口下一帧淡入；离开视口延迟 180ms 再淡出
  useEffect(() => {
    if (!productLoaded) return
    if (productInView) {
      if (productFadeOutTimer.current) { clearTimeout(productFadeOutTimer.current); productFadeOutTimer.current = null }
      const id = requestAnimationFrame(() => setProductRevealed(true))
      return () => cancelAnimationFrame(id)
    }
    productFadeOutTimer.current = setTimeout(() => { productFadeOutTimer.current = null; setProductRevealed(false) }, FADE_OUT_DELAY_MS)
    return () => { if (productFadeOutTimer.current) { clearTimeout(productFadeOutTimer.current); productFadeOutTimer.current = null } }
  }, [productLoaded, productInView])
  useEffect(() => {
    if (!featuresLoaded) return
    if (featuresInView) {
      if (featuresFadeOutTimer.current) { clearTimeout(featuresFadeOutTimer.current); featuresFadeOutTimer.current = null }
      const id = requestAnimationFrame(() => setFeaturesRevealed(true))
      return () => cancelAnimationFrame(id)
    }
    featuresFadeOutTimer.current = setTimeout(() => { featuresFadeOutTimer.current = null; setFeaturesRevealed(false) }, FADE_OUT_DELAY_MS)
    return () => { if (featuresFadeOutTimer.current) { clearTimeout(featuresFadeOutTimer.current); featuresFadeOutTimer.current = null } }
  }, [featuresLoaded, featuresInView])
  useEffect(() => {
    if (!visionLoaded) return
    if (visionInView) {
      if (visionFadeOutTimer.current) { clearTimeout(visionFadeOutTimer.current); visionFadeOutTimer.current = null }
      const id = requestAnimationFrame(() => setVisionRevealed(true))
      return () => cancelAnimationFrame(id)
    }
    visionFadeOutTimer.current = setTimeout(() => { visionFadeOutTimer.current = null; setVisionRevealed(false) }, FADE_OUT_DELAY_MS)
    return () => { if (visionFadeOutTimer.current) { clearTimeout(visionFadeOutTimer.current); visionFadeOutTimer.current = null } }
  }, [visionLoaded, visionInView])
  useEffect(() => {
    if (!reviewsLoaded) return
    if (reviewsInView) {
      if (reviewsFadeOutTimer.current) { clearTimeout(reviewsFadeOutTimer.current); reviewsFadeOutTimer.current = null }
      const id = requestAnimationFrame(() => setReviewsRevealed(true))
      return () => cancelAnimationFrame(id)
    }
    reviewsFadeOutTimer.current = setTimeout(() => { reviewsFadeOutTimer.current = null; setReviewsRevealed(false) }, FADE_OUT_DELAY_MS)
    return () => { if (reviewsFadeOutTimer.current) { clearTimeout(reviewsFadeOutTimer.current); reviewsFadeOutTimer.current = null } }
  }, [reviewsLoaded, reviewsInView])

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

  // 评价数据 - 可以直接在这里添加或修改评价；avatar 为头像 URL（外链或 public 下路径）
  const reviews = [
    {
      name: '小雨',
      avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=xiaoyu&size=128',
      location: language === 'zh' ? '🇨🇳 北京' : '🇨🇳 Beijing',
      content: language === 'zh' 
        ? '我之前去巴黎要是有这个app可以方便好多！！！巴黎好多用户呀！下次一定用！'
        : 'If I had this app when I went to Paris, it would have been so much more convenient!!! There are so many users in Paris! I\'ll definitely use it next time!',
      rating: 5,
      date: language === 'zh' ? '2024年4月' : 'April 2024'
    },
    {
      name: '小吴',
      avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=xiaowu&size=128',
      location: language === 'zh' ? '🇨🇳 上海' : '🇨🇳 Shanghai',
      content: language === 'zh'
        ? '刚刚下载了EuroStay你们变化好大哈哈哈哈，记得一开始只是一个小程序，现在的App好好用好丝滑啊，加油！'
        : 'Just downloaded EuroStay and you\'ve changed so much hahaha! I remember it was just a mini-program at first, but now the App is so smooth and easy to use. Keep it up!',
      rating: 5,
      date: language === 'zh' ? '2024年4月' : 'April 2024'
    },
    {
      name: '小杨',
      avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=xiaoyang&size=128',
      location: language === 'zh' ? '🇨🇳 广州' : '🇨🇳 Guangzhou',
      content: language === 'zh'
        ? '加油啊！真的很好看，我在上面已经成功找到3个换宿了！体验都非常棒，我们后来也有联系，等待其中两位朋友来我家玩ing'
        : 'Keep it up! It\'s really great! I\'ve successfully found 3 homestays on the platform! All experiences were amazing, and we\'ve kept in touch. Waiting for two of those friends to come visit me!',
      rating: 5,
      date: language === 'zh' ? '2024年3月' : 'March 2024'
    },
    {
      name: '火星',
      avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=huoxing&size=128',
      location: language === 'zh' ? '🇨🇳 杭州' : '🇨🇳 Hangzhou',
      content: language === 'zh'
        ? '第一次知道你们的App，非常有趣，马上下载了成为新用户～期待我的第一次换宿体验！'
        : 'First time learning about your App, very interesting! Downloaded it immediately and became a new user. Looking forward to my first homestay experience!',
      rating: 5,
      date: language === 'zh' ? '2024年4月' : 'April 2024'
    },
    {
      name: 'Alex',
      avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=alex&size=128',
      location: language === 'zh' ? '🇳🇱 阿姆斯特丹' : '🇳🇱 Amsterdam',
      content: language === 'zh'
        ? '在EuroStay上找到了超棒的换宿机会！Host非常热情，带我体验了真正的荷兰生活。房间干净整洁，位置也很好。强烈推荐！'
        : 'Found an amazing homestay opportunity on EuroStay! The host was very welcoming and showed me the real Dutch life. The room was clean and tidy, and the location was great. Highly recommended!',
      rating: 5,
      date: language === 'zh' ? '2024年3月' : 'March 2024'
    },
    {
      name: 'Maria',
      avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=maria&size=128',
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
      const scrollAmount = 700
      galleryContainerRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const scrollPhoneGallery = (direction) => {
    if (!phoneGalleryRef.current) return
    const container = phoneGalleryRef.current
    const scrollAmount = 225 // 21rem width + 1.5rem gap (主图放大)
    const maxScroll = container.scrollWidth - container.clientWidth
    
    let targetScroll = container.scrollLeft + (direction * scrollAmount)
    // 可循环
    if (targetScroll <= 0 && direction < 0) {
      targetScroll = maxScroll
    } else if (targetScroll >= maxScroll && direction > 0) {
      targetScroll = 0
    } else {
      targetScroll = Math.max(0, Math.min(targetScroll, maxScroll))
    }
    
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
    
    setTimeout(() => updateCenterPhone(), 100)
  }

  const scrollCommunityGallery = (direction) => {
    if (communityGalleryRef.current) {
      const container = communityGalleryRef.current
      const scrollAmount = 380 // 36rem width + 2rem gap
      const currentScroll = container.scrollLeft
      const targetScroll = currentScroll + (direction * scrollAmount)
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  const updateCenterPhone = () => {
    if (!phoneGalleryRef.current) return
    const container = phoneGalleryRef.current
    const phoneMockups = container.querySelectorAll('.phone-mockup')
    const containerRect = container.getBoundingClientRect()
    const centerX = containerRect.left + containerRect.width / 2
    const maxDistance = containerRect.width / 2 + 80
    
    phoneMockups.forEach((mockup) => {
      const rect = mockup.getBoundingClientRect()
      const mockupCenterX = rect.left + rect.width / 2
      const distance = Math.abs(centerX - mockupCenterX)
      
      if (distance < 120) {
        // 中间的屏幕 - 主图放大
        mockup.style.transform = 'scale(1.28)'
        mockup.style.opacity = '1'
        mockup.style.zIndex = '2'
      } else {
        // 两侧的屏幕 - 更小、更淡出
        const scale = Math.max(0.65, 1 - (distance / maxDistance) * 0.45)
        const opacity = Math.max(0.3, 1 - (distance / maxDistance) * 0.7)
        mockup.style.transform = `scale(${scale})`
        mockup.style.opacity = opacity
        mockup.style.zIndex = '1'
      }
    })
  }

  // 初始化时第一页第一个展示，可循环（features 懒加载后才存在）
  useEffect(() => {
    if (!featuresLoaded || !phoneGalleryRef.current) return
    const container = phoneGalleryRef.current
    setTimeout(() => {
      container.scrollLeft = 0
      updateCenterPhone()
    }, 100)
    container.addEventListener('scroll', updateCenterPhone)
    return () => container.removeEventListener('scroll', updateCenterPhone)
  }, [featuresLoaded])

  // 初始化社群 gallery（features 懒加载后才存在）
  useEffect(() => {
    if (!featuresLoaded || !communityGalleryRef.current) return
    const container = communityGalleryRef.current
    setTimeout(() => { container.scrollLeft = 0 }, 100)
  }, [featuresLoaded])

  // 步骤动画：与整块一致，在「1/3 可见带」内才触发，依次出现（标题→1→2→…→6）
  useEffect(() => {
    if (!productLoaded || !stepsContainerRef.current) return
    const el = stepsContainerRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepsFlow = entry.target.closest('.steps-flow')
            if (stepsFlow) stepsFlow.classList.add('animate')
            const stepItems = entry.target.querySelectorAll('.step-item')
            stepItems.forEach((item, index) => {
              setTimeout(() => item.classList.add('animate'), index * 150 + 300)
            })
          }
        })
      },
      { threshold: 0.15, rootMargin: '-33.333% 0px -12.5% 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [productLoaded, productInView])

  const copyWeChatId = async () => {
    const wechatId = 'EuroStay'
    try {
      await navigator.clipboard.writeText(wechatId)
      if (copyToastTimer.current) clearTimeout(copyToastTimer.current)
      setShowCopyToast(true)
      copyToastTimer.current = setTimeout(() => {
        setShowCopyToast(false)
        copyToastTimer.current = null
      }, 2500)
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = wechatId
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        if (copyToastTimer.current) clearTimeout(copyToastTimer.current)
        setShowCopyToast(true)
        copyToastTimer.current = setTimeout(() => {
          setShowCopyToast(false)
          copyToastTimer.current = null
        }, 2500)
      } catch (e) {
        alert(language === 'zh' ? '复制失败，请手动复制：' + wechatId : 'Copy failed, please copy manually: ' + wechatId)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="home">
      <section className={`hero section-reveal ${heroRevealed ? 'in-view' : ''}`}>
        <div className="hero-main">
          <div className="hero-content">
            <div className="hero-title-wrapper">
              <p className="hero-title-slogan">{t.heroSlogan}</p>
              <div className="hero-title-line">
                <div className="hero-title-images">
                  <img
                    src={`${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/images/globe/2.svg`}
                    alt=""
                    className="hero-title-image hero-title-image-1"
                    decoding="async"
                  />
                  <img
                    src={`${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}/images/globe/1.svg`}
                    alt=""
                    className="hero-title-image hero-title-image-2"
                    decoding="async"
                  />
                </div>
                <span className="hero-title-tag">{t.heroTag ?? (language === 'zh' ? '世界不贵' : 'World not pricey')}</span>
              </div>
            </div>
            <p className="hero-subtitle">{t.heroSubtitle}</p>
            <div className="hero-links">
              <Link to="/products" className="link-text">
                {t.learnMore} →
              </Link>
            </div>
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
          <div className="hero-image" ref={heroRef}>
            {heroInView && (
              <Suspense fallback={<div className="globe-placeholder" aria-hidden />}>
                <Globe3D 
                  stories={[]} 
                  countryUserCounts={countryUserCounts}
                  language={language}
                />
              </Suspense>
            )}
          </div>
        </div>
      </section>

      <section ref={statsRef} className={`hero-stats home-stats-below-globe section-reveal ${statsRevealed ? 'in-view' : ''}`}>
        <div className="stat-column">
          <div className="stat-number">2024</div>
          <div className="stat-label">{language === 'zh' ? '至今' : 'To Date'}</div>
        </div>
        <div className="stat-column">
          <div className="stat-number">
            <CountUpNumber value="100万+" duration={2000} />
          </div>
          <div className="stat-label">{language === 'zh' ? '话题热度' : 'Topic Popularity'}</div>
        </div>
        <div className="stat-column">
          <div className="stat-number">
            <CountUpNumber value="30000+" duration={2000} />
          </div>
          <div className="stat-label">{language === 'zh' ? '换宿会员' : 'Community Members'}</div>
        </div>
        <div className="stat-column">
          <div className="stat-number">
            <CountUpNumber value="30+" duration={1500} />
          </div>
          <div className="stat-label">{language === 'zh' ? '覆盖国家' : 'Countries Covered'}</div>
        </div>
        <div className="stat-column">
          <div className="stat-number">
            <CountUpNumber value="500+" duration={1500} />
          </div>
          <div className="stat-label">{language === 'zh' ? '房源总量' : 'House Resources'}</div>
        </div>
      </section>

      <div ref={productRef} className="lazy-section-root">
        {!productLoaded ? (
          <div className="lazy-section-placeholder" style={{ minHeight: '50vh' }} aria-hidden />
        ) : (
          <section className={`product-section section-reveal ${productRevealed ? 'in-view' : ''}`}>
            <div className="container">
              <div className="product-content">
                <div className="steps-flow" ref={stepsContainerRef}>
                  <h2 className="steps-title">{translations[language].products.guideTitle}</h2>
                  <p className="steps-subtitle">{translations[language].products.guideSubtitle}</p>
                  <div className="guide-modules">
                    <div className="guide-module guide-module-title-first">
                      <div className="guide-module-content">
                        <h3 className="guide-module-title">{translations[language].products.guideModule1Title}</h3>
                      </div>
                      <div className="guide-module-image-wrap">
                        <div className="guide-module-image" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/home/guide/1.jpg)` }} />
                        <div className="guide-module-image-overlay">
                          <div className="guide-module-image-overlay-inner">
                            <span className="guide-module-image-overlay-desc">{translations[language].products.guideModule1Desc1}</span>
                            <span className="guide-module-image-overlay-desc">{translations[language].products.guideModule1Desc2}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="guide-module guide-module-title-first">
                      <div className="guide-module-content">
                        <h3 className="guide-module-title">{translations[language].products.guideModule2Title}</h3>
                      </div>
                      <div className="guide-module-image-wrap">
                        <div className="guide-module-image" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/home/guide/2.jpg)` }} />
                        <div className="guide-module-image-overlay">
                          <div className="guide-module-image-overlay-inner">
                            <span className="guide-module-image-overlay-desc">{translations[language].products.guideModule2Desc1}</span>
                            <span className="guide-module-image-overlay-desc">{translations[language].products.guideModule2Desc2}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <div ref={featuresRef} className="lazy-section-root">
        {!featuresLoaded ? (
          <div className="lazy-section-placeholder" style={{ minHeight: '70vh' }} aria-hidden />
        ) : (
      <section className={`features section-reveal ${featuresRevealed ? 'in-view' : ''}`}>
        <div className="container">
          <h2 className="section-title">{t.featuresTitle}</h2>
          <p className="features-subtitle">{t.featuresSubtitle}</p>
          <div className="features-grid">
            <FadeSection className="feature-card">
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
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
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
                <div className="feature-card-text-wrap">
                  <img src={`${import.meta.env.BASE_URL}images/cursor/3.png`} className="feature-card-star-bg feature-card-star-bg--1" alt="" aria-hidden style={{ '--star-rotate': `${starRotations[0]}deg` }} />
                  <img src={`${import.meta.env.BASE_URL}images/cursor/3.png`} className="feature-card-star-bg feature-card-star-bg--2" alt="" aria-hidden style={{ '--star-rotate': `${starRotations[1]}deg` }} />
                  <img src={`${import.meta.env.BASE_URL}images/cursor/3.png`} className="feature-card-star-bg feature-card-star-bg--3" alt="" aria-hidden style={{ '--star-rotate': `${starRotations[2]}deg` }} />
                  <h3>
                    {(t.feature1Title.split('\n').length > 1) ? (
                      <>
                        <span className="feature-title-line1">{t.feature1Title.split('\n')[0]}</span>
                        <br />
                        <span className="feature-title-line2">{t.feature1Title.split('\n')[1]}</span>
                      </>
                    ) : t.feature1Title}
                  </h3>
                  <p className="feature-card-subtitle">{t.feature1Subtitle}</p>
                  <p className="feature-card-desc feature-card-desc-small">{t.feature1Desc}</p>
                </div>
              </div>
            </FadeSection>
            <FadeSection className="feature-card">
              <div className="feature-image feature-image-grid">
                <div className="image-grid-container">
                  <div className="grid-image grid-image-1">
                    <img 
                      src={`${import.meta.env.BASE_URL}images/home/features/security/1.jpeg`}
                      alt={language === 'zh' ? '图片 1' : 'Image 1'}
                      className="grid-image-img"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  </div>
                  <div className="grid-image grid-image-2">
                    <img 
                      src={`${import.meta.env.BASE_URL}images/home/features/security/2.jpeg`}
                      alt={language === 'zh' ? '图片 2' : 'Image 2'}
                      className="grid-image-img"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  </div>
                  <div className="grid-image grid-image-3">
                    <img 
                      src={`${import.meta.env.BASE_URL}images/home/features/security/3.jpeg`}
                      alt={language === 'zh' ? '图片 3' : 'Image 3'}
                      className="grid-image-img"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  </div>
                  <div className="grid-image grid-image-4">
                    <img 
                      src={`${import.meta.env.BASE_URL}images/home/features/security/4.jpeg`}
                      alt={language === 'zh' ? '图片 4' : 'Image 4'}
                      className="grid-image-img"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  </div>
                </div>
              </div>
              <div className="feature-card-content">
                <div className="feature-card-text-wrap feature-card-text-wrap--right">
                  <img src={`${import.meta.env.BASE_URL}images/cursor/3.png`} className="feature-card-star-bg feature-card-star-bg--1" alt="" aria-hidden style={{ '--star-rotate': `${starRotations[3]}deg` }} />
                  <img src={`${import.meta.env.BASE_URL}images/cursor/3.png`} className="feature-card-star-bg feature-card-star-bg--2" alt="" aria-hidden style={{ '--star-rotate': `${starRotations[4]}deg` }} />
                  <img src={`${import.meta.env.BASE_URL}images/cursor/3.png`} className="feature-card-star-bg feature-card-star-bg--3" alt="" aria-hidden style={{ '--star-rotate': `${starRotations[5]}deg` }} />
                  <h3>
                    {(t.feature2Title.split('\n').length > 1) ? (
                      <>
                        <span className="feature-title-line1">{t.feature2Title.split('\n')[0]}</span>
                        <br />
                        <span className="feature-title-line2">{t.feature2Title.split('\n')[1]}</span>
                      </>
                    ) : t.feature2Title}
                  </h3>
                  <p className="feature-card-subtitle">{t.feature2Subtitle}</p>
                  <p className="feature-card-desc feature-card-desc-small">{t.feature2Desc}</p>
                </div>
              </div>
            </FadeSection>
            <FadeSection className="feature-card">
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
                <div className="feature-card-text-wrap feature-card-text-wrap--left">
                  <img src={`${import.meta.env.BASE_URL}images/cursor/3.png`} className="feature-card-star-bg feature-card-star-bg--1" alt="" aria-hidden style={{ '--star-rotate': `${starRotations[6]}deg` }} />
                  <img src={`${import.meta.env.BASE_URL}images/cursor/3.png`} className="feature-card-star-bg feature-card-star-bg--2" alt="" aria-hidden style={{ '--star-rotate': `${starRotations[7]}deg` }} />
                  <img src={`${import.meta.env.BASE_URL}images/cursor/3.png`} className="feature-card-star-bg feature-card-star-bg--3" alt="" aria-hidden style={{ '--star-rotate': `${starRotations[8]}deg` }} />
                  <img src={`${import.meta.env.BASE_URL}images/cursor/3.png`} className="feature-card-star-bg feature-card-star-bg--4" alt="" aria-hidden style={{ '--star-rotate': `${starRotations[9]}deg` }} />
                  <h3>
                    {(t.feature3Title.split('\n').length > 1) ? (
                      <>
                        <span className="feature-title-line1">{t.feature3Title.split('\n')[0]}</span>
                        <br />
                        <span className="feature-title-line2">{t.feature3Title.split('\n')[1]}</span>
                      </>
                    ) : t.feature3Title}
                  </h3>
                  <p className="feature-card-subtitle">{t.feature3Subtitle}</p>
                  <p className="feature-card-desc feature-card-desc-small">{t.feature3Desc}</p>
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>
        )}
      </div>

      <div ref={visionRef} className="lazy-section-root">
        {!visionLoaded ? (
          <div className="lazy-section-placeholder" style={{ minHeight: '60vh' }} aria-hidden />
        ) : (
      <section className={`vision section-reveal ${visionRevealed ? 'in-view' : ''}`}>
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
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
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
        )}
      </div>

      <div ref={reviewsRef} className="lazy-section-root">
        {!reviewsLoaded ? (
          <div className="lazy-section-placeholder" style={{ minHeight: '55vh' }} aria-hidden />
        ) : (
      <section className={`reviews-section section-reveal ${reviewsRevealed ? 'in-view' : ''}`}>
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
        )}
      </div>

      {/* 紫色简约弹窗：已复制微信号 */}
      {showCopyToast && (
        <div className="copy-toast-overlay" onClick={() => setShowCopyToast(false)} role="presentation">
          <div className="copy-toast" onClick={(e) => e.stopPropagation()}>
            <span className="copy-toast-text">
              {language === 'zh' ? '已经复制微信号：EuroStay' : 'WeChat ID copied: EuroStay'}
            </span>
          </div>
        </div>
      )}

    </div>
  )
}

export default Home
