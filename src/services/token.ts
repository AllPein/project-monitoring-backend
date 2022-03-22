import { TOKEN_TYPE, User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { prisma } from '../app'
import config from '../config'

export const generateTokens = (
  user: Partial<User>,
  secret = config.jwtSecret
): string => {
  const token = jwt.sign(
    {
      sub: {
        id: user.id,
      },
    },
    secret,
    {
      expiresIn: 60 * 60 * 10,
    }
  )
  return token
}

const verifyToken = (token: string, type: TOKEN_TYPE): boolean => {
  try {
    jwt.verify(token, config.jwtSecret)
    return true
  } catch (err) {
    return false
  }
}