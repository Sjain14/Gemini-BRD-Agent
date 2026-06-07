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
    const { messages, brdContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const systemInstruction = `You are NexusBRD Advisory Assistant. Your role is to answer questions, discuss, and analyze the currently generated Business Requirements Document (BRD) provided in the context below. 
You cannot edit the document directly. Help the user clarify requirements, brainstorm additions, or catch missing elements. Keep responses concise and professional.
    
--- CURRENT BRD CONTEXT ---
${brdContext || 'No BRD context provided.'}
---------------------------`;

    // Convert standard {role, content} messages to Gemini's expected format
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const responseStream = await aiClient.models.generateContentStream({
      model: "gemini-3.1-pro-preview",
      contents: formattedMessages,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
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
    console.error("Error in chat:", error);
    return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
  }
}
