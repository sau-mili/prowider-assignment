import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Ensures Next.js doesn't cache this data

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      include: {
        assignments: { 
          include: { lead: true } // Fetches the actual lead details for each assignment
        }
      },
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(providers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 });
  }
}