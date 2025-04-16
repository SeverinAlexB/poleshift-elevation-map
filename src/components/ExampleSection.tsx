import React from 'react'
import Image from 'next/image'

export default function ExampleSection() {
  return (
    <section className="bg-card/90 backdrop-blur-sm rounded-xl shadow-xl border border-emerald-500/10 p-6 md:p-8 mb-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
          <span className="text-emerald-500">Example Features</span>
        </h2>
        
        <div className="flex gap-6 ">
          <Image 
            src="/imgs/north-africa-nozle.png"
            alt="North Africa Nozle"
            width={500}
            height={300}
            className="rounded-lg"
          />
          <div className="flex flex-col">
            <h3 className="font-medium text-lg mb-2 text-emerald-500">North African Nozzle</h3>
            <p className="text-muted-foreground">
              North Africa <a href="https://x.com/EthicalSkeptic/status/1894461705268101545" target="_blank" rel="noopener noreferrer" 
              className="text-blue-500 hover:text-blue-500/80 transition-colors underline hover:cursor-default">
              shows clear evidence of a mega-floods
              </a>. When 
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 