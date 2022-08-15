const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    creator: Joi.string().custom(objectId),
    title: Joi.string().required(),
    description: Joi.string().required(),
    images: Joi.array(),
    price: Joi.string().required(),
    quantity: Joi.number().required(),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    _id: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string().custom(objectId))),
    isActive: Joi.boolean(),
    select: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
    slug: Joi.string(),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      images: Joi.array(),
      price: Joi.string(),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
