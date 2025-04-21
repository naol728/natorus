import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51RGIbTQv01GBJd0NJbHFF0TXf44CPvUFBlG0V5lNcWIk9WDjfYm8CFxIu5Bpt8PldbSVQaPVru9QDMfILgeJfk0D006LsY0pzN',
);

export const BookTour = async (tourId) => {
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout/session/${tourId}`,
    );

    const result = await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err.message);
  }
};
