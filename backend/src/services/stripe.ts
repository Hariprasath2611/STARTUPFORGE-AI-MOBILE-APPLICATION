import Stripe from 'stripe';
import { User } from '../models/schemas';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2024-04-10' as any
});

export const createStripeCustomer = async (email: string, name?: string) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name
    });
    return customer.id;
  } catch (error) {
    console.error('Stripe Customer Creation Error:', error);
    return null;
  }
};

export const createSubscriptionSession = async (userId: string, planName: 'Starter' | 'Pro' | 'Enterprise', priceId: string, successUrl: string, cancelUrl: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      customerId = await createStripeCustomer(user.email, user.name) || '';
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        planName
      }
    });

    return session;
  } catch (error) {
    console.error('Stripe Session Generation Error:', error);
    throw error;
  }
};

export const handleStripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planName = session.metadata?.planName as 'Free' | 'Starter' | 'Pro' | 'Enterprise';
      if (userId && planName) {
        await User.findByIdAndUpdate(userId, {
          subscriptionPlan: planName,
          subscriptionStatus: 'active',
          subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const user = await User.findOne({ stripeCustomerId: subscription.customer as string });
      if (user) {
        user.subscriptionPlan = 'Free';
        user.subscriptionStatus = 'cancelled';
        await user.save();
      }
      break;
    }
  }
};
