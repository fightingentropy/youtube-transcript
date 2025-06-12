// Centralized error handling for YouTube.js related errors
export interface ErrorResult {
  isError: boolean
  isWarning: boolean
  message: string
  suggestion?: string
}

export function handleYouTubeError(error: any): ErrorResult {
  const errorMessage = error?.message || error?.toString() || 'Unknown error'
  
  // Non-fatal errors that we can handle gracefully
  if (errorMessage.includes('CompositeVideoPrimaryInfo')) {
    return {
      isError: false,
      isWarning: true,
      message: 'YouTube API structure changed (non-fatal)',
      suggestion: 'Transcript extraction may still work normally'
    }
  }
  
  // Transcript not available
  if (errorMessage.includes('Transcript is disabled') || 
      errorMessage.includes('No transcript available') ||
      errorMessage.includes('engagement-panel-searchable-transcript')) {
    return {
      isError: true,
      isWarning: false,
      message: 'Transcript is not available for this video',
      suggestion: 'Try a different video or check if the video has captions enabled'
    }
  }
  
  // Video access issues
  if (errorMessage.includes('Video unavailable') || 
      errorMessage.includes('Private video') ||
      errorMessage.includes('Age-restricted')) {
    return {
      isError: true,
      isWarning: false,
      message: 'Video is unavailable or restricted',
      suggestion: 'Ensure the video is public and accessible'
    }
  }
  
  // Network or API issues
  if (errorMessage.includes('fetch') || 
      errorMessage.includes('network') ||
      errorMessage.includes('timeout')) {
    return {
      isError: true,
      isWarning: false,
      message: 'Network error occurred',
      suggestion: 'Check your internet connection and try again'
    }
  }
  
  // Invalid URL
  if (errorMessage.includes('Invalid YouTube URL')) {
    return {
      isError: true,
      isWarning: false,
      message: 'Invalid YouTube URL',
      suggestion: 'Please enter a valid YouTube video URL (youtube.com/watch?v=... or youtu.be/...)'
    }
  }
  
  // Generic error
  return {
    isError: true,
    isWarning: false,
    message: errorMessage,
    suggestion: 'If this persists, please try again later'
  }
}

// Enhanced console error suppression
export function setupErrorSuppression() {
  const originalConsoleError = console.error
  const originalConsoleWarn = console.warn
  
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    
    // Skip logging known non-fatal YouTube.js errors
    const nonFatalErrors = [
      'CompositeVideoPrimaryInfo not found',
      'CourseProgressView not found',
      'MerchandiseShelf expected VideoDescriptionHeader'
    ]
    
    if (!nonFatalErrors.some(error => message.includes(error))) {
      originalConsoleError.apply(console, args)
    }
  }
  
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    
    // Skip logging certain YouTube.js warnings
    if (!message.includes('[YOUTUBEJS][Parser]')) {
      originalConsoleWarn.apply(console, args)
    }
  }
  
  return {
    restore: () => {
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
    }
  }
} 