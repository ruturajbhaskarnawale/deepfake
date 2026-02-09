"use client"

import { useSearchParams } from "next/navigation"
import { PredictionSummary } from "@/components/results/PredictionSummary"
import { DetailedMetrics } from "@/components/results/DetailedMetrics"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"

export default function ResultsPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const modelId = searchParams.get("model") || "hybrid_forensic"

  // Mock result data
  const isReal = Math.random() > 0.5
  const confidence = Math.floor(Math.random() * (99 - 85 + 1)) + 85

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
            <Link href="/detect">
                <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Detection
                </Button>
            </Link>
            <div className="flex gap-2">
                 <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Report
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <PredictionSummary result={isReal ? "REAL" : "FAKE"} confidence={confidence} />
            </div>
            
            <div className="lg:col-span-2 space-y-6">
                 <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-950 dark:border-slate-800">
                    <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Video Analysis Timeline</h3>
                    <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 dark:bg-slate-900">
                        TIMELINE VISUALIZATION PLACEHOLDER
                    </div>
                 </div>

                 <DetailedMetrics />
            </div>
        </div>
      </div>
    </div>
  )
}
