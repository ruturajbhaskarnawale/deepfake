"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, Github, Twitter, Linkedin, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative bg-slate-950 text-slate-300 border-t border-slate-900 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
                        <Shield className="h-6 w-6 text-blue-500" />
                    </div>
                    <span className="text-xl font-bold text-white">
                        DeepFake<span className="text-slate-500 font-light">Detect</span>
                    </span>
                </div>
                <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                    Advanced forensic analysis tool for verifying digital media authenticity using ensemble deep learning models.
                </p>
                <div className="flex space-x-4 pt-2">
                    <SocialIcon icon={<Github className="w-5 h-5" />} href="#" />
                    <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
                    <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
                </div>
            </div>

            {/* Links Column 1 */}
            <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
                <ul className="space-y-3">
                    <li><FooterLink href="/detect">Analysis Lab</FooterLink></li>
                    <li><FooterLink href="/models">Model Benchmarks</FooterLink></li>
                    <li><FooterLink href="/about">Methodology</FooterLink></li>
                    <li><FooterLink href="#">API Access</FooterLink></li>
                </ul>
            </div>

             {/* Links Column 2 */}
             <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Research</h3>
                <ul className="space-y-3">
                    <li><FooterLink href="#">Whitepaper</FooterLink></li>
                    <li><FooterLink href="#">Dataset (FF++)</FooterLink></li>
                    <li><FooterLink href="#">Citation</FooterLink></li>
                    <li><FooterLink href="#">Legal & Privacy</FooterLink></li>
                </ul>
            </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
                &copy; {new Date().getFullYear()} DeepFake Detect Research Group. Released under MIT License.
            </p>
            
            <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToTop}
                className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-colors"
                aria-label="Back to top"
            >
                <ArrowUp className="w-4 h-4" />
            </motion.button>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a 
            href={href}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all duration-300"
        >
            {icon}
        </a>
    )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link 
            href={href} 
            className="text-sm text-slate-400 hover:text-blue-400 transition-colors block"
        >
            {children}
        </Link>
    )
}
