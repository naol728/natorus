const stripe = require('stripe')(process.env.STRIPESECRETEKEY);
const Tour = require('./../models/tourmodel');
const catchAsync = require('./../utils/catchAsync');

exports.checkoutSession = catchAsync(async (req, res, next) => {
  // 1) find the tour with the tour id

  const tour = await Tour.findById(req.params.tourId);

  // 2) creating a session witht the stripe

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',

    payment_method_types: ['card'],
    customer_email: req.user.email,
    success_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    cancel_url: `${req.protocol}://${req.get('host')}2`,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'sucess',
    session,
  });
});
