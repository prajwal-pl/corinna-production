"use server";

import { client } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  typescript: true,
  apiVersion: "2025-02-24.acacia",
});

export const onCreateCustomerPaymentIntentSecret = async (
  amount: number,
  stripeId: string
) => {
  try {
    const user = await currentUser();
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      billing_details: {
        address: {
          city: "Bangalore",
          country: "IN",
          line1: "",
          line2: "",
          postal_code: "560074",
          state: "KN",
        },
        email: user?.emailAddresses[0].emailAddress,
        name: user?.firstName,
      },
    });

    const paymentIntent = await stripe.paymentIntents.create(
      {
        customer: stripeId,
        // payment_method_types: ["card"],
        currency: "INR",
        amount: amount * 100,
        description: "subscription services",
        statement_descriptor: "Corinna Services",
        payment_method: paymentMethod.id,
        metadata: {
          amount: amount,
          type: "subscription",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      },
      { stripeAccount: stripeId }
    );

    const customer = await stripe.customers.create({
      name: "Prajwal PL",
      address: {
        line1: "",
        postal_code: "560074",
        city: "Bangalore",
        state: "KN",
        country: "IN",
      },
    });

    if (paymentIntent && customer) {
      return { secret: paymentIntent.client_secret };
    }
  } catch (error) {
    console.log(error);
  }
};

export const onUpdateSubscription = async (
  plan: "STANDARD" | "PRO" | "ULTIMATE"
) => {
  try {
    const user = await currentUser();
    if (!user) return;
    const update = await client.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        subscription: {
          update: {
            data: {
              plan,
              credits: plan == "PRO" ? 50 : plan == "ULTIMATE" ? 500 : 10,
            },
          },
        },
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (update) {
      return {
        status: 200,
        message: "subscription updated",
        plan: update.subscription?.plan,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

const setPlanAmount = (item: "STANDARD" | "PRO" | "ULTIMATE") => {
  if (item == "PRO") {
    return 1500;
  }
  if (item == "ULTIMATE") {
    return 3500;
  }
  return 0;
};

export const onGetStripeClientSecret = async (
  item: "STANDARD" | "PRO" | "ULTIMATE"
) => {
  try {
    const user = await currentUser();
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: "tok_visa",
      },
      billing_details: {
        address: {
          city: "Bangalore",
          country: "IN",
          line1: "",
          line2: "",
          postal_code: "560074",
          state: "KN",
        },
        phone: "1234567890",
        email: user?.emailAddresses[0].emailAddress,
        name: user?.firstName,
      },
    });

    const amount = setPlanAmount(item);
    const paymentIntent = await stripe.paymentIntents.create({
      automatic_payment_methods: {
        enabled: true,
      },
      currency: "INR",
      amount: amount,
      // payment_method_types: ["card"],
      payment_method: paymentMethod.id,
      description: "subscription services",
    });

    if (paymentIntent) {
      return { secret: paymentIntent.client_secret };
    }
  } catch (error) {
    console.log(error);
  }
};
