"use client"

import { CheckCircle2, Layers, Zap, Cpu, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

export type ModelId = "efficientnet_b4" | "hybrid_forensic" | "xception" | "clip"

interface ModelSelectorProps {
  selectedModel: ModelId
  onModelSelect: (model: ModelId) => void
  disabled?: boolean
}

const models = [
  {
    id: "hybrid_forensic",
    name: "Hybrid Forensic",
    description: "Best for overall accuracy. Combines RGB & SRM analysis.",
    icon: Layers,
    recommended: true,
  },
  {
    id: "efficientnet_b4",
    name: "EfficientNet-B4",
    description: "High accuracy on standard deepfakes.",
    icon: Zap,
    recommended: false,
  },
  {
    id: "xception",
    name: "Xception",
    description: "Good balance of speed and accuracy.",
    icon: Cpu,
    recommended: false,
  },
  {
    id: "clip",
    name: "CLIP",
    description: "Experimental vision-language analysis.",
    icon: Eye,
    recommended: false,
  },
] as const

export function ModelSelector({ selectedModel, onModelSelect, disabled }: ModelSelectorProps) {
  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 dark:text-white">
        Select Detection Model
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {models.map((model) => {
            const isSelected = selectedModel === model.id
            return (
                <div
                key={model.id}
                onClick={() => !disabled && onModelSelect(model.id as ModelId)}
                className={cn(
                    "relative flex cursor-pointer rounded-lg border p-4 shadow-sm transition-all select-none",
                    isSelected
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-opacity-50 dark:bg-blue-900/20 dark:border-blue-500"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900",
                    disabled && "cursor-not-allowed opacity-50"
                )}
                >
                    <div className="flex w-full items-start justify-between">
                        <div className="flex items-center">
                            <div className="text-sm">
                                <p className={cn(
                                    "font-medium flex items-center gap-2",
                                    isSelected ? "text-blue-900 dark:text-blue-100" : "text-slate-900 dark:text-white"
                                )}>
                                    <model.icon className="h-4 w-4" />
                                    {model.name}
                                </p>
                                <span className={cn(
                                    "inline text-xs mt-1 block",
                                    isSelected ? "text-blue-700 dark:text-blue-300" : "text-slate-500 dark:text-slate-400"
                                )}>
                                    {model.description}
                                </span>
                            </div>
                        </div>
                        {isSelected && (
                            <div className="shrink-0 text-blue-600 dark:text-blue-400">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        )}
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  )
}
