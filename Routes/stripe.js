

const express = require('express');
const Stripe = require('stripe');
const Facture = require('../Models/Facture.js');
require('dotenv').config()
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

// Créer une session de paiement pour une facture
router.post('/create-checkout-session', async (req, res) => {
  const { factureId } = req.body;

  try {
    const facture = await Facture.findById(factureId);
    if (!facture) return res.status(404).json({ message: 'facture not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Invoice #${facture._id}`,
            description: facture.description || 'Facture',
          },
          unit_amount: facture.totalTTC * 100, // en cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:3000/payment-success?factureId=${facture._id}`,
      cancel_url: `http://localhost:3000/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour le statut après paiement réussi
router.post('/confirm-payment', async (req, res) => {
  const { factureId } = req.body;

  try {
    const facture = await Facture.findById(factureId);
    
    if (!facture) return res.status(404).json({ message: 'Invoice not found' });

    facture.status = 'paid';
    await facture.save();

    res.json({ message: 'Payment confirmed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
