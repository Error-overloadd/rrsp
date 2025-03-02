"use client";

import CheckoutPage from "./CheckoutPage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

interface PaymentProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const Payment = ({ amount, onSuccess, onCancel }: PaymentProps) => {
  const amountInCents = Math.round(amount * 100);
  
  const handlePayment = async () => {
    try {
      // ... 支付处理逻辑保持不变

      // 支付成功后直接跳转到成功页面
      window.location.href = '/payment-success';
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onCancel}
        className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: amountInCents,
          currency: "cad",
        }}
      >
        <CheckoutPage amount={amount} amountInCents={amountInCents}  />
      </Elements>
    </div>
  );
};

export default Payment;