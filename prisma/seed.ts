import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Create the 3 Services
  await prisma.service.createMany({
    data: [
      { id: 1, name: 'Service 1' },
      { id: 2, name: 'Service 2' },
      { id: 3, name: 'Service 3' },
    ],
    skipDuplicates: true,
  })

  // 2. Create the 8 Providers (Each with quota: 10)
  const providers = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `Provider ${i + 1}`,
    quota: 10,
  }))

  await prisma.provider.createMany({
    data: providers,
    skipDuplicates: true,
  })
  
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })