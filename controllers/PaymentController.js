const stripe = require('stripe')('sk_test_51LzbRsSJN1kxiBMuSTpgKtP83UPkPZ1zzkA99633rxyZC55ofQDJB6IUSqForhYfom1gipovTSQ75wIaJVBhLDt500OYB6wU6s');
const express = require('express');
const app = express();

app.use(express.static("views"));

const YOUR_DOMAIN = 'http://localhost:3000';


const PaymentController = {

    async create_payment (req, res) {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              price: 'price_1M7FkFSJN1kxiBMuYbJjWDBb',
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${YOUR_DOMAIN}/success.html`,
          cancel_url: `${YOUR_DOMAIN}/cancel.html`,
        });
      
        res.redirect(303, session.url);
    }
};

module.exports = PaymentController;