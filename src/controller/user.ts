import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { prisma } from '../app';
import pick from '../util/pick';
import { generateTokens } from '../services/token';
import exclude from '../util/exclude';

export const findMany: RequestHandler = async (req, res) => {
  try {
    const items = await prisma.user.findMany();
    res.send(items);
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const findUnique: RequestHandler = async (req, res) => {
  res.send(exclude(req.user, ['password']));
};

export const search: RequestHandler = async (req, res) => {
  const result = await prisma.user.findMany({
    where: {
      OR: [
        {
          firstName: {
            search: req.params['search'],
          },
        },
        {
          lastName: {
            search: req.params['search'],
          },
        },
        {
          email: {
            search: req.params['search'],
          },
        },
      ],
    },
  });
  res.send(result);
};

export const create: RequestHandler = async (req, res) => {
  try {
    const result = await prisma.user.create({
      data: {
        ...req.body,
        avatarColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      },
      include: {
        projects: true,
      },
    });
    const token = generateTokens(result);
    res.send({ user: result, token });
  } catch (err) {
    console.log(err);
    res.sendStatus(httpStatus.BAD_REQUEST);
  }
};

export const update: RequestHandler = async (req, res) => {
  try {
    const result = await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        ...req.body,
        projects: undefined
      },
    });
    res.send(exclude(result, ['password']));
  } catch (err) {
    console.log(err);
    res.sendStatus(httpStatus.BAD_REQUEST);
  }
};