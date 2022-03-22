import Joi from 'joi';
import express from 'express';
import httpStatus from 'http-status';
import pick from '../util/pick';
import ApiError from '../util/apiError';

export const validate = (schema: Object) => (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema).validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value)
  return next()
};