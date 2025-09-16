# BIMTranslator

**BIMTranslator** is an AI-powered web application built for the Pan-SEA AI Developer Challenge 2025. Our goal is to bridge the communication gap by enabling real-time translation of BIM (Bahasa Isyarat Malaysia - Malaysian Sign Language) gestures into text, making digital services accessible to the Malaysian deaf community.

## What Judges Can Try

- **Live demo:** [/demo](/demo) - Real-time hand tracking and gesture recognition
- **Interactive landing page:** Complete information about BIM and our solution
- **Two minute video:** [https://www.youtube.com/watch?v=J_8QQJmwkWA](https://www.youtube.com/watch?v=J_8QQJmwkWA)

**API sample:**

```bash
curl -X GET "https://your-api.example.com/match_animation_sequence?sentence=apa%20nama" \
    -H "Accept: application/json"
```

## Features

- **Real-time BIM gesture recognition:** Live webcam capture with MediaPipe hand tracking
- **21-point hand landmark detection:** Precise tracking of both hands with smoothing filters
- **Instant gesture translation:** Convert BIM gestures to clear text output
- **Interactive phrase matching:** Support for common Malaysian sign language expressions
- **Visual feedback system:** Animated playback of gesture sequences with confidence scoring
- **Privacy-first design:** All processing happens in the browser, no video data stored
- **Responsive web interface:** Works on desktop and mobile devices

## How It Works

1. **Capture:** Use your webcam to capture hand movements in real-time
2. **Track:** MediaPipe extracts 21 landmarks per hand with smoothing filters for accuracy
3. **Recognize:** TensorFlow.js model classifies BIM gestures with confidence scoring
4. **Translate:** Convert recognized gestures to text and provide visual feedback through animation playback

## Technology Stack

- **Frontend:** React 18 with TypeScript
- **Build Tool:** Farm (Vite-compatible bundler)
- **Hand Tracking:** MediaPipe Tasks Vision
- **Machine Learning:** TensorFlow.js with custom gesture recognition model
- **Styling:** Tailwind CSS with custom brand theming
- **Animation:** Framer Motion for smooth interactions
- **Routing:** React Router for navigation

## Getting Started

### Prerequisites

- Node.js version 18 or newer
- pnpm (recommended), npm, or yarn
- Modern browser with WebRTC support for camera access

### Installation

Clone the repository:

```bash
git clone https://github.com/TraFost/bim-translator.git
cd bim-translator
```

Install dependencies:

```bash
pnpm install
# or
npm install
```

Start the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and go to [http://localhost:3000](http://localhost:3000) to see BIMTranslator.

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm clean` - Clear persistent cache files

## Project Structure

```
├── public/           # Static assets
│   ├── models/       # TensorFlow.js gesture recognition models
│   └── assets/       # Images and other static files
├── src/              # Source code
│   ├── components/   # React components
│   │   ├── demo/     # Hand sign recognition demo
│   │   └── home/     # Landing page components
│   ├── configs/      # Configuration files
│   ├── constants/    # App constants and content
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility libraries (axios, utils)
│   ├── pages/        # App pages (main, demo)
│   └── types/        # TypeScript type definitions
├── farm.config.ts    # Farm bundler configuration
├── package.json      # Project metadata and dependencies
└── README.md         # This file
```

## For Judges and Reviewers

### Impact for SEA Region

- **Removes communication barriers** for deaf and hard of hearing users in Malaysia
- **Supports BIM users** in accessing digital services and AI assistants
- **Reduces dependency** on human interpreters for basic digital interactions
- **Empowers independence** in the deaf community through direct AI communication

### Technical Innovation

- **Real-time hand tracking** with 21-point precision per hand using MediaPipe
- **Client-side processing** for privacy and performance
- **Custom gesture recognition model** trained for BIM gestures
- **Smooth filtering algorithms** for stable landmark detection
- **Interactive visual feedback** system with confidence scoring

### Feasibility and Performance

- **Live demo available** with real-time gesture recognition
- **Browser-based solution** requiring no downloads or installations
- **Responsive design** working on desktop and mobile devices
- **Privacy-first approach** with no video data storage

### User Experience

- **One-click access** to live demo
- **Intuitive interface** designed for accessibility
- **Real-time visual feedback** with color-coded hand tracking
- **Clear navigation** between landing page and demo

## Usage

### Demo Access

Visit [/demo](/demo) to try the live gesture recognition demo:

1. **Allow camera access** when prompted
2. **Position your hands** in view of the webcam
3. **Make BIM gestures** and see real-time hand tracking
4. **Select phrases** to match and see animation playback
5. **View confidence scores** for gesture recognition accuracy

### Supported Features

- Real-time hand landmark detection with visual overlay
- Gesture recognition with confidence scoring
- Phrase matching for common BIM expressions
- Interactive animation playback system
- Support for both left and right hand tracking

## What is BIM?

**BIM (Bahasa Isyarat Malaysia)** is the official sign language of Malaysia, used by the deaf and hard of hearing community. It's a rich visual language that uses:

- **Hand shapes and movements** to convey meaning
- **Facial expressions** for grammatical structure
- **Spatial relationships** for complex concepts
- **Cultural context** specific to Malaysian deaf community

BIMTranslator bridges the gap between this visual language and digital text-based systems.

## Legal

- **Privacy Policy**
- **Terms of Service**

## Contact

- **Team:** TraFost
- **GitHub:** [TraFost/bim-translator](https://github.com/TraFost/bim-translator)
- **Challenge:** Pan-SEA AI Developer Challenge 2025

## License and Use

This project is developed for the Pan-SEA AI Developer Challenge 2025. All rights reserved. Please contact the team for any reuse outside the challenge context.

---

## Farm and React

This template helps you start a React and TypeScript app with Farm.

### Setup

Install the dependencies:

```bash
pnpm install
```

### Get Started

Start the dev server:

```bash
pnpm start
```

Build the app for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

Clear persistent cache files:

```bash
pnpm clean
```
