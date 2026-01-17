const express = require('express');
const Stripe = require('stripe');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Create checkout session
router.post('/', auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: course.title, description: course.description },
          unit_amount: course.price * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/courses/${courseId}`,
      metadata: { courseId, userId: req.user.id },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { courseId, userId } = session.metadata;

    const Enrollment = require('../models/Enrollment');
    const enrollment = new Enrollment({ user: userId, course: courseId });
    await enrollment.save();

    await User.findByIdAndUpdate(userId, { $push: { enrolledCourses: courseId } });
    await Course.findByIdAndUpdate(courseId, { $push: { enrolledStudents: userId } });
  }

  res.json({ received: true });
});

module.exports = router;