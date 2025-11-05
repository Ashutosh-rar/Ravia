"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Save, Eye } from "lucide-react"

interface BlogFormData {
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  image?: string
}

const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export default function WritePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "Technology",
    image: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState("")

  const categories = ["Technology", "Business", "Lifestyle", "Education", "Travel", "Other"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required")
      return
    }
    if (!formData.excerpt.trim()) {
      setError("Excerpt is required")
      return
    }
    if (!formData.content.trim()) {
      setError("Content is required")
      return
    }
    if (!formData.author.trim()) {
      setError("Author name is required")
      return
    }

    try {
      setIsSubmitting(true)

      // Create blog object
      const newBlog = {
        id: generateId(),
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        readTime: calculateReadTime(formData.content),
        image: formData.image || undefined,
      }

      // Get existing blogs
      const stored = localStorage.getItem("blogs")
      const blogs = stored ? JSON.parse(stored) : []

      // Add new blog
      blogs.unshift(newBlog)

      // Save to localStorage
      localStorage.setItem("blogs", JSON.stringify(blogs))

      // Redirect to the new blog
      router.push(`/blog/${newBlog.id}`)
    } catch (err) {
      setError("Failed to save blog. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const preview = {
    title: formData.title || "Your article title",
    excerpt: formData.excerpt || "Your article excerpt appears here...",
    author: formData.author || "Anonymous",
    category: formData.category,
    readTime: calculateReadTime(formData.content),
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Header Section */}
      <section className="py-12 px-4 md:px-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-6 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Write New Article</h1>
          <p className="text-lg text-muted-foreground">
            Share your thoughts and ideas with the world. Write thoughtfully, edit carefully, and publish with
            confidence.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 md:px-0 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Article Title</label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a compelling title..."
                    className="text-lg py-3"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Author Name</label>
                  <Input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="py-3"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground"
                    disabled={isSubmitting}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Featured Image URL</label>
                  <Input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg (optional)"
                    className="py-3"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: Add a featured image URL for your article
                  </p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Excerpt</label>
                  <Textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Write a brief summary of your article (2-3 sentences)"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Article Content</label>
                  <Textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your article here. Use paragraphs separated by blank lines for better formatting."
                    rows={12}
                    disabled={isSubmitting}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Read time: {calculateReadTime(formData.content)}</p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="gap-2 flex-1 lg:flex-none"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? "Hide" : "Show"} Preview
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="gap-2 flex-1 bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4" />
                    {isSubmitting ? "Publishing..." : "Publish Article"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Preview Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                <div className="text-sm font-semibold text-muted-foreground">PREVIEW</div>

                <Card className="overflow-hidden p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
                        {preview.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{preview.readTime}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-3 text-foreground line-clamp-3">
                      {preview.title}
                    </h3>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground line-clamp-4">{preview.excerpt}</p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      {preview.author} • {preview.date}
                    </p>
                  </div>
                </Card>

                <Card className="p-4 bg-secondary/50">
                  <p className="text-sm text-muted-foreground">
                    Preview shows how your article will appear on the blog listing and homepage.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
