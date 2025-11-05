"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email.trim()) {
      setError("Email is required")
      return
    }
    if (!formData.password.trim()) {
      setError("Password is required")
      return
    }

    try {
      setIsLoading(true)
      // Simulate authentication - in production, this would call an API
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password)

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user))
        router.push("/")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="py-20 px-4 md:px-0 flex-grow flex items-center">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your Ravia account</p>
          </div>

          {/* Form Card */}
          <Card className="p-8">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="pl-10 py-3"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="pl-10 py-3"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-accent hover:text-accent/80 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 py-3 gap-2">
                {isLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>

            {/* Demo Login */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">Demo Account</p>
              <Button
                type="button"
                variant="outline"
                className="w-full py-3 bg-transparent"
                onClick={() => {
                  setFormData({
                    email: "demo@ravia.com",
                    password: "demo123",
                  })
                }}
              >
                Try Demo Account
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              Don't have an account?{" "}
              <Link href="/signup" className="text-accent hover:text-accent/80 font-semibold">
                Sign up
              </Link>
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
