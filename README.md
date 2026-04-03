# ReCheck

AI-powered resume analyzer and ATS (Applicant Tracking System) score checker. Upload your resume as a PDF, compare it against a job description, and get detailed, actionable feedback powered by Google Gemini.

## Features

- **ATS Score Checker** -- Scores your resume against a specific job description. Provides keyword match analysis, section-by-section feedback, strengths, weaknesses, and improvement suggestions.
- **Resume Optimizer** -- Analyzes your resume for a target job title and industry. Offers keyword suggestions, achievement rewrites, skills enhancement, and a professional summary rewrite.
- **PDF Parsing** -- Extracts text from uploaded PDF resumes client-side using pdfjs-dist.
- **Blog Resources** -- Built-in guides on ATS systems, resume writing, and templates.

## Tech Stack

- **Frontend**: React, Vite, Vanilla CSS, Lucide React (icons), pdfjs-dist
- **Backend**: Express, Google Gemini API (@google/genai)
- **Dev Tooling**: Concurrently (single dev command)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Setup

```bash
git clone <repo-url>
cd ReCheck
npm install
```

Create the environment file for the backend:

```bash
echo "GEMINI_API_KEY=your_key_here" > server/.env
```

### Run

```bash
npm run dev
```

### Build

```bash
npm run build
```