import { NextRequest, NextResponse } from 'next/server'
import { Innertube } from 'youtubei.js'
import { setupErrorSuppression, handleYouTubeError } from '../../../lib/error-handler'

// Setup error suppression for non-fatal YouTube.js errors
setupErrorSuppression()

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
    
    let info, transcriptData
    let nonFatalWarnings: string[] = []
    
    try {
      info = await youtube.getInfo(videoId)
      transcriptData = await info.getTranscript()
    } catch (error: any) {
      const errorResult = handleYouTubeError(error)
      
      if (errorResult.isWarning && !errorResult.isError) {
        // Non-fatal error, log warning and continue
        console.log(`API: Warning - ${errorResult.message}`)
        nonFatalWarnings.push(errorResult.message)
        
        // Try to continue with the operation
        if (!info) {
          throw new Error('Unable to fetch video information due to API changes')
        }
        if (!transcriptData) {
          transcriptData = await info.getTranscript()
        }
      } else {
        // Fatal error, rethrow with enhanced message
        throw new Error(errorResult.message)
      }
    }
    
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

    console.log('API: Successfully processed transcript with', formattedTranscript.length, 'segments')

    return NextResponse.json({
      success: true,
      transcript: formattedTranscript,
      videoId,
      warnings: nonFatalWarnings.length > 0 ? nonFatalWarnings : undefined
    })
    
  } catch (error) {
    console.error('Error fetching transcript:', error)
    
    const errorResult = handleYouTubeError(error)
    
    if (errorResult.message.includes('Transcript is not available') ||
        errorResult.message.includes('No transcript available')) {
      return NextResponse.json(
        { 
          error: errorResult.message,
          suggestion: errorResult.suggestion 
        },
        { status: 404 }
      )
    }
    
    if (errorResult.message.includes('Video is unavailable') ||
        errorResult.message.includes('Private video')) {
      return NextResponse.json(
        { 
          error: errorResult.message,
          suggestion: errorResult.suggestion 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { 
        error: errorResult.message,
        suggestion: errorResult.suggestion
      },
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