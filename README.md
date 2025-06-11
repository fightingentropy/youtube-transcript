# YouTube Transcript Viewer

A modern, minimal web application for extracting and viewing YouTube video transcripts with clickable timestamps. Built with Next.js, React, and Tailwind CSS with a sleek design inspired by Perplexity.

## Live Demo

The application is deployed and available at: [https://youtube-transcript-gules.vercel.app](https://youtube-transcript-gules.vercel.app)

## Features

- 🎥 Extract transcripts from any YouTube video
- ⏰ View timestamps with direct links to video segments  
- 🔍 Search within transcripts with real-time filtering
- 🎯 Navigate between search results with keyboard support
- 🎨 Clean, minimal UI with dark theme
- 📱 Responsive design for all devices
- 🔗 Clickable timestamps that jump to video segments
- ⚡ Fast and efficient transcript processing

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/fightingentropy/youtube-transcript.git
cd youtube-transcript
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

To create a production build:

```bash
npm run build
npm start
```

## Deployment

This project is deployed on Vercel. To deploy your own version:

1. Fork this repository
2. Create a Vercel account at [vercel.com](https://vercel.com)
3. Install Vercel CLI:
```bash
npm install -g vercel
```
4. Deploy:
```bash
vercel
```

The deployment will automatically:
- Build your Next.js application
- Deploy it to Vercel's global edge network
- Set up automatic deployments for future pushes to your main branch

## How to Use

1. **Paste YouTube URL**: Copy any YouTube video URL and paste it into the input field
2. **Get Transcript**: Click the "Get Transcript" button to extract the transcript
3. **Search Transcript**: Use the search bar to find specific text in the transcript
   - Type to filter results in real-time
   - Use up/down arrows to navigate between matches
   - Matching text is highlighted in yellow
4. **Browse Segments**: View the transcript broken down into timestamped segments
5. **Jump to Video**: Click any timestamp to open the video at that specific time

### Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Direct video ID: `VIDEO_ID`

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Transcript Extraction**: youtube-transcript library
- **API**: Next.js API routes

## Project Structure

```
youtube-transcript/
├── app/
│   ├── api/transcript/
│   │   └── route.ts          # API endpoint for transcript extraction
│   ├── globals.css           # Global styles and theme
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main application page
├── lib/
│   └── utils.ts             # Utility functions
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## API Reference

### POST /api/transcript

Extracts transcript from a YouTube video.

**Request Body:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "success": true,
  "transcript": [
    {
      "id": 0,
      "text": "Welcome to the video...",
      "start": 0.0,
      "duration": 3.5,
      "end": 3.5
    }
  ],
  "videoId": "VIDEO_ID"
}
```

## Limitations

- Only works with videos that have transcripts enabled
- Transcript availability depends on the video uploader's settings
- Some videos may have auto-generated transcripts only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License. 