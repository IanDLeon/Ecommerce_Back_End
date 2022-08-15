const httpStatus = require('http-status');
const { randomUUID } = require('crypto');
const util = require('util');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const { bucket } = require('../config/storage');

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(product);
});

const uploadProductImages = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.length) {
    return next();
  }

  try {
    const promises = [];
    const publicUrls = [];

    req.files.forEach((file) => {
      const { originalname, buffer } = file;
      const blob = bucket.file(`product-${randomUUID()}-${originalname.replace(/ /g, '_')}`);
      const _promise = new Promise((resolve, reject) => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
        blobStream
          .on('finish', async () => {
            const publicUrl = util.format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
            publicUrls.push(publicUrl);
            resolve();
          })
          .on('error', (err) => {
            reject(err);
          })
          .end(buffer);
      });
      promises.push(_promise);
    });

    await Promise.all(promises);
    return res.send(publicUrls);
  } catch (err) {
    return res.json(err);
  }
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['_id', 'category', 'isActive', 'isApproved', 'creator']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate', 'select']);
  const result = await productService.queryProducts(filter, options);
  res.send(result);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }
  res.send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.send(product);
});

const approveProduct = catchAsync(async (req, res) => {
  const product = await productService.approveProductById(req.params.productId);
  res.send(product);
});

const disapproveProduct = catchAsync(async (req, res) => {
  const product = await productService.disapproveProductById(req.params.productId);
  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
  disapproveProduct,
  uploadProductImages,
};
