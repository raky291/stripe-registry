import { NextRequest, NextResponse } from "next/server";
import { createCustomer } from "@/lib/stripe/server";

interface CreateCustomerRequest {
  record: {
    id: string;
    email: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCustomerRequest = await request.json();

    const customer = await createCustomer({
      userId: body.record.id,
      email: body.record.email,
    });

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return new NextResponse(message, { status: 500 });
  }
}
