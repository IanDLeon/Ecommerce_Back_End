/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const slugify = require('slugify');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const { randomString } = require('../utils/helpers');
/**
 * Create a Product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  const slug = `${slugify(productBody.title, { lower: true })}-${randomString(10)}`;
  productBody.slug = slug;
  const product = Product.create(productBody);
  return product;
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
const queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

// TODO: add filter and options to the query
/**
 * Get Products by vendorId
 * @param {ObjectId} vendorId
 * @returns {Promise<Product>}
 */
const getProductsByVendorId = async (vendorId) => {
  const products = await Product.paginate({ creator: vendorId }, {});
  return products;
};

/**
 * Update Product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  if (!product.isActive) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Product disabled');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete Product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  if (!product.isActive) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Product already disabled');
  }
  Object.assign(product, {
    isActive: false,
  });
  await product.save();
  return product;
};

/**
 * Approve Product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const approveProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  if (product.approved) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Product already active');
  }
  Object.assign(product, {
    approved: true,
  });
  await product.save();
  return product;
};

/**
 * Disapprove Product by id
 * @param {ObjectId} productId
 * @param {String} message
 * @returns {Promise<Product>}
 */
const disapproveProductById = async (productId, message) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  if (product.approved) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Product already active');
  }
  Object.assign(product, {
    approved: false,
    message,
  });
  await product.save();
  return product;
};

module.exports = {
  createProduct,
  queryProducts,
  getProductsByVendorId,
  getProductById,
  updateProductById,
  deleteProductById,
  approveProductById,
  disapproveProductById,
};
