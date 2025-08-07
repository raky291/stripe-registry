"use server";

import { createCheckoutSession, createCustomerPortalSession } from "./server";
import { withCustomer } from "./utils";

export const checkoutAction = withCustomer(
  async (formData, userId, customerId) => {
    const priceId = formData.get("priceId") as string | null;
    if (!priceId) {
      throw new Error("Price ID is required");
    }

    await createCheckoutSession({
      userId: userId,
      customerId: customerId,
      priceId: priceId,
      successUrl: `${process.env.BASE_URL}/protected/payment-success`,
      cancelUrl: `${process.env.BASE_URL}/protected/subscription-plans`,
    });
  },
);

export const customerPortalAction = withCustomer(
  async (_formData, _userId, customerId) => {
    await createCustomerPortalSession({
      customerId: customerId,
      returnUrl: `${process.env.BASE_URL}/protected/manage-subscription`,
    });
  },
);
