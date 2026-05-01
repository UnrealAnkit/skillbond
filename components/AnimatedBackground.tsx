"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#080B0F]">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Vignette Overlay for Grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080B0F_80%)]" />

      {/* Floating Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: ["-10vh", "110vh"],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 0.4, 0],
          }}
          initial={{
            y: "-10vh",
            x: 0,
          }}
          transition={{
            duration: Math.random() * 5 + 6,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 3,
          }}
          className={`absolute w-1 h-1 rounded-full ${Math.random() > 0.5 ? 'bg-[#00E5A0]' : 'bg-blue-400'}`}
          style={{
            left: `${Math.random() * 100}vw`,
          }}
        />
      ))}

      {/* Glow Orbs - Faster Animations */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, 60, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00E5A0]/20 blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.25, 0.1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/20 blur-[90px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.2, 0.05],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/15 blur-[120px]"
      />
    </div>
  )
}

