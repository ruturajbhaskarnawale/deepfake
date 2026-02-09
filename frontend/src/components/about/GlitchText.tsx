"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function GlitchText({ text, className }: { text: string, className?: string }) {
  const [glitchText, setGlitchText] = useState(text)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+"

  useEffect(() => {
    const interval = setInterval(() => {
        let iterations = 0;
        const intervalId = setInterval(() => {
            setGlitchText(prev => 
                text.split("")
                .map((letter, index) => {
                    if(index < iterations) {
                        return text[index];
                    }
                    return letters[Math.floor(Math.random() * 26)]
                })
                .join("")
            )
            if(iterations >= text.length) clearInterval(intervalId);
            iterations += 1 / 3;
        }, 30);
    }, 5000); // Repeat every 5 seconds

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{glitchText}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-blue-500 opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100 animate-pulse">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100 animate-pulse delay-75">
        {text}
      </span>
    </div>
  )
}
