import { PROJECT_ROLE } from '@prisma/client';
import Joi from 'joi';

export const create = {
  body: Joi.object().keys({
    repo: Joi.string().uri().required(),
    avatar: Joi.string().uri(),
    dueDate: Joi.date().required(),
    name: Joi.string().max(50).required(),
    description: Joi.string(),
  }),
};

export const update = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    repo: Joi.string().uri(),
    avatar: Joi.string().uri(),
    dueDate: Joi.date(),
    name: Joi.string().max(50),
    description: Joi.string(),
  }),
};

export const addParticipant = {
  body: Joi.object().keys({
    userId: Joi.string().uuid().required(),
    projectId: Joi.string().uuid().required(),
    role: Joi.string().valid(...Object.keys(PROJECT_ROLE)),
  }),
};
