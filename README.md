# BIMTranslator

**BIMTranslator** is an AI-powered web app built for the Pan SEA AI Developer Challenge, The goal is simple: reduce communication barriers by translating Malay Sign Language.

## What Judges Can Try

- **Live demo:** [/demo](/demo)
- **Two minute video:** [https://www.youtube.com/watch?v=J_8QQJmwkWA](https://www.youtube.com/watch?v=J_8QQJmwkWA)

**API sample:**

```bash
curl -X POST https://your-api.example.com/api/translate \
    -H "Content-Type: application/json" \
    -d '{"text":"Halo, apa kabar","source":"id","target":"en"}'
```

## Features

- **Malay Sign Language assistance:** Text to sign or sign to text, depending on device
- **Browser-first processing:** Work happens in the page when possible, server fallback only when needed
- **Simple UI:** Clear layout with large controls
- **Privacy:** Demo does not store media; short error logs only, cleared often

## How It Works

1. Capture input in the browser (camera or text)
2. Run a small model in the client when possible, use the API when required
3. Return a clean output with confidence scores

## Getting Started

### Prerequisites

- Node.js version 18 or newer
- pnpm, npm, or yarn

### Installation

Clone the repository:

```bash
git clone https://github.com/mylepaklab/bim-translator.git
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

## Project Structure

```
├── public/           # Static assets such as images and models
├── src/              # Source code
│   ├── components/   # React components
│   ├── configs/      # Configuration files
│   ├── constants/    # App constants and content
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility libraries
│   ├── pages/        # App pages
│   └── types/        # TypeScript types
├── Dockerfile        # Container setup
├── docker-compose.yml# Multi container orchestration
├── cloudbuild.yaml   # Cloud build config
├── package.json      # Project metadata and scripts
└── README.md         # This file
```

## For Judges and Reviewers

- **Impact:** Faster access for deaf and hard of hearing users; less waiting; better inclusion in class and clinics
- **Feasibility:** Client model about 5 MB; median latency under one second in simple tests; SEA region API fallback about two hundred milliseconds
- **Innovation:** Client-first flow reduces cost and protects privacy; optional glossary keeps meaning for domain terms
- **Privacy and safety:** Local first; no permanent media in the demo; request filters for harmful content
- **User experience:** One click start; readable text; keyboard focus visible

## Usage

- **Demo:** [/demo](/demo)

## Legal

- **Privacy Policy**
- **Terms of Service**

## Contact

- **Email:** mylepaklab@gmail.com
- **GitHub:** [MyLepakLab](https://github.com/mylepaklab)

## License and Use

This project is for hackathon evaluation. All rights reserved. Contact the team for reuse outside the challenge.

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
