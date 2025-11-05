import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ravia - Professional Blogging Platform",
  description: "Share your thoughts with the world. Read insightful articles from amazing writers.",
  generator: "v0.app",
  keywords: ["blog", "articles", "writing", "professional", "read", "share"],
  authors: [{ name: "Ravia Team" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ravia.com",
    title: "Ravia - Professional Blogging Platform",
    description: "Share your thoughts with the world. Read insightful articles from amazing writers.",
    siteName: "Ravia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ravia - Professional Blogging Platform",
    description: "Share your thoughts with the world. Read insightful articles from amazing writers.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
