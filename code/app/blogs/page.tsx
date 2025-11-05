"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

interface Blog {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  readTime: string
  image?: string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [isLoading, setIsLoading] = useState(true)

  const categories = ["all", "Technology", "Business", "Lifestyle", "Education", "Travel", "Other"]

  useEffect(() => {
    const loadBlogs = () => {
      try {
        const stored = localStorage.getItem("blogs")
        if (stored) {
          const allBlogs = JSON.parse(stored)
          setBlogs(allBlogs)
        }
      } catch (error) {
        console.error("Error loading blogs:", error)
      }
      setIsLoading(false)
    }

    loadBlogs()
  }, [])

  useEffect(() => {
    let filtered = [...blogs]

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredBlogs(filtered)
  }, [blogs, searchTerm, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Header Section */}
      <section className="py-16 px-4 md:px-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Articles</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover thoughtful perspectives and insights from our community of writers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 md:px-0 flex-grow">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filters */}
          <div className="mb-12 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles by title, author, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-base"
              />
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mr-2">
                  <Filter className="w-4 h-4" /> Categories:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
              </select>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-64 bg-secondary/50 animate-pulse" />
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <>
              <div className="mb-6 text-sm text-muted-foreground">
                Showing {filteredBlogs.length} article{filteredBlogs.length !== 1 ? "s" : ""}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBlogs.map((blog) => (
                  <Link key={blog.id} href={`/blog/${blog.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer group">
                      {blog.image && (
                        <div className="w-full h-48 bg-gradient-to-br from-primary to-accent overflow-hidden">
                          <img
                            src={blog.image || "/placeholder.svg"}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col h-56">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
                            {blog.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{blog.readTime}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">{blog.excerpt}</p>
                        <div className="text-xs text-muted-foreground">
                          {blog.author} • {blog.date}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-6">
                {searchTerm || selectedCategory !== "all" ? "No articles match your search." : "No articles yet."}
              </p>
              <Link href="/write">
                <Button className="bg-primary hover:bg-primary/90">Be the First to Write</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
