const bonkingConteroller = require('./../controllers/bonkingConteroller');
const authController = require('./../controllers/authController');

const router = require('express').Router();

router.get(
  '/checkout/session/:tourId',
  authController.protect,
  bonkingConteroller.checkoutSession,
);

module.exports = router;
