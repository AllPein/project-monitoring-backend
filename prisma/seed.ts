import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createUser = async () => {
  await prisma.user.create({
    data: {
      embeddings: [0.13, 0.38, 0.54, 0.76],
      name: 'Александр'    
    }
  });
};

const main = async () => {
  await createUser()
}

main().then(() => {
  prisma.$disconnect()
})
