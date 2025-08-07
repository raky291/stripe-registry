import { createClient } from "@/lib/server";
import { getCustomerByUserId } from "./queries";

type ActionWithCustomer = (
  formData: FormData,
  userId: string,
  customerId: string,
) => Promise<void>;

export function withCustomer(action: ActionWithCustomer) {
  return async (formData: FormData): Promise<void> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const customer = await getCustomerByUserId({ userId: user.id });
    if (!customer || !customer.id) {
      throw new Error("Customer not found");
    }

    return action(formData, user.id, customer.id);
  };
}
