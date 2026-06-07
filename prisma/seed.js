const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  // Create Global Organization
  const org = await prisma.organization.create({
    data: {
      name: 'NexusBRD Global',
      domain: 'nexusbrd.com',
      billingPlan: 'enterprise'
    }
  })

  // Create Superadmin User
  const admin = await prisma.user.create({
    data: {
      organizationId: org.id,
      email: 'admin@nexusbrd.com',
      fullName: 'System Admin',
      role: 'superadmin'
    }
  })

  // Create Default AI Models
  await prisma.aiModel.createMany({
    data: [
      {
        name: 'Gemini 1.5 Pro',
        provider: 'google-vertex',
        version: 'gemini-1.5-pro-preview',
        contextWindow: 2000000,
        baseCostPer1kTokens: 0.0025
      },
      {
        name: 'Gemini 1.5 Flash',
        provider: 'google-vertex',
        version: 'gemini-1.5-flash',
        contextWindow: 1000000,
        baseCostPer1kTokens: 0.00025
      }
    ]
  })

  console.log(`Seeding finished. Superadmin created: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
