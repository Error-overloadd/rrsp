'use client';
import { useState, useEffect } from 'react';
import { calculateTaxForIncome } from '../data/taxRates';
import Payment from './payment';
import CountdownTimer from './CountdownTimer';
import Result from './Result';

interface CalculationProps {
    formData: {
        province: string;
        currentIncome: string;
        projectedIncome: string;
        rateOfReturn: string;
        unusedContribution: string;
        projectionYear: string;
    };
    setFormData: (data: any) => void;
}

const Calculation = ({ formData, setFormData }: CalculationProps) => {
    const [results, setResults] = useState({
        currentYearTaxWithoutRRSP: 0,
        currentYearTaxWithRRSP: 0,
        currentYearTaxSaving: 0,
        effectiveTaxRate: 0,
        marginalTaxRate: 0,
        preInvestmentIncome: 0,
        projectedYearTaxWithoutRRSP: 0,
        projectedYearTaxWithRRSP: 0,
        projectedYearTaxSaving: 0,
        projectedEffectiveRate: 0,
        afterInvestmentIncome: 0,
    });
    
    const [showResults, setShowResults] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const [showTimer, setShowTimer] = useState(false);


    useEffect(() => {
        const isPaidStatus = localStorage.getItem('isPaid');
        const expiryTime = localStorage.getItem('paidExpiry');
        
        if (isPaidStatus === 'true' && expiryTime) {
            const now = new Date().getTime();
            const timeLeft = parseInt(expiryTime) - now;
            
            if (timeLeft > 0) {
                setIsPaid(true);
                setShowTimer(true);
            } else {
                localStorage.removeItem('isPaid');
                localStorage.removeItem('paidExpiry');
                setIsPaid(false);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'projectionYear') {
            const yearValue = parseInt(value) || 1;
            
            if (isPaid) {
                if (yearValue >= 1 && yearValue <= 99) {
                    setFormData({
                        ...formData,
                        [name]: yearValue.toString()
                    });
                }
                return;
            }
            
            if (yearValue > 1) {
                setShowPayment(true);
                localStorage.setItem('pendingYear', yearValue.toString());
            } else {
                setFormData({
                    ...formData,
                    [name]: yearValue.toString()
                });
            }
            return;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setIsPaid(true);
        setShowTip(false);
        
        // 设置3分钟后过期
        const expiryTime = new Date().getTime() + (3 * 60 * 1000);
        localStorage.setItem('isPaid', 'true');
        localStorage.setItem('paidExpiry', expiryTime.toString());
        
        const pendingYear = localStorage.getItem('pendingYear') || '2';
        setFormData({ ...formData, projectionYear: pendingYear });
        localStorage.removeItem('pendingYear');
        
        setShowTimer(true);
    };

    const handleTimerExpire = () => {
        setIsPaid(false);
        setShowTimer(false);
        localStorage.removeItem('isPaid');
        localStorage.removeItem('paidExpiry');
        setFormData({ ...formData, projectionYear: '1' });
    };

    const handleProjectedYearHover = () => {
        if (!isPaid) {
            setShowTip(true);
        }
    };

    const calculateResults = () => {
        const numericFormData = {
            ...formData,
            currentIncome: parseFloat(formData.currentIncome as string) || 0,
            projectedIncome: parseFloat(formData.projectedIncome as string) || 0,
            rateOfReturn: parseFloat(formData.rateOfReturn as string) || 0,
            unusedContribution: parseFloat(formData.unusedContribution as string) || 0,
        };

        try {
            const { currentIncome, projectedIncome, unusedContribution, rateOfReturn } = numericFormData;

            // 当前年度计算
            const currentYearTaxWithoutRRSP = calculateTaxForIncome(currentIncome);
            const currentYearTaxWithRRSP = calculateTaxForIncome(currentIncome - unusedContribution);
            const currentYearTaxSaving = currentYearTaxWithoutRRSP - currentYearTaxWithRRSP;
            const effectiveTaxRate = (currentYearTaxSaving / unusedContribution) * 100;
            
            // 投资增长
            const preInvestmentIncome = currentYearTaxSaving * (rateOfReturn / 100);
     

            // 下一年度计算
            const projectedYearTaxWithoutRRSP = calculateTaxForIncome(projectedIncome);
            const projectedYearTaxWithRRSP = calculateTaxForIncome(projectedIncome - unusedContribution);
            const projectedYearTaxSaving = projectedYearTaxWithoutRRSP - projectedYearTaxWithRRSP;
            const projectedEffectiveRate = (projectedYearTaxSaving / unusedContribution) * 100;
            console.log(currentYearTaxSaving);
            console.log(rateOfReturn);
            console.log(effectiveTaxRate);
            console.log(Number(numericFormData.projectionYear));
          
            const afterInvestmentIncome = (currentYearTaxSaving * (Math.pow(1 + (rateOfReturn / 100), Number(numericFormData.projectionYear)) - 1)) * (1 - effectiveTaxRate / 100);
            setResults({
                // 当前年度结果
                currentYearTaxWithoutRRSP,
                currentYearTaxWithRRSP,
                currentYearTaxSaving,
                effectiveTaxRate,
                marginalTaxRate: 0,
                preInvestmentIncome,
                afterInvestmentIncome,
                
                // 下一年度结果
                projectedYearTaxWithoutRRSP,
                projectedYearTaxWithRRSP,
                projectedYearTaxSaving,
                projectedEffectiveRate,
            });
            setShowResults(true);
        } catch (error) {
            console.error('Calculation error:', error);
            alert('Error in calculations. Please check your inputs.');
        }
    };

    const handleUnlock = async () => {
        try {
            setShowPayment(true);
            console.log("Sending payment intent request");
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: 299 }),
            });

            console.log("Response status:", response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const data = await response.json();
            console.log("Payment intent created:", data);
            // 处理支付逻辑 - 确保您的 Payment 组件正确使用 clientSecret
        } catch (error) {
            console.error('Error:', error);
            // 修复类型错误 - 添加类型检查
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert("Payment processing error: " + errorMessage);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* 输入表单部分 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Left Column */}
                <div className="bg-white/90 p-6 rounded-lg shadow-md border border-gray-100">
                    {/* Province Selection */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-lg mb-2">
                            Province of Residence
                        </label>
                        <select
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md text-lg text-gray-700 focus:text-gray-700"
                        >
                            <option value="">Select Province</option>
                            <option value="AB">Alberta</option>
                            <option value="BC">British Columbia</option>
                            <option value="ON">Ontario</option>
                        </select>
                    </div>

                    {/* Projected Income with Year Input */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-lg mb-2">
                            <div className="flex items-center gap-2">
                                Projected Year
                                <input
                                    type="number"
                                    name="projectionYear"
                                    value={formData.projectionYear}
                                    onChange={handleChange}
                                    min="1"
                                    max={isPaid ? "99" : "1"}
                                    className="w-16 mx-2 p-1 border rounded-md text-lg text-gray-700 focus:text-gray-700"
                                />
                                Income
                                {!isPaid && (
                                    <div className="relative inline-block">
                                        <span 
                                            className="text-yellow-500 cursor-help ml-1"
                                            onMouseEnter={handleProjectedYearHover}
                                        >
                                            ⚠️
                                        </span>
                                    </div>
                                )}
                            </div>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-600">$</span>
                            <input
                                type="number"
                                name="projectedIncome"
                                value={formData.projectedIncome}
                                onChange={handleChange}
                                className="w-full p-2 pl-8 border rounded-md text-lg text-gray-700 focus:text-gray-700"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Unused RRSP */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-lg mb-2">
                            Unused RRSP Contribution Available
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-600">$</span>
                            <input
                                type="number"
                                name="unusedContribution"
                                value={formData.unusedContribution}
                                onChange={handleChange}
                                className="w-full p-2 pl-8 border rounded-md text-lg text-gray-700 focus:text-gray-700"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="bg-white/90 p-6 rounded-lg shadow-md border border-gray-100">
                    {/* Current Income */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-lg mb-2">
                            Current Year Taxable Income
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-600">$</span>
                            <input
                                type="number"
                                name="currentIncome"
                                value={formData.currentIncome}
                                onChange={handleChange}
                                className="w-full p-2 pl-8 border rounded-md text-lg text-gray-700 focus:text-gray-700"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Rate of Return */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-lg mb-2">
                            Expected Rate of Return
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="rateOfReturn"
                                value={formData.rateOfReturn}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md text-lg text-gray-700 focus:text-gray-700"
                                placeholder="0"
                            />
                            <span className="absolute right-3 top-2 text-gray-600">%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calculate Button */}
            <button
                onClick={calculateResults}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg text-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                Calculate
            </button>

            {/* 提示弹窗 */}
            {showTip && !isPaid && (
                <div 
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-80"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-center text-gray-600">
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setShowTip(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-4">
                            <span className="text-2xl">💡</span>
                        </div>
                        <p className="font-medium text-lg mb-2">Pro Feature</p>
                        <p className="mb-2">Currently you can only calculate for 1 year.</p>
                        <p className="mb-4">Unlock premium to calculate future year projections!</p>
                        <button
                            onClick={handleUnlock}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Unlock Now for $2.99
                        </button>
                    </div>
                </div>
            )}

          

            {/* 添加倒计时器 */}
            {showTimer && <CountdownTimer onExpire={handleTimerExpire} />}

            {/* 使用新的 Result 组件 */}
            {showResults && <Result results={results} projectionYear={formData.projectionYear} />}

            {/* Payment Modal */}
            {showPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
                        <Payment 
                            amount={2.99} 
                            onSuccess={handlePaymentSuccess}
                            onCancel={() => setShowPayment(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calculation; 