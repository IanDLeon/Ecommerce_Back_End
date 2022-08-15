const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const { orderController } = require('../../controllers');

const router = express.Router();

router.route('/query').get(auth('manageOrders'), validate(orderValidation.queryOrders), orderController.queryOrders);

router.route('/my-orders').get(auth(), validate(orderValidation.queryOrders), orderController.queryOrders);

router.route('/place').post(auth('createOrder'), validate(orderValidation.createOrder), orderController.createOrder);

router.route('/create').post(auth('manageOrders'), validate(orderValidation.createOrder), orderController.createOrder);

router
  .route('/manage/:orderId')
  .patch(auth('manageOrders'), validate(orderValidation.updateOrderStatus), orderController.updateOrder);

router
  .route('/cancel/:orderId')
  .patch(auth('cancelOrder'), validate(orderValidation.updateOrderStatus), orderController.updateOrder);

module.exports = router;
