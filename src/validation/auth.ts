import Joi from 'joi';

export const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().min(5).required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  })
}