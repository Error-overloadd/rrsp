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
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <h1 className="text-2xl font-semibold text-green-600 mb-4">
                    Payment Successful!
                </h1>
                <p className="text-gray-600">
                    Thank you for upgrading to Pro version.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Return to Calculator
                </button>
            </div>
        </div>
    );
}

// 主页面组件
export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}