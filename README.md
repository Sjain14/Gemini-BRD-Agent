# 🚀 Multi-Modal BRD Generation Agent

An enterprise-grade, multi-modal AI system utilizing **Google Gemini AI**, **Vertex AI**, **Cloud Storage**, and **BigQuery** to automate the creation of structured Business Requirements Documents (BRDs) from fragmented, real-time inputs.

## 🏆 Track: Business Requirements Document (BRD) Generation Agent (#ps21)

### 📌 Problem Statement
Product teams waste countless hours manually parsing unstructured client conversations, hand-drawn UI sketches, and rough notes into formal BRDs. This leads to missing context, human error, and delayed development cycles.

### 💡 Our Solution
A scalable agentic workflow that:
1. **Ingests** multi-modal data (voice, text, images, PDFs) via Google Cloud Storage.
2. **Processes** context using Google Vertex AI and Gemini 1.5 Pro's multi-modal capabilities.
3. **Generates** formatted, explainable BRDs automatically.
4. **Logs** decision trees in BigQuery for enterprise auditability and explainability.

*Development is currently ongoing in private branches for Hack Days Delhi. Code will be merged to main shortly.*

## 📁 Repository

GitHub repository: `https://github.com/Sjain14/Gemini-BRD-Agent.git`

## 💻 Run Locally

### Prerequisites
- Node.js 20+ (recommended)
- npm

### Install
```bash
npm install
```

### Environment Variables
Create a file named `.env.local` in the project root and add:
```env
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_UNIVERSAL_DEV_MODE=false
```

- `NEXT_PUBLIC_UNIVERSAL_DEV_MODE=true` bypasses Google login everywhere, including deployed URLs.
- `NEXT_PUBLIC_UNIVERSAL_DEV_MODE=false` keeps login enabled in production and bypasses only in local development.

### Start development server
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 🚀 Deploy to Vercel

1. Go to https://vercel.com and log in with your GitHub account.
2. Click **New Project** → **Import from GitHub**.
3. Select the repository `Sjain14/Gemini-BRD-Agent`.
4. Configure:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: leave blank
5. Add environment variable:
   - `GEMINI_API_KEY` = your Gemini API key
6. Deploy.

## 📌 GitHub Push

If this folder is not yet connected to Git, run:
```bash
git init
git add .
git commit -m "Add project files and deployment README"
git branch -M main
git remote add origin https://github.com/Sjain14/Gemini-BRD-Agent.git
git pull origin main --allow-unrelated-histories
git push -u origin main
```

If the repo already exists and is connected, use:
```bash
git add README.md
git commit -m "Update README for deployment"
git push origin main
```
