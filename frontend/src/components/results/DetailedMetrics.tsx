"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Activity, Fingerprint, Database } from "lucide-react"

interface MetricItemProps {
    label: string
    value: string
    icon: React.ElementType
}

function MetricItem({ label, value, icon: Icon }: MetricItemProps) {
    return (
        <div className="flex items-center p-4 bg-slate-50 rounded-lg dark:bg-slate-900/50">
            <div className="p-2 bg-white rounded-md shadow-sm mr-4 dark:bg-slate-800">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
        </div>
    )
}

export function DetailedMetrics() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Analysis Metrics</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricItem label="Inference Time" value="45ms" icon={Clock} />
                <MetricItem label="Model Accuracy" value="99.8%" icon={Activity} />
                <MetricItem label="F1 Score" value="0.98" icon={Fingerprint} />
                <MetricItem label="Dataset Size" value="10k+ Samples" icon={Database} />
            </div>
        </CardContent>
    </Card>
  )
}
