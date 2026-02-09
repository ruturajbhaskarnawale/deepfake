"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileVideo, FileImage, X } from "lucide-react"
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
                  "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-colors cursor-pointer",
                  dragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                    : "border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  className="hidden"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleChange}
                />
                
                <Upload className={cn("h-10 w-10 mb-4 transition-colors", dragActive ? "text-blue-500" : "text-slate-400")} />
                
                <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Images (JPG, PNG) or Videos (MP4, AVI)
                </p>
              </div>
            </motion.div>
        ) : (
             <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative flex items-center p-4 border rounded-xl bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800"
            >
                <div className="mr-4 p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                    {selectedFile.type.startsWith('video') ? (
                        <FileVideo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    ) : (
                        <FileImage className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate dark:text-white">
                        {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile} className="ml-2 text-slate-500 hover:text-red-500">
                    <X className="h-4 w-4" />
                </Button>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
