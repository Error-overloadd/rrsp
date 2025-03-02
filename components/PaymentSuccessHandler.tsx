'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessHandler() {
    const router = useRouter();

    useEffect(() => {
        // 设置支付状态和过期时间
        const expiryTime = new Date().getTime() + (3 * 60 * 1000);
        localStorage.setItem('isPaid', 'true');
        localStorage.setItem('paidExpiry', expiryTime.toString());
        
        // 短暂延迟后返回主页
        const timer = setTimeout(() => {
            router.push('/');
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

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
                        Thank you for upgrading to premium. Redirecting back to calculator...
                    </p>
                </div>
            </div>
        </div>
    );
} 