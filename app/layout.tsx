import './globals.css'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'YouTube Transcript Viewer',
  description: 'Extract and view YouTube video transcripts with timestamps and segment links',
  keywords: ['youtube', 'transcript', 'subtitles', 'video', 'captions'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
} 