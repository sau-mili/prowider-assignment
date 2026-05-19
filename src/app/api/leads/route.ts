import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const RULES: Record<number, { mandatory: number[], pool: number[] }> = {
  1: { mandatory: [1], pool: [2, 3, 4] },
  2: { mandatory: [5], pool: [6, 7, 8] },
  3: { mandatory: [1, 4], pool: [2, 3, 5, 6, 7, 8] }
};

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const serviceId = parseInt(data.serviceId);

    // Run inside an ACID transaction to handle the "generate 10 leads instantly" concurrency test
    const result = await prisma.$transaction(async (tx) => {
      // 1. Enforce Duplicate Rule
      const existing = await tx.lead.findUnique({
        where: { phone_serviceId: { phone: data.phone, serviceId } }
      });
      if (existing) throw new Error("A lead with this phone number already exists for this service.");

      const rule = RULES[serviceId];
      
      // 2. Fetch eligible mandatory providers (must have quota)
      const mandatoryProviders = await tx.provider.findMany({
        where: { id: { in: rule.mandatory }, quota: { gt: 0 } }
      });

      // 3. Fetch eligible pool providers (Fair Round-Robin based on lastAssignedAt)
      const neededFromPool = 3 - mandatoryProviders.length;
      const poolProviders = await tx.provider.findMany({
        where: { id: { in: rule.pool }, quota: { gt: 0 } },
        orderBy: { lastAssignedAt: 'asc' }, // The oldest assigned gets priority
        take: neededFromPool
      });

      const selectedProviders = [...mandatoryProviders, ...poolProviders];
      
      if (selectedProviders.length === 0) {
          throw new Error("No providers available (quota exhausted).");
      }

      // 4. Create the Lead
      const newLead = await tx.lead.create({
        data: {
          name: data.name,
          phone: data.phone,
          city: data.city,
          description: data.description,
          serviceId: serviceId
        }
      });

      // 5. Create Assignments & Decrement Quotas Atomicly
      for (const provider of selectedProviders) {
        await tx.assignment.create({
          data: { leadId: newLead.id, providerId: provider.id }
        });
        await tx.provider.update({
          where: { id: provider.id },
          data: { 
            quota: { decrement: 1 }, 
            lastAssignedAt: new Date() 
          }
        });
      }
      return newLead;
    });

    return NextResponse.json({ success: true, lead: result });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}