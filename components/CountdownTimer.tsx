'use client';
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    onExpire: () => void;
}

const CountdownTimer = ({ onExpire }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState(180); // 3分钟 = 180秒

    useEffect(() => {
        if (!timeLeft) {
            onExpire();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onExpire]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 rounded-lg shadow-lg z-40 pointer-events-none border border-blue-200">
            <div className="text-center">
                <p className="text-white text-xs font-medium opacity-90">
                    Premium Access
                </p>
                <p className="text-xl font-bold text-white">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </p>
            </div>
        </div>
    );
};

export default CountdownTimer; 