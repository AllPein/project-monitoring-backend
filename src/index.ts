import app, { prisma } from './app'

const port = process.env.PORT || 3000

const server = app.listen(port, () => console.log(`server started at http://localhost:${port}`))

process.on('SIGTERM', () => {
  if (server) {
    server.close();
  }
  prisma.$disconnect()
});

