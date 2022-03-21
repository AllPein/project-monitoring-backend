import dotenv from 'dotenv'

dotenv.config()

export default {
  jwtSecret: process.env.JWT_SECRET,
  env: process.env.NODE_ENV
}