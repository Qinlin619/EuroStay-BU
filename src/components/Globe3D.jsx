import React, { useEffect, useRef, useState } from 'react'
import Globe from 'globe.gl'
import './Globe3D.css'

const Globe3D = ({ stories = [], currentIndex = 0, onMarkerClick, hoveredMarker, onMarkerHover, countryUserCounts = {}, language = 'zh' }) => {
  const globeEl = useRef(null)
  const [activeCard, setActiveCard] = useState(null)
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 })
  const globeRef = useRef(null)
  const countryUserCountsRef = useRef(countryUserCounts)
  const languageRef = useRef(language)

  // 更新 ref 以保持最新值
  useEffect(() => {
    countryUserCountsRef.current = countryUserCounts
    languageRef.current = language
  }, [countryUserCounts, language])

  // Theme colors
  const purplePrimary = '#7A63C7'
  const yellowPrimary = '#FFD35E'
  const purpleSecondary = '#D2C8FD'
  const yellowSecondary = '#FFEDBE'

  // Countries with stories (ISO country codes)
  const countriesWithStories = new Set(['FR', 'ES', 'NL']) // France, Spain, Netherlands

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
    if (!globeEl.current) return

    // Initialize Globe - following choropleth-countries example structure
    const world = Globe()(globeEl.current)
      .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
      .backgroundColor('#ffffff') // White background
      .pointOfView({ lat: 50, lng: 10, altitude: 2.0 }, 0) // Focus on Europe, larger initial view
      .lineHoverPrecision(0)
      .enablePointerInteraction(true)

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
        
        const colorScale = (feat) => {
          const isoCode = feat.properties.ISO_A2
          const hasStories = countriesWithStories.has(isoCode)
          return generateCountryColor(isoCode, hasStories)
        }

        // Filter out Antarctica (AQ)
        const countriesData = countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')
        
        world.polygonsData(countriesData)
          .polygonAltitude(0.06)
          .polygonCapColor(feat => colorScale(feat))
          .polygonSideColor((feat) => {
            const isoCode = feat.properties.ISO_A2
            const hasStories = countriesWithStories.has(isoCode)
            // Vary side color based on whether country has stories
            return hasStories ? 'rgba(122, 99, 199, 0.4)' : 'rgba(150, 150, 180, 0.25)'
          })
          .polygonStrokeColor(() => '#888') // Medium gray stroke for better visibility on white
          .polygonLabel(({ properties: d }) => {
            const hasStories = countriesWithStories.has(d.ISO_A2)
            return hasStories ? `
              <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
              <i>有故事</i>
            ` : `
              <b>${d.ADMIN}</b>
            `
          })
          .onPolygonHover((hoverD, prevHoverD) => {
            // Use direct object reference comparison for precise matching
            // This ensures only the exact polygon being hovered is highlighted
            world.polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
            world.polygonCapColor(d => d === hoverD ? yellowPrimary : colorScale(d))
            
            world.polygonSideColor(d => {
              if (d === hoverD) {
                return 'rgba(255, 211, 94, 0.5)' // Yellow tint for hover
              }
              const dIsoCode = d?.properties?.ISO_A2
              const hasStories = countriesWithStories.has(dIsoCode)
              return hasStories ? 'rgba(122, 99, 199, 0.4)' : 'rgba(150, 150, 180, 0.25)'
            })
            
            // Show card for all countries with user count data
            if (hoverD && hoverD.properties) {
              const isoCode = hoverD.properties.ISO_A2
              if (isoCode) {
                const userCount = countryUserCountsRef.current[isoCode] || 0
                setHoveredCountry({
                  isoCode,
                  name: hoverD.properties.ADMIN,
                  userCount
                })
              } else {
                setHoveredCountry(null)
              }
            } else {
              setHoveredCountry(null)
            }
          })
          .polygonsTransitionDuration(300)
      })
      .catch(err => {
        console.error('All GeoJSON sources failed:', err)
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

    // Disable zoom initially
    if (world.controls) {
      const controls = world.controls()
      if (controls) {
        controls.enableZoom = false
      }
    }

    // Check if mouse is within the circular globe container
    const isMouseInCircle = (clientX, clientY) => {
      if (!globeEl.current) return false
      
      const rect = globeEl.current.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
      const radius = Math.min(rect.width, rect.height) / 2
      
      return distance <= radius
    }

    // Enable zoom only when mouse is over the circular container
    const handleMouseMove = (e) => {
      if (!world.controls) return
      const controls = world.controls()
      if (!controls) return
      
      controls.enableZoom = isMouseInCircle(e.clientX, e.clientY)
    }

    const handleMouseLeave = () => {
      if (world.controls) {
        const controls = world.controls()
        if (controls) {
          controls.enableZoom = false
        }
      }
    }

    // Add mouse move listener to container to check position
    const container = globeEl.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseleave', handleMouseLeave)
    }

    // Cleanup
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseleave', handleMouseLeave)
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
      <div ref={globeEl} className="globe-3d-container" />
      {/* Card for point markers */}
      {activeCard !== null && stories[activeCard] && (
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
        </div>
      )}
      {/* Card for country hover */}
      {hoveredCountry !== null && (
        <div
          className="globe-card"
          style={{
            left: `${cardPosition.x}px`,
            top: `${cardPosition.y}px`,
          }}
          onMouseEnter={() => setHoveredCountry(hoveredCountry)}
          onMouseLeave={() => setHoveredCountry(null)}
        >
          <div className="globe-card-content">
            <div className="globe-card-header">
              <div className="globe-card-location">
                <span className="location-icon">🌍</span>
                <span>{hoveredCountry.name} ({hoveredCountry.isoCode})</span>
              </div>
              <button
                className="globe-card-close"
                onClick={() => setHoveredCountry(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="globe-card-user-count">
              {hoveredCountry.userCount > 0 ? (
                <>
                  <div className="globe-card-count-number">{hoveredCountry.userCount.toLocaleString()}</div>
                  <div className="globe-card-count-label">
                    {language === 'zh' ? '用户' : 'Users'}
                  </div>
                </>
              ) : (
                <div className="globe-card-count-label">
                  {language === 'zh' ? '暂无用户，等你加入' : 'No Users Yet，Join Us'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Globe3D
