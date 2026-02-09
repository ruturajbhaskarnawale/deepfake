"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { Shield, Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

const navLinks = [
  { href: "/detect", label: "Detect" },
  { href: "/models", label: "Models" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const pathname = usePathname()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20)
  })

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "py-3 bg-white/10 dark:bg-black/10 backdrop-blur-md border-b border-white/10 shadow-lg supports-[backdrop-filter]:bg-white/5" 
            : "py-5 bg-transparent border-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                <Shield className="h-6 w-6 text-white" />
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 -translate-x-full" />
                </div>
              </div>
              <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                DeepFake<span className="font-light text-slate-500 dark:text-slate-400">Detect</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href} isActive={pathname === link.href}>
                  {link.label}
                </NavLink>
              ))}
              <div className="ml-6 pl-6 border-l border-slate-200 dark:border-white/10 flex items-center gap-4">
                <ThemeToggle />
                <Link href="/detect">
                  <Button 
                    size="sm" 
                    className={cn(
                        "rounded-full px-6 transition-all duration-300",
                        isScrolled ? "bg-blue-600 hover:bg-blue-500 shadow-md" : "bg-slate-900 dark:bg-white dark:text-black hover:bg-slate-800"
                    )}
                  >
                    Try Detection
                  </Button>
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Actions */}
            <div className="md:hidden flex items-center gap-4">
                <ThemeToggle />
                <button 
                    className="p-2 text-slate-600 dark:text-slate-300"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl md:hidden pt-24 px-6"
            >
                <nav className="flex flex-col space-y-6">
                    {navLinks.map((link, i) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link 
                                href={link.href} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between text-2xl font-bold text-slate-900 dark:text-white group"
                            >
                                {link.label}
                                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-blue-500" />
                            </Link>
                        </motion.div>
                    ))}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="pt-8"
                    >
                        <Link href="/detect" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button size="lg" className="w-full text-lg h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30">
                                Launch Detection
                            </Button>
                        </Link>
                    </motion.div>
                </nav>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ href, children, isActive }: { href: string, children: React.ReactNode, isActive: boolean }) {
    return (
        <Link href={href} className="relative px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group">
            {children}
            {isActive && (
                <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-slate-100 dark:bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            {!isActive && (
                <span className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 bg-slate-50 dark:bg-white/5 -z-10 transition-transform duration-200" />
            )}
        </Link>
    )
}
