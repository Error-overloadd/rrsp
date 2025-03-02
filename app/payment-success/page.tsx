'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// 创建一个客户端组件来处理 search params
function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const amount = searchParams.get('amount');

    useEffect(() => {
        // 设置支付状态和过期时间
        const expiryTime = new Date().getTime() + (3 * 60 * 1000);
        localStorage.setItem('isPaid', 'true');
        localStorage.setItem('paidExpiry', expiryTime.toString());
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-100 max-w-md w-full">
                <div className="text-center">
                    <div className="mb-6">
                        <svg
                            className="mx-auto h-16 w-16 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                        Payment Successful!
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Thank you for your payment of ${amount}. You now have access to premium features for the next 3 minutes.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg text-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Return to Calculator
                    </button>
                </div>
            </div>
        </div>
    );
}

// 主页面组件
export default function PaymentSuccess() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-2xl text-gray-600">Loading...</div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}