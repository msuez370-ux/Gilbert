const router = require('express').Router();
const { createPaymentIntent } = require('../services/stripeService');

router.post('/stripe/intent', async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Montant invalide' });
  }
  try {
    const intent = await createPaymentIntent(amount, { source: 'jouve-ecommerce' });
    res.json({ clientSecret: intent.client_secret });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
