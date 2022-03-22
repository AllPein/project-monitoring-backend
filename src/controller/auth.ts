import { Prisma, User } from '.prisma/client'
import { RequestHandler } from 'express'
import { UNAUTHORIZED } from 'http-status'
import jwt from 'jsonwebtoken'
import { prisma } from '../app'
import { generateTokens } from '../services/token'

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findFirst({
    where: {
      email,
      password,
    },
    select: {
      password: false,
      role: true,
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      group: true,
      projects: {
        select: {
          id: true,
          code: true,
          avatar: true,
          dueDate: true,
          participants: {
            select: {
              id: true
            }
          }
        }
      }
    },
  })
  if (!user) {
    res.status(UNAUTHORIZED).send({ message: 'wrong credentials' })
  }
  const token = generateTokens(user)
  res.send({
    user,
    token,
  })
}