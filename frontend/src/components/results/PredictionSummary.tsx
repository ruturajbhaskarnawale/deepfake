"use client"

import { motion } from "framer-motion"
import { CheckCircle, AlertTriangle } from "lucide-react"

interface PredictionSummaryProps {
  result: "REAL" | "FAKE"
  confidence: number
}

export function PredictionSummary({ result, confidence }: PredictionSummaryProps) {
  const isReal = result === "REAL"
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-950 dark:border-slate-800"
    >
      <div className={`p-8 text-center ${isReal ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10"}`}>
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            isReal ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {isReal ? <CheckCircle className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
        </motion.div>
        
        <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-500 mb-2 dark:text-slate-400">
          Detection Result
        </h2>
        
        <div className="flex flex-col items-center justify-center">
            <h1 className={`text-5xl font-bold tracking-tight mb-2 ${
                isReal ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
            }`}>
                {result}
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
                with <span className="font-bold">{confidence}%</span> confidence
            </p>
        </div>
      </div>
      
      <div className="px-8 py-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
          <div className="w-full bg-slate-100 rounded-full h-4 dark:bg-slate-800 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className={`h-full ${isReal ? "bg-green-500" : "bg-red-500"}`}
              />
          </div>
          <p className="text-xs text-center text-slate-400 mt-2">
            Probability Score
          </p>
      </div>
    </motion.div>
  )
}
