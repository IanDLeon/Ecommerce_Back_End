const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const category = await orderService.createOrder(req.body);
  return res.status(httpStatus.CREATED).send(category);
});

const queryOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['product', 'vendor', '_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
  const result = await orderService.queryOrders(filter, options);
  return res.send(result);
});

const updateOrder = catchAsync(async (req, res) => {
  await orderService.updateOrder(req.params.orderId, req.body);
  return res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createOrder,
  queryOrders,
  updateOrder,
};
