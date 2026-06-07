# Document 2: Technical Architecture Document (TAD)

## 1. System Architecture Overview
Our system moves away from traditional monolithic backends and utilizes a modern, serverless AI orchestration model using Google Cloud's latest 2026 stack.

## 2. Component Breakdown
* **Frontend Interface**: Next.js App Router with React and Tailwind CSS. Acts as the client-side ingestion dashboard.
* **AI Orchestration (Google AI Studio / Agent Builder)**: Instead of writing custom LLM routing logic, we use Vertex AI Agent Builder to create a "BRD Analyst Agent". This provides built-in RAG (Retrieval-Augmented Generation) and multi-modal handling.
* **Intelligence Core**: gemini-3.1-pro-preview. Processes the spatial (images) and semantic (audio/text) data.
* **Data Lake (GCS)**: Google Cloud Storage acts as the temporary staging area for raw files before they are passed to the Agent.
* **Explainability Layer (BigQuery)**: An audit table that maps Session_ID, Input_GCS_URIs, and Output_Markdown to prevent hallucination liabilities.

## 🛠️ PART 2: Execution Plan (How to build it in AI Studio)
Since you are using Google AI Studio / Agent Builder, here is your exact fast-track plan.

### Step 1: Tune the Prompt in Google AI Studio
You don't need to code the AI logic. Go to Google AI Studio.
Click Create New Prompt -> System Instructions.
Paste this exact prompt into the System Instructions:
"You are NexusBRD, an elite Enterprise Business Analyst Agent. Your objective is to analyze all provided multi-modal files (audio, images, text) and generate a comprehensive Business Requirements Document (BRD). Output strictly in Markdown. You MUST include: 1. Executive Summary, 2. Functional Requirements (mapped to specific UI elements if an image is provided), 3. Non-Functional Requirements, 4. Data Models. Next to every single requirement you generate, you MUST add a tag in brackets showing which uploaded file generated that requirement (e.g., [Source: audio_clip.mp3] or [Source: ui_sketch.jpg]). Do not hallucinate."

### Step 2: Set up the Google Cloud Resources
1. Create a Google Cloud Storage bucket: `nexus-brd-uploads`.
2. Create a BigQuery Table: `nexus_project.brd_audit.logs`.
3. Get your `gcp-key.json` Service Account file.

### Step 3: Wire the Frontend and Backend
Create a lightweight backend (Next.js `/api/generate-brd` routes) that:
1. Receives multiple files via a POST request from the frontend.
2. Uploads those files to a Google Cloud Storage bucket named 'nexus-brd-uploads' (or passes directly as multi-modal inline data temporarily).
3. Uses the Google GenAI SDK (for AI Studio/Gemini 3.1 Pro) to send the files to the model, along with a system prompt to generate a BRD.
4. Logs the request ID, the GCS URIs, and the generated Markdown BRD into BigQuery.
5. Returns the Markdown to the frontend so it dynamically renders inside the dashboard.
