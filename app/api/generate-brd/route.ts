import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

let ai: GoogleGenAI | null = null;

function getAIClient() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

export async function POST(req: NextRequest) {
  try {
    const aiClient = getAIClient();
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const parts: any[] = [];
    parts.push({ text: "Please analyze the following files and generate the BRD." });

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      
      // Some file types like txt can be sent as text
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        const textContent = new TextDecoder().decode(arrayBuffer);
        parts.push({
          text: `--- FILE START: ${file.name} ---\n${textContent}\n--- FILE END ---\n`
        });
      } else {
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        parts.push({
          inlineData: {
            data: base64,
            mimeType: file.type || 'application/octet-stream'
          }
        });
        parts.push({
          text: `[Provided Document: ${file.name}]`
        });
      }
    }

    const systemInstruction = `You are NexusBRD, an elite Enterprise Business Analyst Agent.
Your objective is to analyze all provided multi-modal files (audio, images, text) and generate a comprehensive Business Requirements Document (BRD) that adheres to Market Gold Standard practices.

### Core Directives & Guardrails:
1. FOCUS ON THE "WHAT" AND "WHY": You are writing a business document, not a technical spec. Do not output system architecture diagrams, database schemas, or code snippets. Keep it purely business-focused.
2. TRACEABILITY (CRITICAL): Next to every single claim, requirement, or assumption you generate, you MUST add a tag in brackets showing which uploaded file generated that requirement (e.g., \`[Source: audio_clip.mp3]\`). If an assumption is made without a direct source file, you MUST explicitly tag it as \`[Unverified Assumption]\`. Do not hallucinate data.
3. INCOMPLETE DATA: If the uploaded files lack enough context for a specific section, DO NOT hallucinate. You must output "Insufficient data provided in source files." under that section.
4. FORMAT: Output strictly in professional GitHub Flavored Markdown.

### Mandatory 10-Section Structure:
You must strictly follow this structure:
1. **Executive Summary**: Concise overview of the project, goals, and business value.
2. **Business Problem / Needs Statement**: Defines the pain point or opportunity.
3. **Project Objectives (SMART Goals)**: Specific, Measurable, Achievable, Relevant, Time-bound goals.
4. **Project Scope**: Explicitly list what is In-Scope and what is Out-of-Scope to prevent scope creep.
5. **Stakeholder Analysis**: Key individuals/groups, their roles, and expectations (format as a Markdown table).
6. **High-Level Business Requirements**: What the system must do to solve the problem.
7. **Functional & Non-Functional Requirements**: Detailed behaviors (Functional) and quality/performance standards (Non-Functional like security, speed).
8. **Assumptions & Constraints**: Factors believed to be true (assumptions) and limitations (constraints).
9. **Cost-Benefit Considerations**: Evaluation of project strategic benefits.
10. **Success Metrics / KPIs**: How success will be measured post-implementation.`;

    const responseStream = await aiClient.models.generateContentStream({
      model: "gemini-3.1-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1, // Highly deterministic guardrail
        topK: 20,         // Focus probability mass on top tokens
        topP: 0.8,        // Prevent obscure hallucinations
      }
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          if (chunk.text) {
            controller.enqueue(new TextEncoder().encode(chunk.text));
          }
        }
        controller.close();
        // Mock BigQuery logging (since we can't provision it without actual GCP setup)
        console.log(`[BigQuery Mock Log] Session completed. Processed ${files.length} files.`);
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error("Error generating BRD:", error);
    return NextResponse.json({ error: error.message || "Failed to generate BRD" }, { status: 500 });
  }
}
