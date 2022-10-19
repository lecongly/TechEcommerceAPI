import Joi from 'joi';

const create = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string().required(),
    content: Joi.string().required(),
    image: Joi.object(),
    category: Joi.string().required(),
    sold: Joi.number().positive().required(),
    stock: Joi.number().positive().required(),
});

export default { create };
