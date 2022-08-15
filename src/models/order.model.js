const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema({
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'Product',
  },
  quantity: {
    type: mongoose.SchemaTypes.Number,
    required: true,
  },
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    products: [productSchema],
    status: {
      type: String,
      required: true,
      default: 'pending',
    },
    reason: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    contactNo: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

/**
 * @typedef Order
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
