import MapWrapper from '@/components/MapWrapper'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Leaflet Satellite Map</h1>
      </header>
      
      <main className="flex-grow">
        <MapWrapper />
      </main>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Created with Next.js and Leaflet</p>
      </footer>
    </div>
  );
}
