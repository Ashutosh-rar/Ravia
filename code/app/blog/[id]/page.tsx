"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Share2, Heart } from "lucide-react"

interface Blog {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  readTime: string
  image?: string
}

export default function BlogDetail() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])

  const blogId = params.id as string

  useEffect(() => {
    const loadBlog = () => {
      try {
        const stored = localStorage.getItem("blogs")
        if (stored) {
          const allBlogs = JSON.parse(stored)
          const foundBlog = allBlogs.find((b: Blog) => b.id === blogId)
          if (foundBlog) {
            setBlog(foundBlog)

            // Get related blogs from same category
            const related = allBlogs
              .filter((b: Blog) => b.category === foundBlog.category && b.id !== blogId)
              .slice(0, 3)
            setRelatedBlogs(related)
          }
        }
      } catch (error) {
        console.error("Error loading blog:", error)
      }
      setIsLoading(false)
    }

    loadBlog()
  }, [blogId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/50 animate-pulse mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Article not found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Link href="/blogs">
              <Button className="bg-primary hover:bg-primary/90">Back to Articles</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Image */}
      {blog.image && (
        <div className="w-full h-96 bg-gradient-to-br from-primary to-accent overflow-hidden">
          <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Article Content */}
      <section className="py-12 px-4 md:px-0 flex-grow">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </button>

          {/* Meta Info */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent">
                {blog.category}
              </span>
              <span className="text-sm text-muted-foreground">{blog.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground">{blog.title}</h1>

            <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground">
                  By <span className="font-semibold text-foreground">{blog.author}</span> on{" "}
                  <span className="font-semibold text-foreground">{blog.date}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title="Like article"
                >
                  <Heart
                    className={`w-5 h-5 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
                  />
                </button>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors" title="Share article">
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="blog-content text-lg text-foreground leading-relaxed prose prose-invert mb-16">
            {blog.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Author Card */}
          <Card className="p-8 mb-16">
            <h3 className="font-bold text-lg mb-2">About the Author</h3>
            <p className="text-muted-foreground">
              {blog.author} is a passionate writer sharing insights and perspectives on {blog.category.toLowerCase()}.
            </p>
          </Card>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link key={relatedBlog.id} href={`/blog/${relatedBlog.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer group">
                      {relatedBlog.image && (
                        <div className="w-full h-40 bg-gradient-to-br from-primary to-accent overflow-hidden">
                          <img
                            src={relatedBlog.image || "/placeholder.svg"}
                            alt={relatedBlog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/10 text-accent">
                          {relatedBlog.category}
                        </span>
                        <h4 className="font-bold text-sm mt-3 mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                          {relatedBlog.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{relatedBlog.author}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
