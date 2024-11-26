const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

router.route('/').get(tourController.getAlltours).post(tourController.addTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
