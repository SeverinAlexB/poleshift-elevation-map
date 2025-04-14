'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap, ZoomControl, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Add type declarations for vendor-prefixed fullscreen methods
declare global {
  interface HTMLElement {
    mozRequestFullScreen?: () => Promise<void>
    webkitRequestFullscreen?: () => Promise<void>
    msRequestFullscreen?: () => Promise<void>
  }
  
  interface Document {
    mozCancelFullScreen?: () => Promise<void>
    webkitExitFullscreen?: () => Promise<void>
    msExitFullscreen?: () => Promise<void>
  }
}

// Add Leaflet Icon type declaration 
declare module 'leaflet' {
  namespace Icon {
    interface Default {
      _getIconUrl?: string
    }
  }
}

// Add global CSS for fullscreen mode and cursor styles
const GlobalMapCSS = () => {
  useEffect(() => {
    // Add CSS to handle fullscreen properly and set map cursor
    const style = document.createElement('style')
    style.textContent = `
      .leaflet-container:fullscreen {
        width: 100% !important;
        height: 100% !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        z-index: 9999 !important;
      }
      
      :fullscreen {
        padding: 0 !important;
        background-color: white !important;
      }
      
      :-webkit-full-screen {
        padding: 0 !important;
        background-color: white !important;
      }
      
      :-moz-full-screen {
        padding: 0 !important;
        background-color: white !important;
      }
      
      :-ms-fullscreen {
        padding: 0 !important;
        background-color: white !important;
      }
      
      .leaflet-container {
        cursor: crosshair !important;
      }
      
      .leaflet-container:active {
        cursor: crosshair !important;
      }
      
      .leaflet-interactive {
        cursor: pointer !important;
      }
      
      .leaflet-control-zoom a, 
      .leaflet-control-layers-toggle,
      .leaflet-bar a {
        cursor: pointer !important;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  return null
}

// Additional direct map styling
const DirectMapStyling = () => {
  const map = useMap()
  
  useEffect(() => {
    // Apply cursor style directly to the map container
    const mapContainer = map.getContainer()
    mapContainer.style.cursor = 'crosshair'
    
    // No need for mouse events since we're using the same cursor for all states
    
    return () => {
      // Cleanup if needed
    }
  }, [map])
  
  return null
}

// Fix Leaflet icon issues
const FixLeafletIcons = () => {
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Dynamically import Leaflet to avoid SSR issues
      import('leaflet').then((L) => {
        // Fix the icon paths which are broken in production build
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
        })
      })
    }
  }, [])
  
  return null
}

// Custom fullscreen control
const CustomFullscreenControl = () => {
  const map = useMap()
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined' && document) {
      // Create a custom control button
      const fullscreenButton = document.createElement('button')
      fullscreenButton.className = 'leaflet-fullscreen-button'
      fullscreenButton.title = 'View Fullscreen'
      
      // SVG icons for better visibility
      const expandIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 3 21 3 21 9"></polyline>
        <polyline points="9 21 3 21 3 15"></polyline>
        <line x1="21" y1="3" x2="14" y2="10"></line>
        <line x1="3" y1="21" x2="10" y2="14"></line>
      </svg>`
      
      const collapseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="4 14 10 14 10 20"></polyline>
        <polyline points="20 10 14 10 14 4"></polyline>
        <line x1="14" y1="10" x2="21" y2="3"></line>
        <line x1="3" y1="21" x2="10" y2="14"></line>
      </svg>`
      
      fullscreenButton.innerHTML = expandIcon
      fullscreenButton.style.cssText = `
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        cursor: pointer;
        height: 30px;
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        outline: none;
      `
      
      // Create control container
      const controlDiv = document.createElement('div')
      controlDiv.className = 'leaflet-control-fullscreen leaflet-control'
      controlDiv.style.marginRight = '10px'
      controlDiv.style.marginBottom = '10px'
      controlDiv.appendChild(fullscreenButton)
      
      // Get the control container
      const topRightControls = document.querySelector('.leaflet-top.leaflet-right')
      if (topRightControls) {
        topRightControls.appendChild(controlDiv)
      }
      
      let isFullscreen = false
      
      // Toggle fullscreen function
      const toggleFullscreen = () => {
        const mapContainer = map.getContainer()
        
        if (!isFullscreen) {
          if (mapContainer.requestFullscreen) {
            mapContainer.requestFullscreen()
          } else if (mapContainer.mozRequestFullScreen) {
            mapContainer.mozRequestFullScreen()
          } else if (mapContainer.webkitRequestFullscreen) {
            mapContainer.webkitRequestFullscreen()
          } else if (mapContainer.msRequestFullscreen) {
            mapContainer.msRequestFullscreen()
          }
          
          // Force map to invalidate size after a slight delay
          setTimeout(() => {
            map.invalidateSize()
          }, 100)
          
          fullscreenButton.innerHTML = collapseIcon
          fullscreenButton.title = 'Exit Fullscreen'
          isFullscreen = true
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
          
          // Force map to invalidate size after a slight delay
          setTimeout(() => {
            map.invalidateSize()
          }, 100)
          
          fullscreenButton.innerHTML = expandIcon
          fullscreenButton.title = 'View Fullscreen'
          isFullscreen = false
        }
      }
      
      // Add event listener
      fullscreenButton.addEventListener('click', toggleFullscreen)
      
      // Fullscreen change listeners to update button state and fix map size
      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          fullscreenButton.innerHTML = expandIcon
          fullscreenButton.title = 'View Fullscreen'
          isFullscreen = false
        } else {
          // Force map to refresh size in fullscreen mode
          setTimeout(() => {
            map.invalidateSize()
          }, 100)
        }
      })
      
      // Add hover effect
      fullscreenButton.addEventListener('mouseenter', () => {
        fullscreenButton.style.backgroundColor = '#f4f4f4'
      })
      
      fullscreenButton.addEventListener('mouseleave', () => {
        fullscreenButton.style.backgroundColor = 'white'
      })
      
      // Clean up on unmount
      return () => {
        fullscreenButton.removeEventListener('click', toggleFullscreen)
        fullscreenButton.removeEventListener('mouseenter', () => {})
        fullscreenButton.removeEventListener('mouseleave', () => {})
        document.removeEventListener('fullscreenchange', () => {})
        if (controlDiv.parentNode) {
          controlDiv.parentNode.removeChild(controlDiv)
        }
      }
    }
  }, [map])
  
  return null
}

// Elevation control component
interface ElevationControlProps {
  elevation: number | null
  setElevation: (elevation: number | null) => void
}

const ElevationControl = ({ elevation, setElevation }: ElevationControlProps) => {
  const map = useMap()
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null)
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Simple cache for elevation data
      const elevationCache: Record<string, number> = {}
      
      // Debounce function to limit API calls
      const debounce = (callback: Function, limit: number) => {
        let timeoutId: NodeJS.Timeout;
        return function(this: any, ...args: any[]) {
          const context = this;
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            callback.apply(context, args);
          }, limit);
        };
      }
      
      // Function to fetch elevation data
      const fetchElevation = async (lat: number, lng: number) => {
        // Update coordinates regardless of elevation fetch
        setCoordinates({ lat, lng })
        
        // Round to 4 decimal places for caching (~10m precision)
        const roundedLat = Math.round(lat * 10000) / 10000
        const roundedLng = Math.round(lng * 10000) / 10000
        const cacheKey = `${roundedLat},${roundedLng}`
        
        // Check cache first
        if (elevationCache[cacheKey]) {
          setElevation(elevationCache[cacheKey])
          setIsLoading(false)
          setHasError(false)
          return
        }
        
        setIsLoading(true)
        setHasError(false)
        try {
          // Using Open-Meteo API for elevation data
          const response = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${roundedLat}&longitude=${roundedLng}`)
          const data = await response.json()
          
          if (data && data.elevation && data.elevation.length > 0) {
            const elevationValue = Math.round(data.elevation[0])
            setElevation(elevationValue)
            setHasError(false)
            
            // Store in cache
            elevationCache[cacheKey] = elevationValue
          } else {
            setElevation(null)
            setHasError(true)
          }
        } catch (error) {
          console.error('Error fetching elevation data:', error)
          setElevation(null)
          setHasError(true)
        } finally {
          setIsLoading(false)
        }
      }
      
      // Create a container for elevation display
      const elevationContainer = L.DomUtil.create('div', 'elevation-control')
      elevationContainer.style.cssText = `
        position: absolute;
        bottom: 20px;
        right: 20px;
        background: rgba(40, 40, 40, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        font-family: sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        pointer-events: none;
        min-width: 180px;
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0.2);
        line-height: 1.5;
      `
      
      map.getContainer().appendChild(elevationContainer)
      
      // Debounced fetch to prevent too many API calls
      const throttledFetch = debounce(fetchElevation, 200)
      
      // Event handlers for mouse movement
      const handleMouseMove = (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
        throttledFetch(lat, lng)
      }
      
      const handleMouseOut = () => {
        setElevation(null)
        setCoordinates(null)
        setIsLoading(false)
        setHasError(false)
      }
      
      // Add event listeners
      map.on('mousemove', handleMouseMove)
      map.on('mouseout', handleMouseOut)
      
      // Update elevation display when elevation changes
      const updateElevationDisplay = () => {
        let elevationText = 'Elevation: --'
        let coordinatesText = 'Lat: -- | Lon: --'
        
        if (isLoading) {
          elevationText = 'Elevation: loading...'
        } else if (hasError) {
          elevationText = 'Elevation: unavailable'
        } else if (elevation !== null) {
          elevationText = `Elevation: ${elevation} m`
        }
        
        if (coordinates) {
          const { lat, lng } = coordinates
          // Format coordinates to 6 decimal places (sub-meter precision)
          coordinatesText = `Lat: ${lat.toFixed(6)} | Lon: ${lng.toFixed(6)}`
        }
        
        elevationContainer.innerHTML = `${coordinatesText} | ${elevationText}`
      }
      
      // Set up subscription to elevation changes
      const elevationInterval = setInterval(updateElevationDisplay, 100)
      
      // Clean up on unmount
      return () => {
        map.off('mousemove', handleMouseMove)
        map.off('mouseout', handleMouseOut)
        if (elevationContainer.parentNode) {
          elevationContainer.parentNode.removeChild(elevationContainer)
        }
        clearInterval(elevationInterval)
      }
    }
  }, [map, elevation, setElevation, isLoading, hasError, coordinates])
  
  return null
}

export default function Map() {
  const [isMounted, setIsMounted] = useState(false)
  const [elevation, setElevation] = useState<number | null>(null)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return <div className="w-full h-[80vh] bg-gray-200 animate-pulse rounded-md"></div>
  }
  
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: '80vh', width: '100%', zIndex: 10 }}
      className="rounded-md shadow-md"
      zoomControl={false} // Disable default zoom control, we'll position it manually
    >
      <ZoomControl position="topright" /> {/* Place zoom control at top right */}
      <FixLeafletIcons />
      <CustomFullscreenControl />
      <GlobalMapCSS />
      <DirectMapStyling />
      <ElevationControl elevation={elevation} setElevation={setElevation} />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenTopoMap">
          <TileLayer
            attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            maxZoom={17}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  )
} 