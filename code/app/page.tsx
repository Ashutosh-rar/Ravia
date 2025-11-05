"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"

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

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBlogs = () => {
      try {
        const stored = localStorage.getItem("blogs")
        if (stored) {
          const allBlogs = JSON.parse(stored)
          setBlogs(
            allBlogs.slice(0, 6).sort((a: Blog, b: Blog) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          )
        }
      } catch (error) {
        console.error("Error loading blogs:", error)
      }
      setIsLoading(false)
    }

    loadBlogs()
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Welcome to Ravia</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Share Your Stories,
            <span className="text-accent block">Inspire the World</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Write meaningful articles, connect with readers, and build your audience. A platform for thoughtful voices
            and remarkable ideas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/write">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                Start Writing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/blogs">
              <Button size="lg" variant="outline">
                Read Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-20 px-4 md:px-0">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-3">Featured Articles</h2>
            <p className="text-muted-foreground text-lg">Discover the latest insights from our community</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-80 bg-secondary/50 animate-pulse" />
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer group">
                    {blog.image && (
                      <div className="w-full h-40 bg-gradient-to-br from-primary to-accent overflow-hidden">
                        <img
                          src={blog.image || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col h-40">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
                          {blog.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{blog.readTime}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{blog.excerpt}</p>
                      <div className="text-xs text-muted-foreground">
                        {blog.author} • {blog.date}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No articles yet. Be the first to write!</p>
              <Link href="/write">
                <Button className="bg-primary hover:bg-primary/90">Create First Article</Button>
              </Link>
            </div>
          )}

          {blogs.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/blogs">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  View All Articles <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-0 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Share Your Voice?</h2>
          <p className="text-lg opacity-90 mb-8">Join thousands of writers publishing insightful content every day.</p>
          <Link href="/write">
            <Button size="lg" variant="secondary">
              Start Writing Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
