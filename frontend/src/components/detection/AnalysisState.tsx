"use client"

import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface AnalysisStateProps {
  progress: number
  step: string
}

export function AnalysisState({ progress, step }: AnalysisStateProps) {
  return (
    <div className="w-full max-w-xl mx-auto mt-8 text-center bg-white p-8 rounded-xl border border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center space-y-4"
      >
        <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            <div className="relative bg-white rounded-full p-3 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin dark:text-blue-400" />
            </div>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Analyzing Media...
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 pb-2">
          {step}
        </p>

        <Progress value={progress} className="h-2 w-full max-w-xs mx-auto" />
        
        <p className="text-xs text-slate-400 mt-2">
            This may take a few seconds depending on file size.
        </p>
      </motion.div>
    </div>
  )
}
