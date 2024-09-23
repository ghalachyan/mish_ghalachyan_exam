import Joi from 'joi';

export default {
    create: Joi.object({
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(3).max(50).required(),
        location: Joi.string().min(3).max(50).required(),
        date: Joi.date().required(),
    }),

    getEvents: Joi.object({
        order: Joi.string().valid('asc', 'desc').default('desc').optional(),
    }),

    update: Joi.object({
        title: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(3).max(50).required(),
        location: Joi.string().min(3).max(50).required(),
        date: Joi.date().required(),
    }),

};