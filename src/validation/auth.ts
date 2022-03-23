import { ROLE } from '@prisma/client';
import Joi from 'joi';

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().min(5).required(),
  }),
};

export const register = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    group: Joi.string().required(),
    role: Joi.string().valid(...Object.keys(ROLE)),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
