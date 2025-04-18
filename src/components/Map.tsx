'use client'

import { useEffect, useState, useRef } from 'react'
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
      
      .grayscale-tiles {
        filter: grayscale(100%) !important;
      }
      
      .controls-hidden .leaflet-control,
      .controls-hidden .elevation-control,
      .controls-hidden .elevation-legend,
      .controls-hidden .transparency-control {
        display: none !important;
      }
      
      .controls-hidden .toggle-controls-button {
        display: flex !important;
      }

      /* Adjust the position of controls to make space for toggle button */
      .leaflet-control-zoom {
        margin-top: 45px !important;
      }

      .leaflet-control-layers {
        margin-top: 10px !important;
      }

      .leaflet-control-fullscreen {
        margin-top: 5px !important;
        margin-right: 12px !important;
      }

      .elevation-legend {
        top: 230px !important;
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

// Transparency Control component
const TransparencyControl = () => {
  const map = useMap()
  const [opacity, setOpacity] = useState(0.4)
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Create control container
      const controlContainer = L.DomUtil.create('div', 'transparency-control')
      controlContainer.style.cssText = `
        background: white;
        padding: 8px 12px;
        border-radius: 4px;
        box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        font-family: sans-serif;
        font-size: 12px;
        font-weight: 500;
        width: 240px;
        border: 1px solid rgba(0,0,0,0.2);
      `
      
      // Create label container to hold both label and value display
      const labelContainer = document.createElement('div')
      labelContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
      `
      
      // Create label
      const label = document.createElement('label')
      label.style.cssText = `
        font-weight: bold;
        color: #333;
        font-size: 13px;
        text-shadow: 0px 0px 1px rgba(255,255,255,0.7);
      `
      label.textContent = 'Elevation Transparency'
      
      // Value display
      const valueDisplay = document.createElement('div')
      valueDisplay.style.cssText = `
        font-size: 13px;
        color: #333;
        font-weight: bold;
        text-shadow: 0px 0px 1px rgba(255,255,255,0.7);
        margin-left: 5px;
      `
      valueDisplay.textContent = `${Math.round(opacity * 100)}%`
      
      // Create slider control
      const slider = document.createElement('input')
      slider.type = 'range'
      slider.min = '0'
      slider.max = '1'
      slider.step = '0.05'
      slider.value = opacity.toString()
      slider.style.cssText = `
        width: 100%;
        margin: 0;
      `
      
      // Add elements to container
      labelContainer.appendChild(label)
      labelContainer.appendChild(valueDisplay)
      controlContainer.appendChild(labelContainer)
      controlContainer.appendChild(slider)
      
      // Create custom control
      const TransparencySliderControl = L.Control.extend({
        options: {
          position: 'bottomleft'
        },
        
        onAdd: function() {
          return controlContainer
        }
      })
      
      // Add control to map
      const transparencyControl = new TransparencySliderControl()
      transparencyControl.addTo(map)
      
      // Handle slider changes
      const handleSliderChange = (e: Event) => {
        // Prevent map interactions while adjusting slider
        L.DomEvent.stopPropagation(e)
        
        const target = e.target as HTMLInputElement
        const newOpacity = parseFloat(target.value)
        setOpacity(newOpacity)
        
        // Update displayed value
        valueDisplay.textContent = `${Math.round(newOpacity * 100)}%`
        
        // Find and update all elevation overlay layers
        map.eachLayer((layer: any) => {
          if (layer._url && layer._url.includes('elevation-map')) {
            layer.setOpacity(newOpacity)
          }
        })
      }
      
      // Prevent map interactions on control
      L.DomEvent.disableClickPropagation(controlContainer)
      L.DomEvent.disableScrollPropagation(controlContainer)
      
      // Add event listener
      slider.addEventListener('input', handleSliderChange)
      
      // Fix dragging issues by preventing default behavior and stopping propagation
      slider.addEventListener('mousedown', (e) => {
        e.stopPropagation()
        
        // Add temporary event listeners on the document
        const handleMouseMove = (e: MouseEvent) => {
          e.stopPropagation()
          e.preventDefault()
        }
        
        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }
        
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
      })
      
      // Improve interaction behavior
      slider.addEventListener('touchstart', (e) => {
        e.stopPropagation()
      })
      
      slider.addEventListener('touchmove', (e) => {
        e.stopPropagation()
      })
      
      // Add visual feedback on hover
      slider.addEventListener('mouseover', () => {
        slider.style.cursor = 'pointer'
      })
      
      // Clean up on unmount
      return () => {
        slider.removeEventListener('input', handleSliderChange)
        slider.removeEventListener('mousedown', () => {})
        slider.removeEventListener('touchstart', () => {})
        slider.removeEventListener('touchmove', () => {})
        slider.removeEventListener('mouseover', () => {})
        map.removeControl(transparencyControl)
      }
    }
  }, [map, opacity])
  
  return null
}

// Elevation Legend component
const ElevationLegend = () => {
  const map = useMap()
  const [colormapData, setColormapData] = useState<Array<{elevation: number, color: string}>>([])
  const [isVisible, setIsVisible] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const legendContainerRef = useRef<HTMLDivElement | null>(null)
  const hasInitializedRef = useRef(false)
  
  // First effect to create the legend container
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Create control container
      const legendContainer = L.DomUtil.create('div', 'elevation-legend')
      legendContainer.style.cssText = `
        position: absolute;
        top: 190px;
        right: 10px;
        background: white;
        border-radius: 4px;
        box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        font-family: sans-serif;
        font-size: 12px;
        z-index: 999; /* Set lower than layers control (1000) */
        max-height: 60vh;
        overflow-y: auto;
        transition: all 0.3s ease;
        border: 1px solid rgba(0,0,0,0.2);
        display: block; /* Ensure it's visible */
        width: 75px; /* Width to fit shorter title */
      `
      
      // Add the container to the map
      map.getContainer().appendChild(legendContainer)
      legendContainerRef.current = legendContainer
      
      // Add a subtle border to make it stand out
      legendContainer.style.border = '1px solid rgba(0,0,0,0.2)'
      
      // Prevent map interactions on control
      L.DomEvent.disableClickPropagation(legendContainer)
      L.DomEvent.disableScrollPropagation(legendContainer)
      
      // Initial visibility check after a delay to ensure layers are loaded
      setTimeout(() => {
        checkOverlayStatus()
      }, 500)
      
      // Clean up on unmount
      return () => {
        if (legendContainer.parentNode) {
          legendContainer.parentNode.removeChild(legendContainer)
        }
      }
    }
  }, [map])

  // Check if the elevation overlay is visible and update legend visibility
  const checkOverlayStatus = () => {
    if (!legendContainerRef.current || !map) return
    
    let hasElevationOverlay = false
    map.eachLayer((layer: any) => {
      if (layer._url && layer._url.includes('elevation-map')) {
        hasElevationOverlay = true
      }
    })
    
    // Always set to true initially, since the overlay is checked by default in the LayersControl
    const shouldBeVisible = hasElevationOverlay || !hasInitializedRef.current
    setIsVisible(shouldBeVisible)
    
    if (legendContainerRef.current) {
      legendContainerRef.current.style.display = shouldBeVisible ? 'block' : 'none'
    }
  }
  
  // Listen for overlay add/remove events
  useEffect(() => {
    if (!map) return
    
    // Attach event listeners for overlay changes
    map.on('overlayadd', (e: any) => {
      if (e.name === 'Elevation Overlay') {
        setIsVisible(true)
        if (legendContainerRef.current) {
          legendContainerRef.current.style.display = 'block'
        }
      }
    })
    
    map.on('overlayremove', (e: any) => {
      if (e.name === 'Elevation Overlay') {
        setIsVisible(false)
        if (legendContainerRef.current) {
          legendContainerRef.current.style.display = 'none'
        }
      }
    })
    
    return () => {
      map.off('overlayadd')
      map.off('overlayremove')
    }
  }, [map])
  
  // Second effect to fetch and update colormap data
  useEffect(() => {
    // Fetch and parse colormap data
    const fetchColormap = async () => {
      try {
        const response = await fetch('/elevation-colormap.txt')
        const text = await response.text()
        
        // Parse the colormap data
        const lines = text.split('\n')
        const parsedData: Array<{elevation: number, color: string}> = []
        
        for (const line of lines) {
          // Skip comments and empty lines
          if (line.startsWith('#') || line.startsWith('INTERPOLATION') || !line.trim()) continue
          
          // Parse each line - format is value,r,g,b,alpha,label
          const parts = line.split(',')
          if (parts.length >= 5) {
            const elevation = parseFloat(parts[0])
            const r = parseInt(parts[1])
            const g = parseInt(parts[2])
            const b = parseInt(parts[3])
            
            if (!isNaN(elevation) && !isNaN(r) && !isNaN(g) && !isNaN(b)) {
              parsedData.push({
                elevation,
                color: `rgb(${r}, ${g}, ${b})`
              })
            }
          }
        }
        
        // Filter to reduce the number of entries for display
        if (parsedData.length > 20) {
          const step = Math.floor(parsedData.length / 20)
          const filteredData = []
          
          for (let i = 0; i < parsedData.length; i += step) {
            filteredData.push(parsedData[i])
          }
          
          // Ensure we include the last entry (highest elevation)
          if (filteredData[filteredData.length - 1] !== parsedData[parsedData.length - 1]) {
            filteredData.push(parsedData[parsedData.length - 1])
          }
          
          setColormapData(filteredData)
        } else {
          setColormapData(parsedData)
        }
        
        // Force an update immediately after data is available
        setTimeout(() => {
          updateLegend()
          hasInitializedRef.current = true
        }, 50)
      } catch (error) {
        console.error('Error loading elevation colormap:', error)
      }
    }
    
    // Call fetchColormap only once
    fetchColormap()
  }, [])
  
  // Third effect to update the legend when necessary
  useEffect(() => {
    if (!legendContainerRef.current || colormapData.length === 0) return
    
    // Set up interval to ensure legend is visible after initial render
    const checkInitialization = setInterval(() => {
      if (colormapData.length > 0) {
        updateLegend()
        checkOverlayStatus()
        if (!hasInitializedRef.current) {
          hasInitializedRef.current = true
        }
        clearInterval(checkInitialization)
      }
    }, 200)
    
    // Update again when the state changes
    updateLegend()
    
    return () => {
      clearInterval(checkInitialization)
    }
  }, [colormapData, isVisible, isCollapsed])
  
  // Function to update the legend display
  const updateLegend = () => {
    const legendContainer = legendContainerRef.current
    if (!legendContainer || colormapData.length === 0) return
    
    // Clear existing content
    legendContainer.innerHTML = ''
    
    if (isCollapsed) {
      // Just show header when collapsed
      legendContainer.style.width = '32px'
      legendContainer.style.height = '32px'
      legendContainer.style.overflow = 'hidden'
      
      const header = document.createElement('div')
      header.style.cssText = `
        padding: 6px;
        font-weight: bold;
        cursor: pointer;
        text-align: center;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        color: #333;
        background-color: #f8f8f8;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      `
      header.textContent = 'H'
      header.title = 'Elevation Legend'
      header.addEventListener('click', () => {
        setIsCollapsed(false)
      })
      
      legendContainer.appendChild(header)
      return
    }
    
    // Expanded view
    legendContainer.style.width = '75px'
    legendContainer.style.height = 'auto'
    
    // Create header
    const header = document.createElement('div')
    header.style.cssText = `
      display: flex;
      flex-direction: column;
      padding: 5px 8px;
      font-weight: bold;
      background: #f8f8f8;
      border-bottom: 1px solid #eee;
      font-size: 11px;
      color: #333;
    `
    
    // Create a container for the button row
    const buttonRow = document.createElement('div')
    buttonRow.style.cssText = `
      display: flex;
      justify-content: flex-end;
      width: 100%;
      margin-bottom: 3px;
    `
    
    const closeButton = document.createElement('button')
    closeButton.style.cssText = `
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      width: 14px;
      height: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
    `
    closeButton.innerHTML = '−'
    closeButton.title = 'Collapse legend'
    closeButton.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsCollapsed(true)
    })
    
    // Add button to button row
    buttonRow.appendChild(closeButton)
    
    const title = document.createElement('div')
    title.textContent = 'Height (m)'
    title.style.color = '#333';
    title.style.textAlign = 'center';
    title.style.width = '100%';
    
    // Add both rows to header
    header.appendChild(buttonRow)
    header.appendChild(title)
    legendContainer.appendChild(header)
    
    // Create gradient display
    const gradientContainer = document.createElement('div')
    gradientContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      padding: 6px;
      color: #333;
    `
    
    // Generate gradient stops
    const sortedData = [...colormapData].sort((a, b) => a.elevation - b.elevation)
    const maxElevation = sortedData[sortedData.length - 1].elevation
    
    // Find cutoff index for elevations above 2000m (changed from 2200m)
    const cutoffElevation = 2000
    const cutoffIndex = sortedData.findIndex(item => item.elevation > cutoffElevation)
    
    // Create modified data that caps at 2000m for display purposes
    let displayData = sortedData
    let displayMaxElevation = maxElevation
    
    if (cutoffIndex > 0) {
      // Keep all data up to cutoff point and add one entry at 2000m with the color at that elevation
      const cutoffItemIndex = Math.max(0, cutoffIndex - 1)
      const cutoffColor = sortedData[cutoffItemIndex].color
      
      displayData = [
        ...sortedData.filter(item => item.elevation <= cutoffElevation),
        { elevation: cutoffElevation, color: cutoffColor }
      ]
      displayMaxElevation = cutoffElevation
    }
    
    // Calculate virtual positions for the 2000m and 2200m points to ensure enough color space
    // This ensures the highest color (red) extends further down to cover both top labels
    const topSpacer = 0.1; // Add 10% extra space at the top for the highest color
    const displayDataWithSpacers = [...displayData];
    
    // Generate gradient stops with extension at edges and more space for top color
    const extendedGradientStops = [
      `${displayData[0].color} 0%`, // Bottom color at 0%
      ...displayData.slice(0, -1).map(item => // All but the highest color point
        `${item.color} ${(item.elevation / displayMaxElevation) * (1 - topSpacer) * 100}%`
      ),
      `${displayData[displayData.length - 1].color} ${(1 - topSpacer) * 100}%`, // Highest color starts lower
      `${displayData[displayData.length - 1].color} 100%` // Highest color extends to the top
    ].join(', ')
    
    // Create gradient bar
    const gradientBar = document.createElement('div')
    gradientBar.style.cssText = `
      width: 100%;
      height: 150px;
      background: linear-gradient(to top, ${extendedGradientStops});
      margin-bottom: 8px;
      position: relative;
      border-radius: 2px;
      box-shadow: inset 0 0 3px rgba(0,0,0,0.1);
    `
    
    // Create predefined elevation labels with clean numbers
    const labelValues = [0, 500, 1000, 1500, 2000]
    
    // Add labels at clean intervals with adjustments for edge labels
    labelValues.forEach((elevation, index) => {
      // Calculate position based on the elevation with slight inset for edge labels
      let labelPos;
      if (index === 0) {
        labelPos = 95; // Position lowest label slightly above the bottom edge
      } else if (index === labelValues.length - 1) {
        labelPos = 5; // Position highest label slightly below the top edge
      } else {
        // Scale the middle labels to account for the top spacer
        const normalizedPos = (elevation / displayMaxElevation) * (1 - topSpacer);
        labelPos = 100 - (normalizedPos * 100);
      }
      
      // Special formatting for the highest label if we're using a cutoff
      const isHighestLabel = elevation === 2000
      
      const label = document.createElement('div')
      label.style.cssText = `
        position: absolute;
        right: 0;
        left: 0;
        top: ${labelPos}%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.4);
        padding: 0px 2px;
        border-radius: 1px;
        font-size: 9px;
        font-weight: bold;
        width: 42px;
        margin: 0 auto;
        text-align: center;
        color: #333;
        box-shadow: none;
      `
      
      // Format the label text
      if (isHighestLabel) {
        label.textContent = `>2000m`;
      } else if (elevation >= 1000) {
        label.textContent = `${elevation}m`;
      } else {
        label.textContent = `${elevation}m`;
      }
      
      gradientBar.appendChild(label)
    })
    
    gradientContainer.appendChild(gradientBar)
    legendContainer.appendChild(gradientContainer)
  }
  
  return null
}

// Toggle Controls Button component
const ToggleControlsButton = ({ isControlsVisible, setIsControlsVisible }: { 
  isControlsVisible: boolean, 
  setIsControlsVisible: (value: boolean) => void 
}) => {
  const map = useMap()
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined' && document) {
      // Create a custom control button
      const toggleButton = document.createElement('button')
      toggleButton.className = 'toggle-controls-button'
      toggleButton.title = isControlsVisible ? 'Hide Controls' : 'Show Controls'
      
      // SVG icons for better visibility
      const hideIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>`
      
      const showIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>`
      
      toggleButton.innerHTML = isControlsVisible ? hideIcon : showIcon
      toggleButton.style.cssText = `
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
        position: absolute;
        top: 10px;
        right: 12px;
        z-index: 1000;
      `
      
      // Add to map container directly to ensure it's always accessible
      map.getContainer().appendChild(toggleButton)
      
      // Toggle controls function
      const toggleControls = () => {
        const newValue = !isControlsVisible
        setIsControlsVisible(newValue)
        
        // Update icon and title
        toggleButton.innerHTML = newValue ? hideIcon : showIcon
        toggleButton.title = newValue ? 'Hide Controls' : 'Show Controls'
        
        // Toggle CSS class on map container
        if (newValue) {
          map.getContainer().classList.remove('controls-hidden')
        } else {
          map.getContainer().classList.add('controls-hidden')
        }
      }
      
      // Add event listener
      toggleButton.addEventListener('click', toggleControls)
      
      // Add hover effect
      toggleButton.addEventListener('mouseenter', () => {
        toggleButton.style.backgroundColor = '#f4f4f4'
      })
      
      toggleButton.addEventListener('mouseleave', () => {
        toggleButton.style.backgroundColor = 'white'
      })
      
      // Apply initial state
      if (!isControlsVisible) {
        map.getContainer().classList.add('controls-hidden')
      }
      
      // Clean up on unmount
      return () => {
        toggleButton.removeEventListener('click', toggleControls)
        toggleButton.removeEventListener('mouseenter', () => {})
        toggleButton.removeEventListener('mouseleave', () => {})
        if (toggleButton.parentNode) {
          toggleButton.parentNode.removeChild(toggleButton)
        }
      }
    }
  }, [map, isControlsVisible, setIsControlsVisible])
  
  return null
}

export default function Map() {
  const [isMounted, setIsMounted] = useState(false)
  const [elevation, setElevation] = useState<number | null>(null)
  const [isControlsVisible, setIsControlsVisible] = useState(true)
  
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
      <TransparencyControl />
      <ElevationLegend />
      <ToggleControlsButton isControlsVisible={isControlsVisible} setIsControlsVisible={setIsControlsVisible} />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
        
        <LayersControl.BaseLayer name="Satellite (Grayscale)">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            maxZoom={20}
            className="grayscale-tiles"
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
        <LayersControl.Overlay checked name="Elevation Overlay">
          <TileLayer
            attribution='Elevation'
            url="https://storage.googleapis.com/flood-zyx-tiles/elevation-map/{z}/{x}/{y}.png"
            maxZoom={19}
            maxNativeZoom={10}
            tms={false}
            opacity={0.5}
            zoomOffset={0}
            noWrap={false}
            zoomReverse={false}
            keepBuffer={10}
            updateWhenIdle={false}
            updateWhenZooming={true}
            bounds={L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="ECDO Overlay">
          <TileLayer
            attribution='ECDO'
            url="https://storage.googleapis.com/flood-zyx-tiles/ecdo-overlay/{z}/{x}/{y}.png"
            maxZoom={4}
            maxNativeZoom={2}
            tms={false}
            opacity={1}
            zoomOffset={0}
            noWrap={false}
            zoomReverse={false}
            keepBuffer={10}
            updateWhenIdle={false}
            updateWhenZooming={true}
            bounds={L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))}
          />
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  )
} 