"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-9 h-9 opacity-0" />
  }

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
        <button
            onClick={() => setTheme("light")}
            className={`p-1.5 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-white text-yellow-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            aria-label="Light Mode"
        >
            <Sun className="h-4 w-4" />
        </button>
        <button
            onClick={() => setTheme("system")}
            className={`p-1.5 rounded-full transition-all duration-300 ${theme === 'system' ? 'bg-white dark:bg-slate-600 text-blue-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
             aria-label="System Mode"
        >
            <Laptop className="h-4 w-4" />
        </button>
        <button
            onClick={() => setTheme("dark")}
            className={`p-1.5 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-slate-600 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
             aria-label="Dark Mode"
        >
            <Moon className="h-4 w-4" />
        </button>
    </div>
  )
}
