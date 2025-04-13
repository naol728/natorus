const reviewConteroller = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = require('express').Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/')
  .get(reviewConteroller.getAllReview)
  .post(
    authController.restrictTo('user'),
    reviewConteroller.reviewusertour,
    reviewConteroller.createReview,
  );
router
  .route('/:id')
  .get(reviewConteroller.getreview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewConteroller.updatereview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewConteroller.deletereview,
  );

module.exports = router;
