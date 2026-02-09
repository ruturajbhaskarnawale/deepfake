"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Cpu, Eye, Layers, Zap } from "lucide-react"
import { MouseEvent } from "react"

const capabilities = [
  {
    title: "EfficientNet-B4",
    description: "Transfer learning approach optimized for high accuracy on facial features.",
    accuracy: "100%",
    icon: Zap,
    status: "Best Performer",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Hybrid Forensic",
    description: "Dual-stream architecture combining RGB and SRM forensic analysis.",
    accuracy: "100%",
    icon: Layers,
    status: "Recommended",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    title: "Xception",
    description: "Deep learning model utilizing depthwise separable convolutions.",
    accuracy: "77.78%",
    icon: Cpu,
    status: "Good",
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    title: "CLIP",
    description: "Vision-language model for semantic understanding of manipulations.",
    accuracy: "44.44%",
    icon: Eye,
    status: "Experimental",
    gradient: "from-pink-500 to-rose-600",
  },
]

function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

    function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        x.set(clientX - left - width / 2)
        y.set(clientY - top - height / 2)
    }

    function onMouseLeave() {
        x.set(0)
        y.set(0)
    }

    const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])

    return (
        <motion.div
            style={{ 
                rotateX, 
                rotateY, 
                transformStyle: "preserve-3d",
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="perspective-1000 h-full"
        >
            <div className={className} style={{ transform: "translateZ(20px)" }}>
                {children}
            </div>
        </motion.div>
    )
}

export function KeyCapabilities() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
          >
            Powered by <span className="text-blue-600">Advanced AI</span> Architectures
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Our system leverages multiple cutting-edge models to ensure distinct detection vectors and reliable results.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <TiltCard className="h-full">
                  <Card className="h-full border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 overflow-hidden group">
                    {/* Gradient Border Top */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${capability.gradient}`} />
                    
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${capability.gradient} p-2.5 text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <capability.icon className="h-full w-full" />
                      </div>
                      <CardTitle className="group-hover:text-blue-600 transition-colors">{capability.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-6 h-12">
                        {capability.description}
                      </CardDescription>
                      
                      <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 dark:text-slate-400">Accuracy</span>
                            <span className="font-bold text-slate-900 dark:text-white">{capability.accuracy}</span>
                          </div>
                          
                          {/* Progress Bar Visual */}
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: capability.accuracy }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                className={`h-full bg-gradient-to-r ${capability.gradient}`}
                              />
                          </div>
                      </div>

                      <div className="mt-6 flex justify-between items-center">
                         <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
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
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
