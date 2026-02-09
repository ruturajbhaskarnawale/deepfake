"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { UploadZone } from "@/components/detection/UploadZone"
import { ModelSelector, type ModelId } from "@/components/detection/ModelSelector"
import { AnalysisState } from "@/components/detection/AnalysisState"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function DetectPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [selectedModel, setSelectedModel] = useState<ModelId>("hybrid_forensic")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState("")

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
  }, [])

  const startAnalysis = async () => {
    if (!file) return

    setIsAnalyzing(true)
    
    // Simulate analysis steps
    const steps = [
        { progress: 10, label: "Uploading file..." },
        { progress: 30, label: "Preprocessing frames..." },
        { progress: 60, label: "Extracting facial features..." },
        { progress: 80, label: "Running inference with " + selectedModel.replace("_", " ") },
        { progress: 100, label: "Finalizing results..." }
    ]

    for (const s of steps) {
        setStep(s.label)
        setProgress(s.progress)
        await new Promise(r => setTimeout(r, 800)) // Fake delay
    }

    // Redirect to results (mock ID)
    router.push(`/results/123?model=${selectedModel}`)
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Deepfake Detection
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Upload an image or video to analyze it for manipulation artifacts.
            </p>
        </div>

        {!isAnalyzing ? (
            <>
                <UploadZone onFileSelect={handleFileSelect} />
                
                <ModelSelector 
                    selectedModel={selectedModel} 
                    onModelSelect={setSelectedModel}
                    disabled={!file}
                />

                <div className="flex justify-center mt-8">
                    <Button 
                        size="lg" 
                        onClick={startAnalysis} 
                        disabled={!file}
                        className="w-full max-w-sm"
                    >
                        Start Analysis
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </>
        ) : (
            <AnalysisState progress={progress} step={step} />
        )}
      </div>
    </div>
  )
}
