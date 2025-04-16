import MapWrapper from '@/components/MapWrapper'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">ECDO Elevation Map</h1>
      </header>
      
      <main className="flex-grow">

        <div>
          <p>A map focused on analyzing how mega-floods shaped our planet. Pole shifts, Meltwater Pulses, ECDO, and more.</p>
          <ul>
            <li>Custom color scale that emphasizes elevation between 0 and 2000m</li>
            <li>Variable transparency to show sub-surface features</li>
            <li>Ocean depth visualized</li>
            <li>Find what was hidden before</li>
          </ul>
        </div>

        <MapWrapper />
      </main>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Created by <a href="https://x.com/SeverinAlexB" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-100">@SeverinAlexB</a></p>
      </footer>
    </div>
  );
}
