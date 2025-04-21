import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(process.env.STRIPEPUBLIKKEY);

export const BookTour = async (tourId) => {
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/booking/checkout/session/${tourId}`,
    );

    const result = await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
    console.log(result);
  } catch (err) {
    showAlert('error', err.message);
  }
};
