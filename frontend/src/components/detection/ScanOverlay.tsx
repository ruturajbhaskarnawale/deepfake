"use client"

import { motion } from "framer-motion"

export function ScanOverlay({ isScanning }: { isScanning: boolean }) {
  if (!isScanning) return null

  return (
    <div className="absolute inset-0 z-20 overflow-hidden rounded-xl pointer-events-none">
      {/* Scanning Line */}
      <motion.div
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear" 
        }}
        className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
      />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      {/* Corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>

      {/* Status Text */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded text-xs font-mono text-blue-400 border border-blue-500/30">
        ANALYZING ARTIFACTS...
      </div>
    </div>
  )
}
