import * as React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import http from '../lib/http.js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51RtrSPDBydDumFNfyxCpaCRdIjMe0l8R33MFKQp1cxbahEB5CV1fCFosTyAJmKhLE4Ui8wrYeVtu7RbFDgfCRxAR00zEOIoMpo', {
});

const CheckoutComponent = ({}) => {
  const fetchClientSecret = async () => {
    try {
      const response = await http.post('/api/stripe/create-checkout-session');
      return response.data.clientSecret;
    } catch (error) {
      console.error('Error fetching client secret:', error);
      throw error;
    }
  };
  const options = {fetchClientSecret};

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={options}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}

export default CheckoutComponent;