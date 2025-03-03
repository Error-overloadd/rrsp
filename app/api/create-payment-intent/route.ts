import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

// 添加更详细的日志
console.log("API Route loaded, checking environment variables...");
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY is not defined in environment variables!");
} else {
  console.log("STRIPE_SECRET_KEY exists with length:", process.env.STRIPE_SECRET_KEY.length);
}

// 使用条件检查确保 API 密钥存在
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
if (!stripeSecretKey) {
  console.error("Missing Stripe Secret Key - API will fail!");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  console.log("Payment intent request received");
  
  // 再次检查 API 密钥
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is missing when handling request");
    return NextResponse.json({ error: 'Server configuration error: Missing API key' }, { status: 500 });
  }
  
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Error creating payment intent', details: errorMessage }, { status: 500 });
  }
}

// 添加 OPTIONS 方法处理 CORS 预检请求
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}