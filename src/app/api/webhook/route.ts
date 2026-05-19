import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, providerId } = body;

    // 1. IDEMPOTENCY CHECK: Try to save the unique eventId. 
    // If it already exists, Prisma throws an error and we safely skip updating the quota.
    await prisma.webhookEvent.create({
      data: { id: eventId }
    });

    // 2. Reset Quota (Only happens if the eventId was successfully created above)
    await prisma.provider.update({
      where: { id: parseInt(providerId) },
      data: { quota: 10 }
    });

    return NextResponse.json({ success: true, message: "Payment processed. Quota reset to 10." });
    
  } catch (error: any) {
    // P2002 is Prisma's specific error code for "Unique Constraint Failed"
    if (error.code === 'P2002') {
      // Return 200 OK to the payment gateway so it stops retrying, but do NOT reset the quota again.
      return NextResponse.json({ success: true, message: "Webhook already processed (Idempotent)." }, { status: 200 });
    }
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}