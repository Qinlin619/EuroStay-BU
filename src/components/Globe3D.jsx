import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Globe from 'globe.gl'
import * as THREE from 'three'
import { translations } from '../translations'
import './Globe3D.css'

// 故事地点 -> 国家 ISO_A2，用于点击国家时跳转/弹窗
const LOCATION_TO_COUNTRY = {
  '巴黎, 法国': 'FR', 'Paris, France': 'FR', '巴黎': 'FR', 'Paris': 'FR',
  '巴塞罗那, 西班牙': 'ES', 'Barcelona, Spain': 'ES', '巴塞罗那': 'ES', 'Barcelona': 'ES',
  '阿姆斯特丹, 荷兰': 'NL', 'Amsterdam, Netherlands': 'NL', '阿姆斯特丹': 'NL', 'Amsterdam': 'NL',
  '罗马, 意大利': 'IT', 'Rome, Italy': 'IT', '罗马': 'IT', 'Rome': 'IT',
  '柏林, 德国': 'DE', 'Berlin, Germany': 'DE', '柏林': 'DE', 'Berlin': 'DE',
  '伦敦, 英国': 'GB', 'London, UK': 'GB', '伦敦': 'GB', 'London': 'GB',
  '里斯本, 葡萄牙': 'PT', 'Lisbon, Portugal': 'PT', '里斯本': 'PT', 'Lisbon': 'PT',
  '维也纳, 奥地利': 'AT', 'Vienna, Austria': 'AT', '维也纳': 'AT', 'Vienna': 'AT',
}

// 无故事国家点击时用于旋转地球的近似中心（lat, lng）
const COUNTRY_CENTER = {
  FR: { lat: 46.2, lng: 2.2 }, ES: { lat: 40.4, lng: -3.7 }, NL: { lat: 52.13, lng: 5.29 },
  IT: { lat: 41.9, lng: 12.5 }, DE: { lat: 51.2, lng: 10.5 }, GB: { lat: 54.0, lng: -2.5 },
  PT: { lat: 39.5, lng: -8.0 }, AT: { lat: 47.5, lng: 13.3 }, PL: { lat: 52.0, lng: 19.4 },
  UA: { lat: 49.0, lng: 32.0 }, SE: { lat: 62.0, lng: 15.6 }, NO: { lat: 62.0, lng: 10.0 },
  FI: { lat: 64.0, lng: 26.0 }, IE: { lat: 53.4, lng: -8.2 }, BE: { lat: 50.5, lng: 4.5 },
  CH: { lat: 46.8, lng: 8.2 }, CZ: { lat: 49.8, lng: 15.5 }, GR: { lat: 39.1, lng: 21.8 },
  RO: { lat: 46.0, lng: 25.0 }, HU: { lat: 47.2, lng: 19.5 }, RU: { lat: 60.0, lng: 100.0 },
  US: { lat: 38.0, lng: -97.0 }, CN: { lat: 35.9, lng: 104.2 }, JP: { lat: 36.2, lng: 138.3 },
  IN: { lat: 20.6, lng: 78.9 }, BR: { lat: -14.2, lng: -51.9 }, AU: { lat: -25.3, lng: 133.8 },
  CA: { lat: 56.0, lng: -106.0 }, MX: { lat: 23.6, lng: -102.5 }, TR: { lat: 39.0, lng: 35.0 },
  KR: { lat: 35.9, lng: 127.8 }, DK: { lat: 56.3, lng: 9.5 }, SK: { lat: 48.7, lng: 19.7 },
}

// 各国首都坐标（lat, lng），用于“固定相机、旋转地球”时把首都转到画面中心
const COUNTRY_CAPITAL = {
  FR: { lat: 48.8566, lng: 2.3522 },   // Paris
  ES: { lat: 40.4168, lng: -3.7038 },   // Madrid
  NL: { lat: 52.3676, lng: 4.9041 },   // Amsterdam
  IT: { lat: 41.9028, lng: 12.4964 },   // Rome
  DE: { lat: 52.52, lng: 13.405 },      // Berlin
  GB: { lat: 51.5074, lng: -0.1278 },   // London
  PT: { lat: 38.7223, lng: -9.1393 },   // Lisbon
  AT: { lat: 48.2082, lng: 16.3738 },   // Vienna
  PL: { lat: 52.2297, lng: 21.0122 },   // Warsaw
  UA: { lat: 50.4501, lng: 30.5234 },   // Kyiv
  SE: { lat: 59.3293, lng: 18.0686 },  // Stockholm
  NO: { lat: 59.9139, lng: 10.7522 },  // Oslo
  FI: { lat: 60.1699, lng: 24.9384 },   // Helsinki
  IE: { lat: 53.3498, lng: -6.2603 },   // Dublin
  BE: { lat: 50.8503, lng: 4.3517 },    // Brussels
  CH: { lat: 46.948, lng: 7.4474 },    // Bern
  CZ: { lat: 50.0755, lng: 14.4378 },  // Prague
  GR: { lat: 37.9838, lng: 23.7275 },  // Athens
  RO: { lat: 44.4268, lng: 26.1025 },  // Bucharest
  HU: { lat: 47.4979, lng: 19.0402 },  // Budapest
  RU: { lat: 55.7558, lng: 37.6173 },  // Moscow
  US: { lat: 38.9072, lng: -77.0369 }, // Washington
  CN: { lat: 39.9042, lng: 116.4074 }, // Beijing
  JP: { lat: 35.6762, lng: 139.6503 }, // Tokyo
  IN: { lat: 28.6139, lng: 77.209 },   // New Delhi
  BR: { lat: -15.7939, lng: -47.8828 }, // Brasília
  AU: { lat: -35.2809, lng: 149.1300 },// Canberra
  CA: { lat: 45.4215, lng: -75.6972 },  // Ottawa
  MX: { lat: 19.4326, lng: -99.1332 },  // Mexico City
  TR: { lat: 39.9334, lng: 32.8597 },   // Ankara
  KR: { lat: 37.5665, lng: 126.978 },  // Seoul
  DK: { lat: 55.6761, lng: 12.5683 },  // Copenhagen
  SK: { lat: 48.1486, lng: 17.1077 },  // Bratislava
}

const ISO_A3_TO_A2 = { USA: 'US', GBR: 'GB', TWN: 'TW', HKG: 'HK', MAC: 'MO', PRK: 'KP', RUS: 'RU', BOL: 'BO', VEN: 'VE', TLS: 'TL', PSE: 'PS', COD: 'CD', COG: 'CG', TZA: 'TZ', SYR: 'SY', LBY: 'LY', IRQ: 'IQ', IRN: 'IR', VNM: 'VN', KOR: 'KR', MKD: 'MK', FSM: 'FM', MDA: 'MD', LAO: 'LA' }
const getIso2FromProps = (p) => {
  if (!p) return null
  if (p.ISO_A2) return p.ISO_A2
  const a3 = (p.ISO_A3 || p.ADM0_A3 || '').toUpperCase()
  return ISO_A3_TO_A2[a3] || a3.slice(0, 2) || null
}

const Globe3D = ({ stories = [], currentIndex = 0, highlightCountry = null, rotationTransitionMs = 0, onMarkerClick, onCountryClick, onCountryHighlight, hoveredMarker, onMarkerHover, countryUserCounts = {}, language = 'zh', showCountryTooltip = true }) => {
  const globeEl = useRef(null)
  const [activeCard, setActiveCard] = useState(null)
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null) // 点击高亮的国家 ISO_A2
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 })
  const [isMouseOverGlobe, setIsMouseOverGlobe] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const globeRef = useRef(null)
  const countryUserCountsRef = useRef(countryUserCounts)
  const languageRef = useRef(language)
  const selectedCountryRef = useRef(null)
  const selectedFeatureRef = useRef(null) // 点击的那一块多边形（仅这块变黄，避免同国多块如法国本土+海外都变黄）
  const countriesWithStoriesRef = useRef(new Set())
  const countryToStoryIndicesRef = useRef({})

  // 从 stories 推导：有故事的国家集合 + 国家 -> 故事下标
  const countriesWithStories = React.useMemo(() => {
    const countrySet = new Set()
    const map = {}
    stories.forEach((s, i) => {
      const code = LOCATION_TO_COUNTRY[s.location]
      if (code) {
        countrySet.add(code)
        if (!map[code]) map[code] = []
        map[code].push(i)
      }
    })
    countriesWithStoriesRef.current = countrySet
    countryToStoryIndicesRef.current = map
    return countrySet
  }, [stories])

  // 更新 ref 以保持最新值
  useEffect(() => {
    countryUserCountsRef.current = countryUserCounts
    languageRef.current = language
  }, [countryUserCounts, language])

  useEffect(() => {
    selectedCountryRef.current = selectedCountry
  }, [selectedCountry])

  // Theme colors
  const purplePrimary = '#7A63C7'
  const yellowPrimary = '#FFD35E'
  const purpleSecondary = '#D2C8FD'
  const yellowSecondary = '#FFEDBE'
  // 海洋/球体颜色：只改这里，下面会统一用这个值（贴图 + 材质替换）
  const OCEAN_COLOR = '#F0EFF6'

  // Convert location to lat/lng coordinates
  // Map location names to real coordinates
  const getRealCoordinates = (location) => {
    const locationMap = {
      '巴黎': { lat: 48.8566, lng: 2.3522 },
      'Paris': { lat: 48.8566, lng: 2.3522 },
      '巴黎, 法国': { lat: 48.8566, lng: 2.3522 },
      'Paris, France': { lat: 48.8566, lng: 2.3522 },
      '巴塞罗那': { lat: 41.3902, lng: 2.1540 },
      'Barcelona': { lat: 41.3902, lng: 2.1540 },
      '巴塞罗那, 西班牙': { lat: 41.3902, lng: 2.1540 },
      'Barcelona, Spain': { lat: 41.3902, lng: 2.1540 },
      '阿姆斯特丹': { lat: 52.3676, lng: 4.9041 },
      'Amsterdam': { lat: 52.3676, lng: 4.9041 },
      '阿姆斯特丹, 荷兰': { lat: 52.3676, lng: 4.9041 },
      'Amsterdam, Netherlands': { lat: 52.3676, lng: 4.9041 },
    }
    
    // Try to match by exact location name
    if (locationMap[location]) {
      return locationMap[location]
    }
    
    // Try partial match
    for (const [key, coord] of Object.entries(locationMap)) {
      if (location.includes(key) || key.includes(location.split(',')[0].trim())) {
        return coord
      }
    }
    
    return null
  }

  const convertToLatLng = (story) => {
    // First try to get real coordinates from location name
    const realCoord = getRealCoordinates(story.location)
    if (realCoord) return realCoord
    
    // Fallback: convert from custom coordinate system if available
    if (story.coordinates) {
      const lng = ((story.coordinates.x / 100) * 360 - 180)
      const lat = ((story.coordinates.y / 50) * 180 - 90)
      return { lat, lng }
    }
    
    return null
  }

  // Prepare points data for globe.gl
  const getPointsData = (currentIdx) => {
    return stories
      .map((story, index) => {
        const coord = convertToLatLng(story)
        if (!coord) return null
        
        return {
          lat: coord.lat,
          lng: coord.lng,
          size: currentIdx === index ? 0.15 : 0.08,
          color: currentIdx === index ? '#7A63C7' : '#FFD35E',
          storyIndex: index,
          story: story,
        }
      })
      .filter(Boolean)
  }

  // Custom color interpolator from yellow to purple
  const interpolateYellowPurple = (t) => {
    const r1 = 255, g1 = 211, b1 = 94   // Yellow: #FFD35E
    const r2 = 122, g2 = 99, b2 = 199   // Purple: #7A63C7
    
    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const b = Math.round(b1 + (b2 - b1) * t)
    
    return `rgb(${r}, ${g}, ${b})`
  }

  // Get value for color scaling (1 if country has stories, 0 otherwise)
  const getVal = (feat) => {
    return countriesWithStories.has(feat.properties.ISO_A2) ? 1 : 0
  }

  useEffect(() => {
    if (!globeEl.current) {
      console.error('Globe3D: globeEl.current is null')
      return
    }

    // 查看日志：按 F12 打开开发者工具 → 点 Console（控制台）面板，刷新页面即可看到 Globe3D 的日志
    console.log('%c[Globe3D] 查看日志：F12 → Console 面板', 'color: #7A63C7; font-weight: bold')
    
    // Initialize Globe - following choropleth-countries example structure
    let world
    try {
      world = Globe()(globeEl.current)
      console.log('Globe3D: Globe instance created')
    } catch (error) {
      console.error('Globe3D: Failed to create Globe instance:', error)
      return
    }

    // 海洋贴图：颜色来自上面的 OCEAN_COLOR
    const createPurpleTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 256
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = OCEAN_COLOR
      ctx.fillRect(0, 0, 512, 256)
      return canvas.toDataURL('image/png')
    }
    
    const purpleTextureUrl = createPurpleTexture()
    
    world
      .globeImageUrl(purpleTextureUrl) // Use light purple texture
      .backgroundColor('rgba(0,0,0,0)') // Transparent background
      .pointOfView({ lat: 50, lng: 10, altitude: 1.68 }, 0) // 镜头距离，控制地球展示比例
      .lineHoverPrecision(0)
      .enablePointerInteraction(true)
    
    // globe.gl 的 scene 是函数，需调用后才是实际场景对象
    const getScene = () => (typeof world.scene === 'function' ? world.scene() : world.scene)
    
    // 仅球体 mesh 的判定：globe.gl 使用 GLOBE_RADIUS=100（绝不误判陆地）
    const isGlobeSphereMesh = (obj) => {
      const r = obj?.geometry?.parameters?.radius
      if (r == null) return false
      return obj.geometry?.type === 'SphereGeometry' && r >= 95 && r <= 105 && obj.name !== 'innerSolidSphere'
    }
    // 陆地：globe 用 __globeObjType 或 ConicPolygonGeometry 识别，只改 renderOrder
    const isLandMesh = (obj) =>
      obj?.geometry?.type === 'ConicPolygonGeometry' ||
      obj?.__globeObjType === 'polygon' ||
      obj?.parent?.__globeObjType === 'polygon'

    // Try to set globe material directly if the API exists
    try {
      if (typeof world.globeMaterial === 'function') {
        world.globeMaterial(() => ({
          color: parseInt(OCEAN_COLOR.replace('#', ''), 16),
          emissive: parseInt(OCEAN_COLOR.replace('#', ''), 16),
          emissiveIntensity: 1.5, // Enhanced glow intensity
          transparent: false,
          opacity: 1.0,
          side: THREE.FrontSide, // 只渲染正面，背面由深度遮挡
          depthWrite: true,
          depthTest: true
        }))
      }
    } catch (e) {
      console.log('Globe3D: globeMaterial API not available')
    }
    
    // Also try to set material immediately after initialization - multiple attempts
    const setPurpleMaterial = () => {
      try {
        const scene = getScene()
        if (scene && scene.children) {
          let found = false
          scene.children.forEach((child) => {
            if (child && child.traverse) {
              child.traverse((obj) => {
                // 陆地层（Group 或 Mesh）：统一后画，绝不改材质
                if (obj && (obj.__globeObjType === 'polygon' || obj?.parent?.__globeObjType === 'polygon')) {
                  obj.renderOrder = 1
                  if (obj.isMesh && obj.material) return
                }
                if (obj && obj.isMesh && obj.material) {
                  if (isLandMesh(obj)) {
                    obj.renderOrder = 1
                    return
                  }
                  if (isGlobeSphereMesh(obj)) {
                    found = true
                    // 强制替换球体材质，这样改 OCEAN_COLOR 才会生效（库可能不用 globeImageUrl/globeMaterial）
                    if (!window._purpleGlobeTexture || window._purpleGlobeColor !== OCEAN_COLOR) {
                      const canvas = document.createElement('canvas')
                      canvas.width = 512
                      canvas.height = 256
                      const ctx = canvas.getContext('2d')
                      ctx.fillStyle = OCEAN_COLOR
                      ctx.fillRect(0, 0, 512, 256)
                      if (window._purpleGlobeTexture) window._purpleGlobeTexture.dispose()
                      window._purpleGlobeTexture = new THREE.CanvasTexture(canvas)
                      window._purpleGlobeTexture.needsUpdate = true
                      window._purpleGlobeColor = OCEAN_COLOR
                    }
                    const oldMaterial = obj.material
                    obj.material = new THREE.MeshBasicMaterial({
                      color: parseInt(OCEAN_COLOR.replace('#', ''), 16),
                      transparent: false,
                      opacity: 1.0,
                      side: THREE.FrontSide,
                      depthWrite: true,
                      depthTest: true,
                      map: window._purpleGlobeTexture
                    })
                    if (oldMaterial && typeof oldMaterial.dispose === 'function') oldMaterial.dispose()
                    obj.material.needsUpdate = true
                  }
                }
              })
            }
          })
          return found
        }
      } catch (err) {
        console.error('Globe3D: Error setting light purple material:', err)
      }
      return false
    }
    
    // Try multiple times with increasing delays
    setTimeout(() => setPurpleMaterial(), 50)
    setTimeout(() => setPurpleMaterial(), 200)
    setTimeout(() => setPurpleMaterial(), 500)
    // 诊断：若球体仍透明，在 Console 看是否打印了「找到球体」；若没有，看下面「场景内 mesh 列表」
    setTimeout(() => {
      const found = setPurpleMaterial()
      const scene = getScene()
      if (!found && scene) {
        console.warn('Globe3D: 未找到球体 mesh（可能 geometry 类型/radius 不同），下面列出场景内所有 mesh 供排查：')
        const list = []
        scene.traverse?.((obj) => {
          if (obj?.isMesh && obj?.geometry) {
            const p = obj.geometry.parameters || {}
            list.push({ name: obj.name || '(无名)', type: obj.geometry.type, radius: p.radius, materialTransparent: obj.material?.transparent })
          }
        })
        console.table(list)
      }
    }, 1500)

    // Load countries GeoJSON data
    // Using a reliable GeoJSON data source
    // Primary: Try UNPKG (globe.gl examples)
    // Fallback: Try jsDelivr CDN or other sources
    const loadCountries = async () => {
      const sources = [
        'https://unpkg.com/globe.gl@2.45.0/example/datasets/ne_110m_admin_0_countries.geojson',
        'https://unpkg.com/globe.gl/example/datasets/ne_110m_admin_0_countries.geojson',
        'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
      ]
      
      for (const url of sources) {
        try {
          const res = await fetch(url)
          if (!res.ok) continue
          const data = await res.json()
          // Verify it's valid GeoJSON with features
          if (data && data.features && Array.isArray(data.features) && data.features.length > 0) {
            return data
          }
        } catch (err) {
          console.warn(`Failed to load from ${url}:`, err)
          continue
        }
      }
      throw new Error('All GeoJSON sources failed')
    }
    
    loadCountries().then(countries => {
        console.log('Globe3D: Countries data loaded:', countries.features.length, 'countries')
        setIsLoading(false)
        setLoadError(null)
        
        // Set globe surface to light purple with glow after countries are loaded
        // Force ALL meshes to light purple - be very aggressive
        setTimeout(() => {
          try {
            const scene = getScene()
            console.log('Globe3D: Attempting to set globe to light purple...')
            console.log('Globe3D: Scene children count:', scene?.children?.length)
            
            if (scene && scene.children) {
              let foundGlobe = false
              
              scene.children.forEach((child) => {
                if (child && child.traverse) {
                  child.traverse((obj) => {
                    if (obj && (obj.__globeObjType === 'polygon' || obj?.parent?.__globeObjType === 'polygon')) {
                      obj.renderOrder = 1
                      if (obj.isMesh && obj.material) return
                    }
                    if (obj && obj.isMesh && obj.material) {
                      if (isLandMesh(obj)) {
                        obj.renderOrder = 1
                        return
                      }
                      if (isGlobeSphereMesh(obj)) foundGlobe = true
                      // 暂不替换球体材质，先确认陆地能否显示
                    }
                  })
                }
              })
              if (!foundGlobe) console.warn('Globe3D: Globe sphere mesh not found (radius~100)')
            }
          } catch (err) {
            console.error('Globe3D: Could not apply light purple color:', err)
          }
        }, 300)
        // Generate varied colors for countries to create depth/hierarchy
        // Countries with stories get purple shades, others get varied gray/blue tones
        const generateCountryColor = (isoCode, hasStories) => {
          if (hasStories) {
            // Countries with stories: use purple shades
            return purplePrimary
          }
          
          // Generate a hash from ISO code to create consistent color variations
          let hash = 0
          for (let i = 0; i < isoCode.length; i++) {
            hash = isoCode.charCodeAt(i) + ((hash << 5) - hash)
          }
          
          // Create color variations with different lightness
          const lightness = 60 + (Math.abs(hash) % 30) // Vary between 60-90
          const saturation = 15 + (Math.abs(hash >> 8) % 15) // Vary between 15-30
          
          // Use blue-gray tones with variation
          return `hsl(240, ${saturation}%, ${lightness}%)`
        }
        
        const getIso2 = getIso2FromProps
        const colorScale = (feat) => {
          const iso2 = getIso2(feat?.properties)
          if (!iso2) return 'hsl(240, 15%, 75%)'
          if (selectedFeatureRef.current && feat === selectedFeatureRef.current) return yellowPrimary
          if (iso2 === selectedCountryRef.current) return yellowPrimary
          const hasStories = countriesWithStories.has(iso2)
          return generateCountryColor(iso2, hasStories)
        }

        // 过滤掉南极洲；其余国家保留（含仅 ISO_A3 的块）
        const countriesData = countries.features.filter(d => getIso2(d?.properties) !== 'AQ' && (d?.properties?.ISO_A2 || d?.properties?.ISO_A3 || d?.properties?.ADMIN || d?.properties?.NAME))
        
        world.polygonsData(countriesData)
          .polygonAltitude(0.18)
          .polygonCapColor(feat => colorScale(feat))
          .polygonSideColor((feat) => {
            if (selectedFeatureRef.current && feat === selectedFeatureRef.current) return 'rgba(255, 211, 94, 0.5)'
            const iso2 = getIso2(feat?.properties)
            if (iso2 === selectedCountryRef.current) return 'rgba(255, 211, 94, 0.5)'
            const hasStories = iso2 ? countriesWithStories.has(iso2) : false
            return hasStories ? 'rgba(122, 99, 199, 0.4)' : 'rgba(150, 150, 180, 0.25)'
          })
          .polygonStrokeColor(() => 'rgba(80, 70, 100, 0.35)')
          .polygonLabel(() => null)
          .polygonCapCurvatureResolution(5)
          .onPolygonClick((clickedFeat) => {
            if (!clickedFeat?.properties) return
            const iso2 = getIso2(clickedFeat.properties)
            if (!iso2) return
            selectedFeatureRef.current = clickedFeat
            setSelectedCountry(iso2)
            onCountryHighlight?.(iso2)
            const indices = countryToStoryIndicesRef.current[iso2]
            const name = clickedFeat.properties.ADMIN || clickedFeat.properties.NAME || iso2
            if (indices && indices.length > 0) {
              onMarkerClick?.(indices[0])
            } else {
              onCountryClick?.(iso2, null, name)
            }
          })
          .onPolygonHover((hoverD, prevHoverD) => {
            if (hoverD !== prevHoverD) {
              world.polygonAltitude(d => d === hoverD ? 0.22 : 0.18)
              world.polygonCapColor(d => d === hoverD ? yellowPrimary : colorScale(d))
              world.polygonSideColor(d => {
                if (d === hoverD) return 'rgba(255, 211, 94, 0.5)'
                if (selectedFeatureRef.current && d === selectedFeatureRef.current) return 'rgba(255, 211, 94, 0.5)'
                const iso2 = getIso2(d?.properties)
                if (iso2 === selectedCountryRef.current) return 'rgba(255, 211, 94, 0.5)'
                return iso2 && countriesWithStories.has(iso2) ? 'rgba(122, 99, 199, 0.4)' : 'rgba(150, 150, 180, 0.25)'
              })
            }
            // 弹窗：板块变黄就显示，变回就消失，与高亮完全同步；存 iso2 供按语言显示国家名
            if (hoverD && hoverD.properties) {
              const p = hoverD.properties
              const iso2 = getIso2(p)
              const isoDisplay = p.ISO_A2 || p.ISO_A3 || p.ADM0_A3 || iso2 || '—'
              const name = p.ADMIN || p.NAME || isoDisplay || '—'
              const userCount = iso2 ? (countryUserCountsRef.current[iso2] || 0) : 0
              setHoveredCountry({ isoCode: isoDisplay, iso2, name, userCount })
            } else {
              setHoveredCountry(null)
            }
          })
          .polygonsTransitionDuration(120) // 缩短过渡时间，悬停反馈更跟手
      })
      .then(() => {
        // 陆地与球体分离：陆地只设 renderOrder=1（后画），绝不改材质
        setTimeout(() => {
          const scene = getScene()
          if (scene && scene.children) {
            scene.children.forEach((child) => {
              if (child?.traverse) {
                child.traverse((obj) => {
                  if (obj && (obj.__globeObjType === 'polygon' || obj?.parent?.__globeObjType === 'polygon' || isLandMesh(obj))) {
                    obj.renderOrder = 1
                  }
                })
              }
            })
          }
        }, 100)
      })
      .catch(err => {
        console.error('Globe3D: All GeoJSON sources failed:', err)
        setIsLoading(false)
        setLoadError(err.message)
        // 显示错误提示
        if (globeEl.current) {
          globeEl.current.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 1.4rem;">加载地球数据失败，请刷新页面重试</div>'
        }
      })

    // Set initial points
    const pointsData = getPointsData(currentIndex)
    world.pointsData(pointsData)
      .pointColor((d) => d.color)
      .pointRadius((d) => d.size)
      .pointAltitude(0.01)
      .pointLabel((d) => d.story ? `${d.story.location}\n${d.story.title}` : '')
      .pointResolution(6)
      .pointsMerge(false)
      .onPointClick((point) => {
        if (point && onMarkerClick) {
          onMarkerClick(point.storyIndex)
        }
      })
      .onPointHover((point, prevPoint) => {
        if (point) {
          setActiveCard(point.storyIndex)
        } else {
          setActiveCard(null)
        }
      })

    globeRef.current = world
    
    // 启动阶段有限次检查球体颜色，避免长期高频轮询导致卡顿
    let forcePurpleRuns = 0
    const maxForcePurpleRuns = 12
    const forcePurpleInterval = setInterval(() => {
      forcePurpleRuns += 1
      if (forcePurpleRuns > maxForcePurpleRuns) {
        clearInterval(forcePurpleInterval)
        if (world._forcePurpleInterval === forcePurpleInterval) world._forcePurpleInterval = null
        return
      }
      try {
        const scene = getScene()
        if (scene && scene.children) {
          scene.children.forEach((child) => {
            if (child && child.traverse) {
              child.traverse((obj) => {
                if (obj && (obj.__globeObjType === 'polygon' || obj?.parent?.__globeObjType === 'polygon')) {
                  obj.renderOrder = 1
                  if (obj.isMesh && obj.material) return
                }
                if (obj && obj.isMesh && obj.material) {
                  if (isLandMesh(obj)) {
                    obj.renderOrder = 1
                    return
                  }
                  if (obj.name === 'innerSolidSphere' ||
                      (obj.geometry?.type === 'SphereGeometry' && 
                       (obj.geometry?.parameters?.radius ?? 0) > 90 && (obj.geometry?.parameters?.radius ?? 0) < 100)) {
                    const currentColor = obj.material.color?.getHex()
                    const isTransparent = obj.material.transparent || obj.material.opacity < 1.0
                    const targetPurpleColor = 0xD2C8FD
                    if (currentColor !== targetPurpleColor || isTransparent || 
                        obj.material.side !== THREE.BackSide || !obj.material.map) {
                      if (!window._purpleGlobeTexture) {
                        const canvas = document.createElement('canvas')
                        canvas.width = 512
                        canvas.height = 256
                        const ctx = canvas.getContext('2d')
                        ctx.fillStyle = '#D2C8FD'
                        ctx.fillRect(0, 0, 512, 256)
                        const texture = new THREE.CanvasTexture(canvas)
                        texture.needsUpdate = true
                        window._purpleGlobeTexture = texture
                      }
                      const oldMaterial = obj.material
                      obj.material = new THREE.MeshStandardMaterial({
                        color: 0xD2C8FD,
                        emissive: 0xE8E0FF,
                        emissiveIntensity: 1.5,
                        metalness: 0.0,
                        roughness: 1.0,
                        transparent: false,
                        opacity: 1.0,
                        side: THREE.BackSide,
                        depthWrite: true,
                        depthTest: true,
                        map: window._purpleGlobeTexture,
                        fog: false
                      })
                      if (oldMaterial && typeof oldMaterial.dispose === 'function') oldMaterial.dispose()
                      obj.material.needsUpdate = true
                    }
                  }
                  if (isGlobeSphereMesh(obj)) {
                    obj.renderOrder = -1
                    const needsReplace = obj.material.type !== 'MeshBasicMaterial' || obj.material.map !== window._purpleGlobeTexture || obj.material.transparent
                    if (needsReplace) {
                      if (!window._purpleGlobeTexture) {
                        const canvas = document.createElement('canvas')
                        canvas.width = 512
                        canvas.height = 256
                        const ctx = canvas.getContext('2d')
                        ctx.fillStyle = '#D2C8FD'
                        ctx.fillRect(0, 0, 512, 256)
                        const texture = new THREE.CanvasTexture(canvas)
                        texture.needsUpdate = true
                        window._purpleGlobeTexture = texture
                      }
                      const oldMaterial = obj.material
                      obj.material = new THREE.MeshBasicMaterial({
                        color: 0xD2C8FD,
                        transparent: false,
                        opacity: 1.0,
                        side: THREE.FrontSide,
                        depthWrite: true,
                        depthTest: true,
                        map: window._purpleGlobeTexture
                      })
                      if (oldMaterial && typeof oldMaterial.dispose === 'function') oldMaterial.dispose()
                      obj.material.needsUpdate = true
                    }
                  }
                }
              })
            }
          })
        }
      } catch (err) {
        // ignore
      }
    }, 800) // 800ms 一次，共跑约 10 秒后停止，减轻卡顿

    if (!world._forcePurpleInterval) {
      world._forcePurpleInterval = forcePurpleInterval
    }
    
    // Set globe sphere to light purple with glow (keep background transparent) - second attempt
    setTimeout(() => {
      try {
        // Keep scene background transparent
        const scene = getScene()
        if (scene) {
          scene.background = null // Transparent
        }
        
        // Keep renderer transparent - use alpha channel（renderer 也可能是函数）
        const renderer = typeof world.renderer === 'function' ? world.renderer() : world.renderer
        try {
          if (renderer && typeof renderer.setClearColor === 'function') {
            renderer.setClearColor(0x000000, 0) // Transparent
          }
          if (renderer && typeof renderer.setPixelRatio === 'function') {
            renderer.setPixelRatio(window.devicePixelRatio)
          }
          if (renderer && renderer.domElement) {
            renderer.domElement.style.backgroundColor = 'transparent'
            renderer.domElement.style.background = 'transparent'
          }
        } catch (err) {
          console.warn('Globe3D: Could not set renderer clear color:', err)
        }
        
        // Force set ALL meshes to light purple with glow - second attempt with material replacement
        // Also add a solid inner sphere to make the globe appear solid (hiding the back side)
        if (scene && scene.children) {
          let globeRadius = 100 // three-globe 使用 100
          let globeMesh = null
          
          scene.children.forEach((child) => {
            if (child && child.traverse) {
              child.traverse((obj) => {
                if (obj && (obj.__globeObjType === 'polygon' || obj?.parent?.__globeObjType === 'polygon')) {
                  obj.renderOrder = 1
                  if (obj.isMesh && obj.material) return
                }
                if (obj && obj.isMesh && obj.material) {
                  if (isLandMesh(obj)) {
                    obj.renderOrder = 1
                    return
                  }
                  // 暂不替换球体材质，先确认陆地能否显示
                }
              })
            }
          })
          
          // 暂不添加内层球，先确认陆地能否显示
          if (false && globeMesh && !window._innerSolidSphere) {
            try {
              if (scene) {
                // Create a slightly smaller inner sphere (99.5% of radius) to fill the globe
                // Use larger radius to ensure it covers the back side
                const innerRadius = globeRadius * 0.995
                const innerGeometry = new THREE.SphereGeometry(innerRadius, 64, 64)
                
                // Create light purple texture for inner sphere if not exists
                if (!window._purpleGlobeTexture) {
                  const canvas = document.createElement('canvas')
                  canvas.width = 512
                  canvas.height = 256
                  const ctx = canvas.getContext('2d')
                  ctx.fillStyle = '#D2C8FD' // Light purple
                  ctx.fillRect(0, 0, 512, 256)
                  const texture = new THREE.CanvasTexture(canvas)
                  texture.needsUpdate = true
                  window._purpleGlobeTexture = texture
                }
                
                const innerMaterial = new THREE.MeshStandardMaterial({
                  color: 0xD2C8FD, // Same light purple color
                  emissive: 0xE8E0FF, // Same glow
                  emissiveIntensity: 1.5,
                  metalness: 0.0,
                  roughness: 1.0,
                  transparent: false, // NOT transparent
                  opacity: 1.0, // Fully opaque
                  side: THREE.BackSide, // Render back side (faces pointing inward) to fill from inside
                  depthWrite: true, // Write depth for proper occlusion
                  depthTest: true, // Enable depth test
                  map: window._purpleGlobeTexture, // Use same texture as outer sphere
                  fog: false // Disable fog for inner sphere
                })
                const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial)
                innerSphere.name = 'innerSolidSphere'
                // Add to the same parent as the globe mesh, and ensure it renders after
                if (globeMesh.parent) {
                  globeMesh.parent.add(innerSphere)
                  // Move inner sphere to render after outer sphere
                  const parent = globeMesh.parent
                  const outerIndex = parent.children.indexOf(globeMesh)
                  parent.children.splice(outerIndex + 1, 0, innerSphere)
                  parent.children.pop() // Remove from end
                } else {
                  scene.add(innerSphere)
                }
                // Ensure inner sphere renders on top
                innerSphere.renderOrder = 1
                window._innerSolidSphere = innerSphere
                console.log('Globe3D: Added solid inner sphere to hide back side, radius:', innerRadius)
              }
            } catch (err) {
              console.warn('Globe3D: Could not add inner solid sphere:', err)
            }
          }
        }
      } catch (err) {
        console.error('Globe3D: Could not apply light purple color (second attempt):', err)
      }
    }, 1500)

    // 固定地球大小，取消滚轮缩放
    if (world.controls) {
      const controls = world.controls()
      if (controls) {
        controls.enableZoom = false
      }
    }

    // 仅在地球容器内显示弹窗：离开容器即隐藏，避免弹窗跟到左侧文案区
    const container = globeEl.current
    const handleGlobeContainerLeave = () => {
      setIsMouseOverGlobe(false)
      setHoveredCountry(null)
    }
    const handleGlobeContainerEnter = () => setIsMouseOverGlobe(true)
    const handleGlobeContainerMove = (e) => setCardPosition({ x: e.clientX, y: e.clientY })
    if (container) {
      container.addEventListener('mouseenter', handleGlobeContainerEnter)
      container.addEventListener('mouseleave', handleGlobeContainerLeave)
      container.addEventListener('mousemove', handleGlobeContainerMove)
    }

    // Cleanup
    return () => {
      if (container) {
        container.removeEventListener('mouseenter', handleGlobeContainerEnter)
        container.removeEventListener('mouseleave', handleGlobeContainerLeave)
        container.removeEventListener('mousemove', handleGlobeContainerMove)
      }
      // Clear the force purple interval
      if (world._forcePurpleInterval) {
        clearInterval(world._forcePurpleInterval)
        world._forcePurpleInterval = null
      }
      if (globeRef.current && globeRef.current._destructor) {
        globeRef.current._destructor()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Initialize once

  // Update points when currentIndex or stories change
  useEffect(() => {
    if (!globeRef.current) return

    const updatedPoints = getPointsData(currentIndex)
    globeRef.current.pointsData(updatedPoints)
  }, [currentIndex, stories])

  // 点击国家后保持黄色高亮：selectedCountry 变化时重刷国家颜色
  useEffect(() => {
    const world = globeRef.current
    if (!world || typeof world.polygonCapColor !== 'function') return

    const getCapColor = (feat) => {
      if (selectedFeatureRef.current && feat === selectedFeatureRef.current) return yellowPrimary
      const iso2 = getIso2FromProps(feat?.properties)
      if (!iso2) return 'hsl(240, 15%, 75%)'
      if (iso2 === selectedCountryRef.current) return yellowPrimary
      if (countriesWithStoriesRef.current.has(iso2)) return purplePrimary
      let hash = 0
      for (let i = 0; i < iso2.length; i++) hash = iso2.charCodeAt(i) + ((hash << 5) - hash)
      const lightness = 60 + (Math.abs(hash) % 30)
      const saturation = 15 + (Math.abs(hash >> 8) % 15)
      return `hsl(240, ${saturation}%, ${lightness}%)`
    }
    world.polygonCapColor(getCapColor)
    world.polygonSideColor((feat) => {
      if (selectedFeatureRef.current && feat === selectedFeatureRef.current) return 'rgba(255, 211, 94, 0.5)'
      const iso2 = getIso2FromProps(feat?.properties)
      if (iso2 === selectedCountryRef.current) return 'rgba(255, 211, 94, 0.5)'
      return iso2 && countriesWithStoriesRef.current.has(iso2) ? 'rgba(122, 99, 199, 0.4)' : 'rgba(150, 150, 180, 0.25)'
    })
  }, [selectedCountry])

  // 固定相机不动；选择国家时旋转地球，使该国首都转到画面中心（与初始 pointOfView 的 lat:50 lng:10 对齐）
  const VIEW_CENTER_LAT = 50
  const VIEW_CENTER_LNG = 10

  useEffect(() => {
    if (highlightCountry) {
      setSelectedCountry(highlightCountry)
      selectedFeatureRef.current = null
    }
    const world = globeRef.current
    if (!world || typeof world.scene !== 'function' || typeof world.getCoords !== 'function') return

    const scene = world.scene()
    const globeObj = scene?.children?.find(c => typeof c.getCoords === 'function')
    if (!globeObj) return

    if (!highlightCountry) {
      globeObj.quaternion.identity()
      return
    }

    // 优先用首都坐标，其次故事地点，再国家中心
    const capital = COUNTRY_CAPITAL[highlightCountry]
    const story = stories.find(s => LOCATION_TO_COUNTRY[s.location] === highlightCountry)
    const coord = capital || (story ? convertToLatLng(story) : null) || COUNTRY_CENTER[highlightCountry]
    if (!coord) return

    const c0 = world.getCoords(coord.lat, coord.lng, 0)
    const c1 = world.getCoords(VIEW_CENTER_LAT, VIEW_CENTER_LNG, 0)
    const fromVec = new THREE.Vector3(c0.x, c0.y, c0.z).normalize()
    const toVec = new THREE.Vector3(c1.x, c1.y, c1.z).normalize()

    const targetQuat = new THREE.Quaternion().setFromUnitVectors(fromVec, toVec)
    const transitionMs = typeof rotationTransitionMs === 'number' ? Math.max(0, rotationTransitionMs) : 0

    if (transitionMs <= 0) {
      globeObj.quaternion.copy(targetQuat)
      return
    }

    const startQuat = globeObj.quaternion.clone()
    const startTime = Date.now()
    let rafId = null

    const tick = () => {
      const t = Math.min((Date.now() - startTime) / transitionMs, 1)
      globeObj.quaternion.slerpQuaternions(startQuat, targetQuat, t)
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => { if (rafId != null) cancelAnimationFrame(rafId) }
  }, [highlightCountry, stories, rotationTransitionMs])

  // Update card position on mouse move
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (activeCard !== null || hoveredCountry !== null) {
        setCardPosition({ x: event.clientX, y: event.clientY })
      }
    }

    if (activeCard !== null || hoveredCountry !== null) {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [activeCard, hoveredCountry])

  return (
    <div className="globe-3d-wrapper">
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#999',
          fontSize: '1.4rem',
          zIndex: 10
        }}>
          加载地球中...
        </div>
      )}
      {loadError && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#ff5e5e',
          fontSize: '1.4rem',
          zIndex: 10,
          textAlign: 'center',
          padding: '2rem'
        }}>
          加载失败: {loadError}<br />
          <button onClick={() => window.location.reload()} style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#7A63C7',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}>
            刷新页面
          </button>
        </div>
      )}
      <div ref={globeEl} className="globe-3d-container" />
      {/* 弹窗挂到 body，避免被父级 transform 影响，与 clientX/clientY 对齐 */}
      {activeCard !== null && stories[activeCard] && createPortal(
        <div
          className="globe-card"
          style={{
            left: `${cardPosition.x}px`,
            top: `${cardPosition.y}px`,
          }}
          onMouseEnter={() => setActiveCard(activeCard)}
          onMouseLeave={() => setActiveCard(null)}
        >
          <div className="globe-card-content">
            <div className="globe-card-header">
              <div className="globe-card-location">
                <span className="location-icon">📍</span>
                <span>{stories[activeCard].location}</span>
              </div>
              <button
                className="globe-card-close"
                onClick={() => setActiveCard(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="globe-card-author">
              <div className="globe-card-avatar">
                {stories[activeCard].author[0]}
              </div>
              <div>
                <div className="globe-card-author-name">{stories[activeCard].author}</div>
                <div className="globe-card-date">{stories[activeCard].date}</div>
              </div>
            </div>
            <h3 className="globe-card-title">{stories[activeCard].title}</h3>
            <p className="globe-card-content-text">{stories[activeCard].content}</p>
            <button
              className="globe-card-action"
              onClick={() => {
                if (onMarkerClick) {
                  onMarkerClick(activeCard)
                }
                setActiveCard(null)
              }}
            >
              查看详情 →
            </button>
          </div>
        </div>,
        document.body
      )}
      {showCountryTooltip && hoveredCountry !== null && isMouseOverGlobe && (() => {
        const t = translations[language]?.globeTooltip || {}
        const countryNames = t.countryNames || {}
        const keyA2 = hoveredCountry.iso2 ? String(hoveredCountry.iso2).toUpperCase() : ''
        const keyA3 = hoveredCountry.isoCode ? String(hoveredCountry.isoCode).toUpperCase() : ''
        const displayName = (keyA2 && countryNames[keyA2]) ? countryNames[keyA2] : (keyA3 && countryNames[keyA3]) ? countryNames[keyA3] : hoveredCountry.name
        return createPortal(
          <div
            className="globe-country-tooltip"
            style={{
              left: `${cardPosition.x}px`,
              top: `${cardPosition.y}px`,
            }}
          >
            <div className="globe-country-tooltip-name">
              {displayName}
            </div>
            {hoveredCountry.userCount > 0 ? (
              <div className="globe-country-tooltip-count">
                <span className="globe-country-tooltip-number">{hoveredCountry.userCount.toLocaleString()}</span>
                <span className="globe-country-tooltip-label">{t.usersLabel ?? (language === 'zh' ? '用户' : 'Users')}</span>
              </div>
            ) : (
              <div className="globe-country-tooltip-empty">
                {t.noUsersLabel ?? (language === 'zh' ? '暂无用户，等你加入' : 'No Users Yet, Join Us')}
              </div>
            )}
          </div>,
          document.body
        )
      })()}
    </div>
  )
}

export default Globe3D
