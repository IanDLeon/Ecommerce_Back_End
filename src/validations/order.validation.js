const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    user: Joi.string().custom(objectId),
    products: Joi.array(),
    status: Joi.string().valid('pending', 'accepted', 'decline', 'cancel', 'delivered'),
    name: Joi.string(),
    email: Joi.string().email(),
    contactNo: Joi.string(),
    address: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    price: Joi.number().min(1),
  }),
};

const queryOrders = {
  query: Joi.object().keys({
    _id: Joi.string().custom(objectId),
    product: Joi.string().custom(objectId),
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateOrderStatus = {
  body: Joi.object().keys({
    status: Joi.string().required().valid('pending', 'accepted', 'decline', 'cancel', 'delivered'),
    reason: Joi.string(),
  }),
};

const cancelOrder = {
  body: Joi.object().keys({
    reason: Joi.string(),
  }),
};

module.exports = {
  createOrder,
  queryOrders,
  updateOrderStatus,
  cancelOrder,
};
