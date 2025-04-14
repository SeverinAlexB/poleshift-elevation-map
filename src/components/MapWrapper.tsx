'use client'

import dynamic from 'next/dynamic'

// Import the Map component dynamically with no SSR
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-[80vh] bg-gray-200 animate-pulse rounded-md"></div>
})

export default function MapWrapper() {
  return <Map />
} 