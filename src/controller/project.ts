import { PROJECT_ROLE, ROLE, User } from '@prisma/client';
import { RequestHandler } from 'express';
import { prisma } from '../app';
import ApiError from '../util/apiError';

export const create: RequestHandler = async (req, res, next) => {
  try {
    const result = await prisma.project.create({
      data: {
        ...req.body
      },
    });
    await prisma.user.update({
      where: {
        // @ts-ignore
        id: req.user.id,
      },
      data: {
        projects: {
          connect: {
            id: result.id,
          },
        },
      },
    });
    const participant = await prisma.participant.create({
      data: {
        // @ts-ignore
        userId: req.user.id,
        projectId: result.id,
        role: PROJECT_ROLE.OWNER,
      },
    });
    res.send({ result, participant });
  } catch {
    next(new ApiError(400, 'oops'));
  }
};

export const addParticipant: RequestHandler = async (req, res, next) => {
  try {
    const conn = await prisma.participant.findFirst({
      where: {
        ...req.body,
        role: undefined,
      },
    });
    if (conn != null) {
      next(new ApiError(400, 'User already registered'));
      return;
    }
    await prisma.participant.create({
      data: req.body,
    });

    const result = await prisma.project.findUnique({
      where: {
        id: req.body.projectId,
      },
      include: {
        participants: {
          include: {
            user: true
          }
        },
      },
    })
    res.send(result);
  } catch (e) {
    next(new ApiError(400, e.toString()));
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const result = await prisma.project.update({
      where: {
        id: req.body.id,
      },
      data: {
        ...req.body,
        id: undefined,
      },
      include: {
        participants: {
          include: {
            user: true
          }
        },
      }
    });
    res.send(result);
  } catch {
    next(new ApiError(400, 'error'));
  }
};

export const getUserProjects: RequestHandler = async (req, res) => {
  const user = req.user;
  //@ts-ignore
  if (user.role === ROLE.ADMIN) {
    res.send(
      await prisma.project.findMany({
        include: {
          participants: true,
        },
      })
    );
  } else {
    res.send(
      // @ts-ignore
      user.projects
    );
  }
};

export const getUniqueProject: RequestHandler = async (req, res, next) => {
  try {
    const result = await prisma.project.findUnique({
      where: {
        code: +req.params.id,
      },
      include: {
        participants: {
          include: {
            user: true
          }
        },
      },
    });
    if (result != null) {
      res.send(result);
    } else {
      next(new ApiError(400, 'project not found'));
    }
  } catch (e) {
    next(new ApiError(400, 'oops'));
  }
};
