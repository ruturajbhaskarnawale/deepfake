"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { UploadZone } from "@/components/detection/UploadZone"
import { ModelSelector, type ModelId } from "@/components/detection/ModelSelector"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ScanOverlay } from "@/components/detection/ScanOverlay"
import { AnalysisLog } from "@/components/detection/AnalysisLog"

export default function DetectPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [selectedModel, setSelectedModel] = useState<ModelId>("hybrid_forensic")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
  }, [])

  const startAnalysis = async () => {
    if (!file) return

    setIsAnalyzing(true)
    
    // Simulate analysis time (matched with log duration)
    await new Promise(r => setTimeout(r, 6000))

    // Redirect to results (mock ID)
    router.push(`/results/123?model=${selectedModel}`)
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px] -z-10"></div>
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
               <span className="text-blue-500 font-mono text-sm block mb-2 tracking-widest uppercase">Forensic Analysis Lab</span>
               Content Verification
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto">
               Secure environment for deepfake detection. Files are processed locally in a sandboxed container.
            </p>
        </div>

        <div className="relative">
            {/* Main Interface */}
            <div className={`transition-all duration-500 ${isAnalyzing ? "opacity-50 blur-sm pointer-events-none" : "opacity-100"}`}>
                <UploadZone onFileSelect={handleFileSelect} />
                <div className="mt-8">
                     <ModelSelector 
                        selectedModel={selectedModel} 
                        onModelSelect={setSelectedModel}
                        disabled={!file}
                    />
                </div>
            </div>

            {/* Scanning Overlay (Absolute positioned on top of upload zone in a real app, but here traversing whole section) */}
            {isAnalyzing && (
                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <ScanOverlay isScanning={isAnalyzing} />
                 </div>
            )}
        </div>

        {/* Start Button */}
        {!isAnalyzing && (
             <div className="flex justify-center">
                <Button 
                    size="lg" 
                    onClick={startAnalysis} 
                    disabled={!file}
                    className="w-full max-w-sm bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-blue-400/50"
                >
                    Initialize Scan
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        )}

        {/* Real-time Log */}
        <div className="h-64">
             <AnalysisLog isAnalyzing={isAnalyzing} />
        </div>
      </div>
    </div>
  )
}
