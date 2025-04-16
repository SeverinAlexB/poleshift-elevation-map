import MapWrapper from '@/components/MapWrapper'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary-foreground bg-primary inline-block px-4 py-2 rounded-md shadow-md">Pole Shift Elevation Map</h1>
      </header>
      
      <main className="flex-grow">
        <div className="bg-card rounded-lg shadow-md p-6 mb-8 max-w-6xl">
          <div className="flex flex-col md:flex-row md:gap-8">
            <div className="md:w-1/2">
              <h2 className="text-xl font-semibold mb-3 text-card-foreground">Earth's Hidden Geography</h2>
              <p className="text-muted-foreground mb-4">A map focused on analyzing how mega-floods shaped our planet. Think of Pole shifts, Meltwater Pulses, ECDO, and more.</p>
            </div>
            
            <div className="md:w-1/2 mt-4 md:mt-0">
              <h3 className="font-medium text-lg mb-2 text-card-foreground">Key Features:</h3>
              <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                <li>Custom color scale that emphasizes elevation between 0 and 2000m</li>
                <li>Variable transparency to show sub-surface features</li>
                <li>Ocean depth visualized</li>
                <li>Find what was hidden before</li>
              </ul>
            </div>
          </div>
        </div>

        <MapWrapper />
      </main>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Created by <a href="https://x.com/SeverinAlexB" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-100">@SeverinAlexB</a></p>
      </footer>
    </div>
  );
}
