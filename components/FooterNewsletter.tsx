"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export default function FooterNewsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setStatus("error")
      return
    }

    // Simulate API call
    setStatus("loading")
    setTimeout(() => {
      setStatus("success")
      setEmail("")
      // Reset after 3 seconds
      setTimeout(() => setStatus("idle"), 3000)
    }, 800)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-primary-foreground/10 dark:bg-gray-800/50 border-primary-foreground/20 dark:border-gray-700 text-primary-foreground dark:text-white placeholder:text-primary-foreground/70 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-white dark:focus:ring-gray-500 pl-3 pr-10 py-2 h-11"
          disabled={status === "loading" || status === "success"}
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-0.5 top-0.5 bg-white/10 text-white hover:bg-white/20 dark:bg-gray-700 dark:hover:bg-gray-600 h-10"
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send size={16} />
          )}
        </Button>
      </div>

      {status === "success" && <p className="text-green-300 text-sm">Thank you for subscribing!</p>}

      {status === "error" && <p className="text-red-300 text-sm">Please enter a valid email.</p>}
    </form>
  )
}

