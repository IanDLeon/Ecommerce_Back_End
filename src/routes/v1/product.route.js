const express = require('express');
const Multer = require('multer');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum file size is 10MB
  },
});

router.route('/').post(auth('manageProducts'), validate(productValidation.createProduct), productController.createProduct);
router.route('/images').post(auth('manageProducts'), multer.array('image'), productController.uploadProductImages);
router.route('/query').get(validate(productValidation.getProducts), productController.getProducts);

router
  .route('/:productId')
  .get(auth('manageProducts'), validate(productValidation.getProduct), productController.getProduct)
  .patch(auth('manageProducts'), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth('manageProducts'), validate(productValidation.deleteProduct), productController.deleteProduct);

// router.post('/:userId/me/updateProfileImage', auth(), multer.single('file'), productController.updateProfileImage);
module.exports = router;
