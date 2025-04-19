const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRoute = require('./../route/reviewRoute');
const router = express.Router();

// router.param('id', tourController.checkID);
// redirecting the route
router.use('/:tourId/reviews', reviewRoute);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route('/tours-withn/:distance/center/:latlng/unit/:unit')
  .get(tourController.tourWithn);
router.route('/distance/:latlng/unit/:unit').get(tourController.getDistances);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourimage,
    tourController.resizeImages,
    tourController.deleteTour,
  );

module.exports = router;
