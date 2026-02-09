"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, PlayCircle, Fingerprint, ScanFace } from "lucide-react"

export function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Parallax effects
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200])
  const yBackground = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Mouse follow effect for the gradient spotlight
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <section 
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-black py-20 sm:py-32"
    >
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Mouse Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Animated Floating Elements */}
      <FloatingIcon icon={ScanFace} className="absolute top-1/4 left-[15%] text-blue-500/20 w-24 h-24" delay={0} />
      <FloatingIcon icon={Fingerprint} className="absolute bottom-1/4 right-[15%] text-purple-500/20 w-32 h-32" delay={1} />
      <FloatingIcon icon={ShieldCheck} className="absolute top-1/3 right-[20%] text-emerald-500/20 w-16 h-16" delay={0.5} />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          style={{ y: yText, opacity: opacityHero }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="rounded-full bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-slate-200 dark:bg-white/5 dark:text-blue-300 dark:ring-white/10">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                New: Real-time Video Analysis
              </span>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl dark:text-white mb-6"
          >
            Exposing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Digital Deception</span> with AI
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Our forensic-grade system analyzes visual artifacts, frequency anomalies, and biological inconsistencies to detect deepfakes with 99.8% accuracy.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/detect">
              <Button size="lg" className="rounded-full h-12 px-8 text-base shadow-blue-500/25 shadow-lg hover:shadow-blue-500/40 transition-shadow">
                Start Detection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo-video">
                <Button variant="outline" size="lg" className="rounded-full h-12 px-8 text-base bg-white/50 backdrop-blur-sm dark:bg-white/5">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Watch Demo
                </Button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
              <StatItem label="Accuracy" value="99.8%" />
              <StatItem label="Models" value="4+" />
              <StatItem label="Inference" value="<50ms" />
              <StatItem label="Analyzed" value="10k+" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Background Gradient Blob */}
      <motion.div 
        style={{ y: yBackground }}
        className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform-gpu overflow-hidden blur-3xl" 
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </motion.div>
    </section>
  )
}

function FloatingIcon({ icon: Icon, className, delay }: { icon: any, className?: string, delay: number }) {
    return (
        <motion.div
            animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
            }}
            transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            className={className}
        >
            <Icon className="w-full h-full" />
        </motion.div>
    )
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</div>
        </div>
    )
}
