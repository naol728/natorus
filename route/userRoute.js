
const express = require('express');

const userController = require('./../controllers/userControllers');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotepassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.post(
  '/updatepassword/:id',
  authController.protect,
  authController.updatePassword,
);
router.post('/updateme', authController.protect, authController.updateMe);
router.post('/deleteme', authController.protect, authController.deleteMe);

router.route('/').get(userController.getAllUsers).post(userController.addUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
