import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const createUser = async () => {
}

const main = async () => {
  await createUser()
}

main().then(() => {
  prisma.$disconnect()
})
