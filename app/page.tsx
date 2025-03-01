'use client';
import RRSPCalculator from '../components/RRSPCalculator';

export default function Home() {
  const amount = 2.99;
  const amountInCents = Math.round(amount * 100);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <RRSPCalculator />
    </main>
  );
}
