import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // In a real app, you would get the user/org ID from the session (e.g., Firebase Auth token)
    // For this prototype backend demo, we'll fetch all projects.
    const projects = await prisma.project.findMany({
      include: {
        organization: true,
        creator: true,
        dataSources: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, organizationId, createdBy } = await req.json();

    if (!name || !organizationId || !createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        organizationId,
        createdBy,
      }
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
