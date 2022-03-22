import { RequestHandler } from 'express'
import httpStatus from 'http-status'
import { prisma } from '../app'
import pick from '../util/pick'

export const findMany: RequestHandler = async (req, res) => {
  try {
    const items = await prisma.user.findMany()
    res.send(items)
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

export const findUnique: RequestHandler = async (req, res) => {
  res.send(pick(req.user, ['username', 'role', 'id']))
}

export const create: RequestHandler = async (req, res) => {
  try {
    const result = await prisma.user.create({
      data: req.body,
    })
    res.send(result)
  } catch (err) {
    console.log(err)
    res.sendStatus(httpStatus.BAD_REQUEST)
  }
}