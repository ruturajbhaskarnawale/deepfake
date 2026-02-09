"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Cpu, Eye, Layers, Zap } from "lucide-react"

const capabilities = [
  {
    title: "EfficientNet-B4",
    description: "Transfer learning approach optimized for high accuracy on facial features.",
    accuracy: "100%",
    icon: Zap,
    status: "Best Performer",
  },
  {
    title: "Hybrid Forensic",
    description: "Dual-stream architecture combining RGB and SRM forensic analysis.",
    accuracy: "100%",
    icon: Layers,
    status: "Recommended",
  },
  {
    title: "Xception",
    description: "Deep learning model utilizing depthwise separable convolutions.",
    accuracy: "77.78%",
    icon: Cpu,
    status: "Good",
  },
  {
    title: "CLIP",
    description: "Vision-language model for semantic understanding of manipulations.",
    accuracy: "44.44%",
    icon: Eye,
    status: "Experimental",
  },
]

export function KeyCapabilities() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Powered by Advanced AI Models
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Our system leverages multiple cutting-edge architectures to ensure reliable detection.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 dark:bg-blue-900/30">
                    <capability.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {capability.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Accuracy</span>
                    <span className={`text-sm font-bold ${
                      capability.status === "Best Performer" || capability.status === "Recommended" ? "text-green-600" :
                      capability.status === "Good" ? "text-yellow-600" : "text-red-500"
                    }`}>
                      {capability.accuracy}
                    </span>
                  </div>
                  <div className="mt-4">
                     <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        capability.status === "Best Performer" ? "bg-green-50 text-green-700 ring-green-600/20" :
                        capability.status === "Recommended" ? "bg-blue-50 text-blue-700 ring-blue-600/20" :
                        capability.status === "Good" ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20" :
                        "bg-red-50 text-red-700 ring-red-600/10"
                      }`}>
                       {capability.status}
                     </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
