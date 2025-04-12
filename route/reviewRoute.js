const reviewConteroller = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = require('express').Router({ mergeParams: true });
router
  .route('/')
  .get(reviewConteroller.getAllReview)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewConteroller.createReview,
  );
router
  .route('/:id')
  .get(reviewConteroller.getreview)
  .patch(authController.protect, reviewConteroller.updatereview)
  .delete(authController.protect, reviewConteroller.deletereview);

module.exports = router;
