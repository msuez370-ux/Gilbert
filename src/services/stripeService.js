const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (amount, metadata = {}) => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'eur',
    metadata
  });
};

exports.constructWebhookEvent = (payload, sig) => {
  return stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
};
