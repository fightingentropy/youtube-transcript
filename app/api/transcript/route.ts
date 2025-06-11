import { NextRequest, NextResponse } from 'next/server'
import { Innertube } from 'youtubei.js'

export async function POST(request: NextRequest) {
  try {
    console.log('API: Received transcript request')
    const { videoUrl } = await request.json()
    console.log('API: Video URL:', videoUrl)
    
    if (!videoUrl) {
      console.log('API: No video URL provided')
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      )
    }

    // Extract video ID from YouTube URL
    const videoId = extractVideoId(videoUrl)
    console.log('API: Extracted video ID:', videoId)
    
    if (!videoId) {
      console.log('API: Invalid YouTube URL')
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }

    // Initialize YouTube client
    console.log('API: Initializing YouTube client')
    const youtube = await Innertube.create({
      lang: 'en',
      location: 'US',
      retrieve_player: false,
    })

    // Fetch video info and transcript
    console.log('API: Fetching video info and transcript for video ID:', videoId)
    const info = await youtube.getInfo(videoId)
    const transcriptData = await info.getTranscript()
    
    console.log('API: Transcript data received:', !!transcriptData)
    
    if (!transcriptData || !transcriptData.transcript) {
      throw new Error('No transcript available for this video')
    }
    
    // Extract and format transcript segments
    const segments = transcriptData.transcript?.content?.body?.initial_segments
    console.log('API: Number of segments found:', segments?.length || 0)
    
    if (!segments || segments.length === 0) {
      throw new Error('No transcript segments found for this video')
    }
    
    // Format transcript data
    const formattedTranscript = segments.map((segment: any, index: number) => {
      const startMs = segment.start_ms || 0
      const endMs = segment.end_ms || startMs + 3000 // Default 3 second duration if not provided
      
      return {
        id: index,
        text: segment.snippet?.text || '',
        start: startMs / 1000, // Convert to seconds
        duration: (endMs - startMs) / 1000, // Convert to seconds
        end: endMs / 1000
      }
    })

    return NextResponse.json({
      success: true,
      transcript: formattedTranscript,
      videoId
    })
    
  } catch (error) {
    console.error('Error fetching transcript:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Transcript is disabled')) {
        return NextResponse.json(
          { error: 'Transcript is not available for this video' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    )
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
} 