"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = exports.createSubscriptionSession = exports.createStripeCustomer = void 0;
const stripe_1 = __importDefault(require("stripe"));
const schemas_1 = require("../models/schemas");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2024-04-10'
});
const createStripeCustomer = async (email, name) => {
    try {
        const customer = await stripe.customers.create({
            email,
            name
        });
        return customer.id;
    }
    catch (error) {
        console.error('Stripe Customer Creation Error:', error);
        return null;
    }
};
exports.createStripeCustomer = createStripeCustomer;
const createSubscriptionSession = async (userId, planName, priceId, successUrl, cancelUrl) => {
    try {
        const user = await schemas_1.User.findById(userId);
        if (!user)
            throw new Error('User not found');
        let customerId = user.stripeCustomerId;
        if (!customerId) {
            customerId = await (0, exports.createStripeCustomer)(user.email, user.name) || '';
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
    }
    catch (error) {
        console.error('Stripe Session Generation Error:', error);
        throw error;
    }
};
exports.createSubscriptionSession = createSubscriptionSession;
const handleStripeWebhook = async (event) => {
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const userId = session.metadata?.userId;
            const planName = session.metadata?.planName;
            if (userId && planName) {
                await schemas_1.User.findByIdAndUpdate(userId, {
                    subscriptionPlan: planName,
                    subscriptionStatus: 'active',
                    subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
                });
            }
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object;
            const user = await schemas_1.User.findOne({ stripeCustomerId: subscription.customer });
            if (user) {
                user.subscriptionPlan = 'Free';
                user.subscriptionStatus = 'cancelled';
                await user.save();
            }
            break;
        }
    }
};
exports.handleStripeWebhook = handleStripeWebhook;
