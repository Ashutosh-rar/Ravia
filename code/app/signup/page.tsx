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
import { Mail, Lock, User, ArrowRight } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.name.trim()) {
      setError("Name is required")
      return
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return
    }
    if (!formData.password.trim()) {
      setError("Password is required")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setIsLoading(true)
      // Check if user exists
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const existingUser = users.find((u: any) => u.email === formData.email)

      if (existingUser) {
        setError("Email already registered")
        return
      }

      // Create new user
      const newUser = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      router.push("/")
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
            <h1 className="text-4xl font-bold mb-3 text-foreground">Join Ravia</h1>
            <p className="text-muted-foreground">Create your account and start writing</p>
          </div>

          {/* Form Card */}
          <Card className="p-8">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="pl-10 py-3"
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                <p className="text-xs text-muted-foreground mt-1">At least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="pl-10 py-3"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="mt-1 rounded border-border" required />
                <span className="text-muted-foreground">
                  I agree to the{" "}
                  <a href="#" className="text-accent hover:text-accent/80">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-accent hover:text-accent/80">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 py-3 gap-2 mt-6"
              >
                {isLoading ? "Creating account..." : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:text-accent/80 font-semibold">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
