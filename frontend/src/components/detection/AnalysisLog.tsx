"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal } from "lucide-react"

interface LogEntry {
    id: number
    text: string
    type: "info" | "success" | "warning"
}

export function AnalysisLog({ isAnalyzing }: { isAnalyzing: boolean }) {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isAnalyzing) {
            setLogs([])
            return
        }

        const messages = [
            { text: "Initializing secure environment...", type: "info" },
            { text: "Loading EfficientNet-B4 weights...", type: "info" },
            { text: "Preprocessing image: 1024x1024", type: "info" },
            { text: "Face detection (MTCNN): Found 1 face", type: "success" },
            { text: "Analyzing frequency domain (SRM)...", type: "warning" },
            { text: "Checking for compression artifacts...", type: "info" },
            { text: "Running Xception inference...", type: "info" },
            { text: "Calculating final confidence score...", type: "success" },
        ]

        let i = 0
        const interval = setInterval(() => {
            if (i < messages.length) {
                setLogs(prev => [...prev, { id: i, ...messages[i] } as LogEntry])
                i++
            } else {
                clearInterval(interval)
            }
        }, 800)

        return () => clearInterval(interval)
    }, [isAnalyzing])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    if (!isAnalyzing && logs.length === 0) return null

    return (
        <div className="w-full max-w-xl mx-auto mt-6 font-mono text-sm bg-black rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center px-4 py-2 bg-slate-900 border-b border-slate-800">
                <Terminal className="w-4 h-4 text-slate-400 mr-2" />
                <span className="text-slate-400 text-xs">System Log</span>
                <div className="ml-auto flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                </div>
            </div>
            
            <div 
                ref={scrollRef}
                className="h-48 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
            >
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-start space-x-2 ${
                                log.type === "success" ? "text-green-400" :
                                log.type === "warning" ? "text-yellow-400" :
                                "text-blue-300"
                            }`}
                        >
                            <span className="opacity-50 text-xs mt-0.5">
                                {new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" })}
                            </span>
                            <span>{">"} {log.text}</span>
                        </motion.div>
                    ))}
                    {isAnalyzing && (
                        <motion.div 
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-2 h-4 bg-blue-500 inline-block ml-1"
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
