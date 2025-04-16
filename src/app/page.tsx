import MapWrapper from '@/components/MapWrapper'
import ExampleSection from '@/components/ExampleSection'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8">
      <header className="mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-orange-500/10 rounded-xl blur-3xl opacity-40 -z-10"></div>
        
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold py-3 rounded-lg shadow-lg text-emerald-500">
            Pole Shift Elevation Map
          </h1>
          <h2 className="text-lg md:text-xl font-medium text-emerald-500">
            Map emphasizing elevations between 0 and 2000 meters
          </h2>
        </div>

        <div className="bg-card/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-emerald-500/10 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:gap-10">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-semibold mb-4 text-card-foreground flex items-center">
                  <span className="text-emerald-500">Earth's Hidden Geography</span>
                  <div className="ml-3 h-px w-16 bg-gradient-to-r from-emerald-500 to-transparent"></div>
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  A sophisticated mapping tool designed to analyze how mega-floods shaped our planet. 
                  Explore the geological evidence of <span className="text-emerald-500 font-medium">Pole Shifts, Meltwater Pulses, ECDO</span>, and other earth-changing events through detailed elevation visualizations.
                </p>
              </div>
              
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-emerald-500 rounded-full mr-3"></div>
                  <h3 className="font-medium text-lg text-card-foreground">Key Features</h3>
                </div>
                <ul className="space-y-3 pl-5 text-muted-foreground">
                  <li className="flex items-start group">
                    <svg className="h-5 w-5 text-emerald-500 group-hover:text-emerald-500/80 transition-colors mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="group-hover:text-emerald-500 transition-colors">Custom color scale emphasizing elevations between 0 and 2000 meters.</span>
                  </li>
                  <li className="flex items-start group">
                    <svg className="h-5 w-5 text-emerald-500 group-hover:text-emerald-500/80 transition-colors mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="group-hover:text-emerald-500 transition-colors">Variable transparency to reveal sub-surface features</span>
                  </li>
                  <li className="flex items-start group">
                    <svg className="h-5 w-5 text-emerald-500 group-hover:text-emerald-500/80 transition-colors mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="group-hover:text-emerald-500 transition-colors">Detailed ocean depth visualization</span>
                  </li>
                  <li className="flex items-start group">
                    <svg className="h-5 w-5 text-emerald-500 group-hover:text-emerald-500/80 transition-colors mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="group-hover:text-emerald-500 transition-colors">Uncover geological patterns hidden in plain sight</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <MapWrapper />
        <ExampleSection />
      </main>
      
      <footer className="mt-8 mb-16 text-center text-gray-500 text-sm">
        <p>Created by <a href="https://x.com/SeverinAlexB" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500">@SeverinAlexB</a></p>
        <div className="mt-3 flex justify-center">
          <a 
            href="https://github.com/SeverinAlexB/poleshift-elevation-map" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path fill="currentColor" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <span className="hover:underline">Edit Me On GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
