import Joi from "joi";

export const create = Joi.object().keys({
  create: Joi.object().required()
})

export const connectOrCreate = Joi.object().keys({
  
})

export const connect = Joi.object().keys({
  connect: Joi.object().required()
})