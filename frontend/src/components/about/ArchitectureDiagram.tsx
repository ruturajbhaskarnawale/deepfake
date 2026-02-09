"use client"

import { motion } from "framer-motion"
import { Monitor, Cpu, Server, FileImage, ShieldCheck } from "lucide-react"

export function ArchitectureDiagram() {
  return (
    <div className="relative py-20 overflow-hidden">
       <div className="flex flex-col md:flex-row items-center justify-center gap-12 relative z-10">
          
          {/* Step 1: Input */}
          <Node icon={FileImage} label="Input Image" delay={0} />
          
          <Connection delay={0.5} />

          {/* Step 2: Preprocessing */}
          <Node icon={Monitor} label="Face Extraction (MTCNN)" delay={1} />
          
          <Connection delay={1.5} />

          {/* Step 3: Server/Models */}
          <div className="relative">
             <div className="absolute -inset-4 bg-blue-500/10 rounded-xl blur-xl animate-pulse"></div>
             <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-xl relative">
                <div className="grid grid-cols-2 gap-4">
                    <ModelNode name="EfficientNet" color="bg-orange-500" />
                    <ModelNode name="Hybrid Forensic" color="bg-blue-500" />
                    <ModelNode name="Xception" color="bg-purple-500" />
                    <ModelNode name="CLIP" color="bg-pink-500" />
                </div>
                <div className="mt-4 text-center text-xs font-mono text-slate-500">Ensemble Inference</div>
             </div>
          </div>

          <Connection delay={2.5} />

          {/* Step 4: Output */}
          <Node icon={ShieldCheck} label="Verdict: REAL/FAKE" delay={3} color="text-green-500" />

       </div>
    </div>
  )
}

function Node({ icon: Icon, label, delay, color = "text-slate-900 dark:text-white" }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            className="flex flex-col items-center gap-4"
        >
            <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center dark:bg-slate-800 dark:border-slate-700">
                <Icon className={`w-8 h-8 ${color}`} />
            </div>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
        </motion.div>
    )
}

function Connection({ delay }: { delay: number }) {
    return (
        <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 60, opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
            className="h-0.5 bg-slate-300 dark:bg-slate-700 hidden md:block relative"
        >
            <motion.div 
                animate={{ x: [0, 60], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5, delay: delay + 0.5 }}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"
            />
        </motion.div>
    )
}

function ModelNode({ name, color }: { name: string, color: string }) {
    return (
        <div className="flex items-center gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{name}</span>
        </div>
    )
}
