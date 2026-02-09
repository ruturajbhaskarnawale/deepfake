"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/75 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/75">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            DeepFake Detect
          </span>
        </Link>
        <nav className="hidden md:flex items-center text-sm font-medium space-x-6">
          <Link
            href="/detect"
            className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            Detect
          </Link>
          <Link
            href="/models"
            className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            Models
          </Link>
          <Link
            href="/about"
            className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
          >
            About
          </Link>
          <Link href="/detect">
            <Button size="sm">Try Detection</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
