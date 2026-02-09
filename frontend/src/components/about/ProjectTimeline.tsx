"use client"

import { motion } from "framer-motion"
import { Calendar, Flag, GitCommit, CheckCircle } from "lucide-react"

const timeline = [
  {
    date: "Phase 1: Research",
    title: "Dataset Collection & Analysis",
    description: "Aggregated 10k+ samples from FaceForensics++, Celeb-DF, and DFDC datasets. Established baseline metrics.",
    icon: Calendar,
  },
  {
    date: "Phase 2: Development",
    title: "Model Architecture Design",
    description: "Implemented EfficientNet-B4 and Xception backbones. Developed custom head for binary classification.",
    icon: GitCommit,
  },
  {
    date: "Phase 3: Innovation",
    title: "Hybrid Forensic Integration",
    description: "Added dual-stream processing to analyze SRM (Spatial Rich Models) features alongside RGB data.",
    icon: Flag,
  },
  {
    date: "Phase 4: Optimization",
    title: "Ensemble & Deployment",
    description: "Combined model outputs for maximum accuracy (99.8%) and optimized inference speed for real-time use.",
    icon: CheckCircle,
  },
]

export function ProjectTimeline() {
  return (
    <div className="relative py-12">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 md:left-1/2 md:-ml-0.5"></div>

        <div className="space-y-12">
            {timeline.map((item, index) => (
                <TimelineItem key={index} item={item} index={index} />
            ))}
        </div>
    </div>
  )
}

function TimelineItem({ item, index }: { item: any, index: number }) {
    const isEven = index % 2 === 0
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex items-center md:justify-between ${isEven ? "md:flex-row-reverse" : ""}`}
        >
            {/* Dot on Line */}
            <div className="absolute left-8 -ml-3 w-6 h-6 rounded-full border-4 border-white bg-blue-500 shadow-md md:left-1/2 md:-ml-3 dark:border-slate-950"></div>

            <div className="ml-20 md:ml-0 md:w-[45%]">
                <div className={`p-6 bg-white rounded-xl shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 relative hover:shadow-md transition-shadow ${isEven ? "md:text-left" : "md:text-right"}`}>
                    
                    {/* Arrow */}
                    <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-t border-r border-slate-100 dark:bg-slate-900 dark:border-slate-800 rotate-45 hidden md:block ${isEven ? "-right-2" : "-left-2"}`}></div>

                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-3 dark:bg-blue-900/20 dark:text-blue-300">
                        {item.date}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {item.description}
                    </p>
                </div>
            </div>
            
            <div className="hidden md:block md:w-[45%]"></div>
        </motion.div>
    )
}
