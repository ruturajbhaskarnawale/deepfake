"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileVideo, FileImage, X, Scan, Aperture } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadZoneProps {
  onFileSelect: (file: File) => void
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        setSelectedFile(file)
        onFileSelect(file)
    }
  }, [onFileSelect])

  const removeFile = useCallback(() => {
    setSelectedFile(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [])

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence>
        {!selectedFile ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-64 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden group",
                  dragActive
                    ? "border-2 border-blue-500 bg-blue-900/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                    : "border border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-blue-500/50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-shine opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/30 rounded-tl-lg group-hover:border-blue-500 transition-colors" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/30 rounded-tr-lg group-hover:border-blue-500 transition-colors" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/30 rounded-bl-lg group-hover:border-blue-500 transition-colors" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/30 rounded-br-lg group-hover:border-blue-500 transition-colors" />

                <input
                  ref={inputRef}
                  className="hidden"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleChange}
                />
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-blue-500/50 transition-all shadow-lg">
                        <Upload className={cn("h-8 w-8 transition-colors", dragActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-400")} />
                    </div>
                    
                    <p className="mb-2 text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                    Initiate Data Upload
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                    TARGET: IMAGE / VIDEO
                    </p>
                </div>
              </div>
            </motion.div>
        ) : (
             <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative flex items-center p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] backdrop-blur-sm"
            >
                <div className="mr-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    {selectedFile.type.startsWith('video') ? (
                        <FileVideo className="h-6 w-6 text-blue-400" />
                    ) : (
                        <FileImage className="h-6 w-6 text-blue-400" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                         <p className="text-sm font-medium text-white truncate font-mono">
                            {selectedFile.name}
                        </p>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-900/30 text-green-400 border border-green-500/30">
                            READY
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-1">
                         <p className="text-xs text-slate-400 font-mono">
                            SIZE: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                            TYPE: {selectedFile.type.toUpperCase()}
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile} className="ml-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full">
                    <X className="h-4 w-4" />
                </Button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
