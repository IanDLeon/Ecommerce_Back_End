const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const orderRoutes = require('./order.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/product',
    route: productRoute,
  },
  {
    path: '/order',
    route: orderRoutes,
  },
];

router.get('/', (req, res) => {
  res.json({
    nodeVersion: process.version,
    message: 'API server working correctly',
    version: 'V1',
  });
});

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
