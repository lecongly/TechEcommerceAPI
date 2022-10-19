import Joi from 'joi';

const create = Joi.object({
    name: Joi.string().required(),
});

export default { create };
