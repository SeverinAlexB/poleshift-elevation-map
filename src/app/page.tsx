import MapWrapper from '@/components/MapWrapper'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8">
      <header className="mb-10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-orange-500/10 rounded-xl blur-3xl opacity-40 -z-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground bg-emerald-500 px-5 py-3 rounded-lg shadow-lg transform hover:scale-[1.02] transition-transform duration-300 border-l-4 border-emerald-500">
            Pole Shift Elevation Map
          </h1>
        
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
                  Explore the geological evidence of <span className="text-orange-500 font-medium">Pole shifts</span>, <span className="text-emerald-500 font-medium">Meltwater Pulses</span>, <span className="text-emerald-500 font-medium">ECDO</span>, and other 
                  earth-changing events through detailed elevation visualization.
                </p>
              </div>
              
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
                  <h3 className="font-medium text-lg text-card-foreground">Key Features</h3>
                </div>
                <ul className="space-y-3 pl-5 text-muted-foreground">
                  <li className="flex items-start group">
                    <svg className="h-5 w-5 text-emerald-500 group-hover:text-emerald-500/80 transition-colors mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="group-hover:text-emerald-500 transition-colors">Custom color scale emphasizing elevation between 0-2000m</span>
                  </li>
                  <li className="flex items-start group">
                    <svg className="h-5 w-5 text-emerald-500 group-hover:text-emerald-500/80 transition-colors mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="group-hover:text-emerald-500 transition-colors">Variable transparency to reveal sub-surface features</span>
                  </li>
                  <li className="flex items-start group">
                    <svg className="h-5 w-5 text-orange-500 group-hover:text-orange-500/80 transition-colors mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="group-hover:text-orange-500 transition-colors">Detailed ocean depth visualization</span>
                  </li>
                  <li className="flex items-start group">
                    <svg className="h-5 w-5 text-orange-500 group-hover:text-orange-500/80 transition-colors mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="group-hover:text-orange-500 transition-colors">Uncover geological patterns hidden in plain sight</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <MapWrapper />
      </main>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Created by <a href="https://x.com/SeverinAlexB" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-500">@SeverinAlexB</a></p>
      </footer>
    </div>
  );
}
