const express = require('express');

const userController = require('./../controllers/userControllers');
const authController = require('./../controllers/authController');

const router = express.Router();

//  every body can acess this route
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotepassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

//  restricting with the middleware frist to be autenticated
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updatepassword', authController.updatePassword);
router.patch('/updateme', authController.updateMe);
router.post('/deleteme', authController.deleteMe);

// restricting this features to the admin only

router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers).post(userController.addUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
