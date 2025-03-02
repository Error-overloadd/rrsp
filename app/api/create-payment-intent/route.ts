import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

// 添加日志以检查环境变量是否存在
console.log("API Route loaded, STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  console.log("Payment intent request received");
  try {
    const body = await request.json();
    console.log("Request body:", body);
    const { amount } = body;

    console.log("Creating payment intent for amount:", amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'cad',
      automatic_payment_methods: { enabled: true },
    });

    console.log("Payment intent created successfully");
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'Error creating payment intent', details: error.message }, { status: 500 });
  }
}