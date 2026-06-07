# NexusBRD - Project Explanation

## The "Explain it like I'm 5" Overview
NexusBRD is an AI-powered assistant that automatically writes Business Requirement Documents (BRDs). Instead of a Product Manager spending days listening to meeting recordings, looking at whiteboard sketches, and reading notes to write a single document, they just drag and drop all those files into NexusBRD. The application uses AI to connect the dots and immediately drafts a professional, structured document.

## What Happens & How it Happens
1. **Multi-Modal Ingestion**: The user uploads various file types (audio, images, PDFs, raw text) via the drag-and-drop interface in the "Agent Workspace".
2. **Backend Processing**: The frontend packages these files as `FormData` and sends them to a secure Next.js backend API Route (`/app/api/generate-brd/route.ts`).
3. **AI Synthesis (Gemini 3.1 Pro)**: The backend securely attaches the developer API key and sends all the files (as inline base64 or text) to Google's Gemini model. The model is given strict instructions to act as a Business Analyst, cross-reference the assets, and write the BRD in Markdown.
4. **Traceability**: The AI specifically tags every requirement it generates with the exact source file it came from (e.g., `[Source: sketch.jpg]`).
5. **Display & Versioning**: The backend returns the finished markdown. The frontend renders this beautifully using `react-markdown`. If you generate multiple times, it stores each iteration in a version drop-down so you can compare changes.

## Tech Stack
* **Frontend**: Next.js (App Router), React 19, Tailwind CSS v4, Lucide Icons.
* **Backend**: Next.js API Routes (Serverless backend built into the framework).
* **AI Engine**: Google GenAI SDK (`@google/genai`) utilizing the `gemini-3.1-pro-preview` model.
* **Data Parsing**: Standard Web APIs (FormData, File APIs, Buffers).

## Features & Sub-features
* **The Agent Workspace** (Core):
  * Drag-and-drop multi-modal ingestion zone.
  * Live status file upload and processing indicators.
  * Real-time Markdown rendering for the output BRD.
  * **Version Control Element**: Maintains an in-memory history of document versions generated during the session.
  * **Export System**: Converts the generated Markdown into a downloadable `.md` file.
* **Enterprise Infrastructure Shells (UI/UX Modules)**:
  * **Projects Tab**: Manages different BRD campaigns.
  * **Data Sources Tab**: UI for managing cloud storage buckets (GCS/S3) or databases.
  * **Models Tab**: Model selection and tier management.
  * **BigQuery Audit Logs Tab**: Simulates an enterprise traceability log showing past generation sessions.
  * **Settings Tab**: User preferences, visual themes, and cloud credentials management.

## Specialties
* **Source Traceability / Anti-Hallucination**: The biggest computational advantage is that NexusBRD intrinsically links output requirements directly to the business input files.
* **Enterprise-Ready Shell**: The UI is designed to look like a robust, B2B internal dashboard rather than a simple consumer playground.
* **Multi-Modal Dominance**: Relies heavily on the newest LLM capabilities to look at an image (a UI wireframe) and listen to audio (a client explaining the wireframe) natively at the very same time to synthesize a holistic requirement.
