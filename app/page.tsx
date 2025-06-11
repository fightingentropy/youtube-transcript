'use client'

import React, { useState, useMemo } from 'react'
import { Search, Play, Clock, ExternalLink, Loader2, ArrowUp, ArrowDown } from 'lucide-react'

interface TranscriptSegment {
  id: number
  text: string
  start: number
  duration: number
  end: number
}

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState('')
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videoId, setVideoId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1)

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const generateYouTubeUrl = (videoId: string, startTime: number): string => {
    const startSeconds = Math.floor(startTime)
    return `https://www.youtube.com/watch?v=${videoId}&t=${startSeconds}s`
  }

  // Filter and highlight search results
  const filteredTranscript = useMemo(() => {
    if (!searchQuery.trim()) return transcript

    const query = searchQuery.toLowerCase()
    return transcript.filter(segment => 
      segment.text.toLowerCase().includes(query)
    )
  }, [transcript, searchQuery])

  // Get all search result indices
  const searchResultIndices = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    return transcript
      .map((segment, index) => segment.text.toLowerCase().includes(query) ? index : -1)
      .filter(index => index !== -1)
  }, [transcript, searchQuery])

  // Handle search navigation
  const handleSearchNavigation = (direction: 'next' | 'prev') => {
    if (searchResultIndices.length === 0) return

    let newIndex = currentSearchIndex
    if (direction === 'next') {
      newIndex = currentSearchIndex === -1 ? 0 : (currentSearchIndex + 1) % searchResultIndices.length
    } else {
      newIndex = currentSearchIndex === -1 ? searchResultIndices.length - 1 : (currentSearchIndex - 1 + searchResultIndices.length) % searchResultIndices.length
    }

    setCurrentSearchIndex(newIndex)
    const targetIndex = searchResultIndices[newIndex]
    const element = document.getElementById(`segment-${targetIndex}`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  // Highlight matching text
  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text

    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() ? 
        <span key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</span> : 
        part
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl.trim()) return

    setLoading(true)
    setError('')
    setTranscript([])
    setSearchQuery('')
    setCurrentSearchIndex(-1)

    try {
      console.log('Sending request to API with URL:', videoUrl)
      
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      })

      console.log('Response status:', response.status)
      
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transcript')
      }

      if (data.transcript && data.transcript.length > 0) {
        setTranscript(data.transcript)
        setVideoId(data.videoId)
        console.log('Transcript set successfully:', data.transcript.length, 'segments')
      } else {
        setError('No transcript found for this video')
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">
            YouTube Transcript Viewer
          </h1>
          <p className="text-muted-foreground mt-2">
            Extract and browse YouTube video transcripts with clickable timestamps
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste YouTube video URL here..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !videoUrl.trim()}
            className="mt-4 w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Extracting transcript...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Get Transcript
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive-foreground">{error}</p>
          </div>
        )}

        {/* Transcript Results */}
        {transcript.length > 0 && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentSearchIndex(-1)
                }}
                placeholder="Search in transcript..."
                className="w-full pl-10 pr-24 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {searchResultIndices.length} results
                  </span>
                  <button
                    onClick={() => handleSearchNavigation('prev')}
                    className="p-1 hover:bg-accent rounded"
                    title="Previous result"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleSearchNavigation('next')}
                    className="p-1 hover:bg-accent rounded"
                    title="Next result"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{filteredTranscript.length} segments found</span>
            </div>

            <div className="space-y-3">
              {filteredTranscript.map((segment) => (
                <div
                  key={segment.id}
                  id={`segment-${segment.id}`}
                  className={`transcript-segment p-4 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors ${
                    currentSearchIndex !== -1 && searchResultIndices[currentSearchIndex] === segment.id
                      ? 'ring-2 ring-primary'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <a
                        href={generateYouTubeUrl(videoId, segment.start)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-mono text-primary hover:text-primary/80 transition-colors"
                      >
                        {formatTime(segment.start)}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">
                        {highlightText(segment.text)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && transcript.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Ready to extract transcripts
            </h3>
            <p className="text-muted-foreground">
              Paste a YouTube video URL above to get started
            </p>
          </div>
        )}
      </main>
    </div>
  )
} 