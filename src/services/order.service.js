const httpStatus = require('http-status');
const { Order } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Category
 * @param {Object} body
 * @returns {Promise<Order>}
 */
const createOrder = async (body) => {
  return Order.create(body);
};

/**
 * Query for Products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

/**
 * Update Product by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateOrder = async (orderId, updateBody) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  Object.assign(order, updateBody);
  await order.save();
  return order;
};

module.exports = {
  createOrder,
  queryOrders,
  updateOrder,
};
