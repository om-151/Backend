const Stripe = require('stripe');

const paymentController = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents
            currency,
            automatic_payment_methods: { enabled: true },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

module.exports = paymentController;