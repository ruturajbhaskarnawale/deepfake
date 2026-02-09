"use client"

import { GlitchText } from "@/components/about/GlitchText"
import { ArchitectureDiagram } from "@/components/about/ArchitectureDiagram"
import { ProjectTimeline } from "@/components/about/ProjectTimeline"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black overflow-hidden relative">
      
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 grid-background opacity-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white mb-6">
                The Battle Between <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                    <GlitchText text="REALITY" />
                </span>
                {" "}and{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
                    <GlitchText text="FABRICATION" />
                </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                In an era where seeing is no longer believing, our system restores trust through advanced forensic analysis and multi-modal deep learning.
            </p>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 bg-white dark:bg-slate-950/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">System Architecture</h2>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">
                      Visualizing the data flow from raw input to verifiable verdict.
                  </p>
              </div>
              <ArchitectureDiagram />
          </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-slate-50 dark:bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Project Evolution</h2>
                  <p className="mt-4 text-slate-600 dark:text-slate-400">
                      The journey from initial research to a production-ready detection system.
                  </p>
              </div>
              <div className="max-w-3xl mx-auto">
                  <ProjectTimeline />
              </div>
          </div>
      </section>
      
    </div>
  )
}
