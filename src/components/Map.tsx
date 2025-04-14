'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap, ZoomControl, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

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

// Add global CSS for fullscreen mode
const FullscreenCSS = () => {
  useEffect(() => {
    // Add CSS to handle fullscreen properly
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
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
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

export default function Map() {
  const [isMounted, setIsMounted] = useState(false)
  
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
      <FullscreenCSS />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Topographic">
          <TileLayer
            attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            maxZoom={17}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    </MapContainer>
  )
} 