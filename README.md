# YouTube Transcript Viewer

A modern Next.js application that extracts and displays YouTube video transcripts with advanced search functionality and clickable timestamps.

![YouTube Transcript Viewer](https://img.shields.io/badge/Built%20with-Next.js%2014-black) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC)

## ✨ Features

- **Extract YouTube Transcripts**: Get transcripts from any YouTube video with available captions
- **Advanced Search**: Search through transcript text with highlighting and navigation
- **Clickable Timestamps**: Jump to specific moments in the video
- **Copy Functionality**: Copy the entire transcript or specific segments
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Robust error handling for various edge cases
- **Dark Mode Support**: Automatic dark/light theme switching

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd youtube-transcript
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Usage

1. **Paste a YouTube URL** in the input field (supports various formats):
   - `https://www.youtube.com/watch?v=VIDEO_ID`
   - `https://youtu.be/VIDEO_ID`
   - `VIDEO_ID` (just the 11-character ID)

2. **Click "Get Transcript"** to extract the transcript

3. **Search through the transcript** using the search bar

4. **Navigate search results** using the arrow buttons

5. **Click timestamps** to open the video at that specific time

6. **Copy the transcript** using the copy button

## 🛠️ Technical Details

### Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **YouTube Integration**: `youtubei.js` library for accessing YouTube's private API

### Key Components

- `app/page.tsx` - Main React component with transcript display and search
- `app/api/transcript/route.ts` - API endpoint for extracting transcripts
- `lib/error-handler.ts` - Centralized error handling for YouTube.js errors

### Error Handling

The application includes robust error handling for common issues:

#### Non-Fatal Errors (Handled Gracefully)
- **CompositeVideoPrimaryInfo not found**: YouTube API structure changes that don't affect functionality
- **CourseProgressView not found**: Similar parser warnings
- **MerchandiseShelf errors**: Layout parsing issues

#### Fatal Errors (User-Facing)
- **Transcript not available**: Video doesn't have captions
- **Video unavailable**: Private, deleted, or restricted videos
- **Invalid URL**: Malformed YouTube URLs
- **Network errors**: Connection issues

## 🔧 Troubleshooting

### Common Issues

#### 1. "CompositeVideoPrimaryInfo not found" Error
**Status**: ✅ **Resolved** - This is a non-fatal error that has been suppressed.

**What it means**: YouTube changes their internal structure frequently, causing parser warnings in the `youtubei.js` library.

**Solution**: The application now suppresses these warnings while maintaining full functionality.

#### 2. "Transcript is not available"
**Causes**:
- Video doesn't have auto-generated captions
- Captions are disabled by the creator
- Video is too new (captions not generated yet)

**Solutions**:
- Try a different video
- Check if the video has captions on YouTube
- Wait if the video is very recent

#### 3. "Video is unavailable or restricted"
**Causes**:
- Private video
- Age-restricted content
- Deleted video
- Geographic restrictions

**Solutions**:
- Ensure the video is public
- Try a different video
- Check if you can access the video directly on YouTube

#### 4. Network or Loading Issues
**Causes**:
- Slow internet connection
- YouTube API rate limiting
- Server overload

**Solutions**:
- Check your internet connection
- Wait a moment and try again
- Try a different video

### Advanced Troubleshooting

#### Enable Debug Logging
To see detailed API logs, check the browser's developer console (F12) and the terminal where you're running the development server.

#### Rate Limiting
If you encounter rate limiting:
- Wait a few minutes between requests
- Use different video URLs
- Restart the development server

## 🔄 Recent Updates

### Error Handling Improvements
- ✅ Suppressed non-fatal YouTube.js parser errors
- ✅ Enhanced error messages with suggestions
- ✅ Added warning system for non-critical issues
- ✅ Improved user feedback with success messages

### UI/UX Enhancements
- ✅ Better error message formatting
- ✅ Success confirmation when transcript is extracted
- ✅ Improved search result navigation
- ✅ Enhanced accessibility features

## 🧪 Testing

To test the application with various scenarios:

### Working Videos (Public with transcripts)
- TED Talks
- Educational content
- Most popular YouTube videos

### Expected Failures
- Private videos
- Videos without captions
- Age-restricted content

## 📦 Dependencies

### Main Dependencies
- `next`: ^14.0.3 - React framework
- `youtubei.js`: ^14.0.0 - YouTube API client
- `react`: ^18.2.0 - UI library
- `tailwindcss`: ^3.3.5 - CSS framework
- `lucide-react`: ^0.294.0 - Icons

### Development Dependencies
- `typescript`: ^5.2.2
- `@types/node`, `@types/react`, `@types/react-dom`
- `eslint`, `eslint-config-next`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This project uses YouTube's private API through the `youtubei.js` library. While this is generally stable, it may occasionally break when YouTube updates their internal systems. The application includes error handling to gracefully manage these situations.

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Look at the browser console for error messages
3. Check the terminal output for server-side errors
4. Open an issue on GitHub with detailed error information

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS** 