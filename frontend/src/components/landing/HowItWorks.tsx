"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { UploadCloud, Zap, SearchCheck } from "lucide-react"

const features = [
  {
    icon: UploadCloud,
    title: "Upload Media",
    description: "Securely upload your image or video. We support multiple formats and ensure data privacy.",
    color: "bg-blue-500",
  },
  {
    icon: Zap,
    title: "AI Analysis",
    description: "Our multi-model engine scans for biological signals, frequency anomalies, and visual artifacts.",
    color: "bg-purple-500",
  },
  {
    icon: SearchCheck,
    title: "Instant Results",
    description: "Get a detailed forensic report with confidence scores and specific defect highlights.",
    color: "bg-green-500",
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Vertical line drawing animation
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"])

  return (
    <section ref={ref} className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
          >
            How It Works
          </motion.h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            A seamless three-step process to verify media authenticity.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Progress Line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-slate-100 dark:bg-slate-800 -translate-x-1/2 hidden md:block">
             <motion.div 
                style={{ height: lineHeight }}
                className="w-full bg-blue-600 dark:bg-blue-500 origin-top"
             />
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <FeatureRow key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureRow({ feature, index }: { feature: any, index: number }) {
    const isEven = index % 2 === 0
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
        >
            <div className={`flex-1 text-center ${isEven ? "md:text-right" : "md:text-left"}`}>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                    {feature.description}
                </p>
            </div>
            
            <div className="relative flex-shrink-0 z-10">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 ${feature.color} text-white`}>
                    <feature.icon className="w-8 h-8" />
                </div>
                {/* Pulse wave effect */}
                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${feature.color}`}></div>
            </div>

            <div className="flex-1 hidden md:block"></div>
        </motion.div>
    )
}
