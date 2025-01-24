'use client';
import { useState } from 'react';
import { calculateTaxForIncome, getTaxBracket } from '../data/taxRates';

const RRSPCalculator = () => {
    const [formData, setFormData] = useState({
        province: 'AB',
        currentIncome: 70000,
        projectedIncome: 90000,
        rateOfReturn: 0.05,
        unusedContribution: 15000,
    });

    const [results, setResults] = useState({
        currentYearTaxWithoutRRSP: 0,
        currentYearTaxWithRRSP: 0,
        currentYearTaxSaving: 0,
        effectiveTaxRate: 0,
        additionalInvestmentIncome: 0,
        marginalTaxRate: 0,
        projectedYearTaxWithoutRRSP: 0,
        projectedYearTaxWithRRSP: 0,
        projectedYearTaxSaving: 0,
        projectedEffectiveTaxRate: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'province' ? value : Number(value),
        });
    };

    const calculateResults = () => {
        try {
            const { currentIncome, projectedIncome, unusedContribution, rateOfReturn } = formData;

            // 获取边际税率
            const marginalTaxRate = getTaxBracket(currentIncome).rate;

            // 当前年度计算
            const currentYearTaxWithoutRRSP = calculateTaxForIncome(currentIncome);
            const currentYearTaxWithRRSP = calculateTaxForIncome(currentIncome - unusedContribution);
            const currentYearTaxSaving = currentYearTaxWithoutRRSP - currentYearTaxWithRRSP;
            const effectiveTaxRate = (currentYearTaxSaving / unusedContribution) * 100;
            const additionalInvestmentIncome = currentYearTaxSaving * rateOfReturn;

            // 下一年度计算
            const projectedYearTaxWithoutRRSP = calculateTaxForIncome(projectedIncome);
            const projectedYearTaxWithRRSP = calculateTaxForIncome(projectedIncome - unusedContribution);
            const projectedYearTaxSaving = projectedYearTaxWithoutRRSP - projectedYearTaxWithRRSP;
            const projectedEffectiveTaxRate = (projectedYearTaxSaving / unusedContribution) * 100;

            setResults({
                currentYearTaxWithoutRRSP,
                currentYearTaxWithRRSP,
                currentYearTaxSaving,
                effectiveTaxRate,
                additionalInvestmentIncome,
                marginalTaxRate,
                projectedYearTaxWithoutRRSP,
                projectedYearTaxWithRRSP,
                projectedYearTaxSaving,
                projectedEffectiveTaxRate,
            });

        } catch (error) {
            console.error('Calculation error:', error);
            alert('Error in calculations. Please check your inputs.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            {/* Input Section */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Questions</h2>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Province */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block">
                                <span className="text-gray-700 font-medium mb-2 block">
                                    Province of Residence
                                </span>
                                <select
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                >
                                    <option value="AB">Alberta</option>
                                    <option value="BC">British Columbia</option>
                                    <option value="ON">Ontario</option>
                                    {/* Add other provinces as needed */}
                                </select>
                            </label>
                        </div>

                        {/* Current Income */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block">
                                <span className="text-gray-700 font-medium mb-2 block">
                                    Current Year Taxable Income
                                </span>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="currentIncome"
                                        value={formData.currentIncome}
                                        onChange={handleChange}
                                        className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                        placeholder="0.00"
                                    />
                                </div>
                            </label>
                        </div>

                        {/* Projected Income */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block">
                                <span className="text-gray-700 font-medium mb-2 block">
                                    Projected Year 1 Income
                                </span>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="projectedIncome"
                                        value={formData.projectedIncome}
                                        onChange={handleChange}
                                        className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                        placeholder="0.00"
                                    />
                                </div>
                            </label>
                        </div>

                        {/* Rate of Return */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <label className="block">
                                <span className="text-gray-700 font-medium mb-2 block">
                                    Expected Rate of Return
                                </span>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        type="number"
                                        name="rateOfReturn"
                                        value={formData.rateOfReturn}
                                        onChange={handleChange}
                                        className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                        placeholder="0.05"
                                        step="0.01"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">%</span>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Unused Contribution */}
                        <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                            <label className="block">
                                <span className="text-gray-700 font-medium mb-2 block">
                                    Unused RRSP Contribution Available
                                </span>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="unusedContribution"
                                        value={formData.unusedContribution}
                                        onChange={handleChange}
                                        className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                        placeholder="0.00"
                                    />
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Calculate Button */}
                    <div className="mt-6">
                        <button
                            onClick={calculateResults}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700"
                        >
                            Calculate
                        </button>
                    </div>
                </div>
            </section>

            {/* Calculation Results Section */}
            <section className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Calculation</h2>
                <div className="grid grid-cols-2 gap-6">
                    {/* Current Year Calculations */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Year Analysis</h3>
                        <div className="space-y-4">
                            {/* Tax Without RRSP */}
                            <div className="bg-gray-50 rounded-md p-3">
                                <p className="text-sm text-gray-600 mb-1">Tax Without RRSP</p>
                                <p className="text-xl font-bold text-gray-900">
                                    ${results.currentYearTaxWithoutRRSP.toFixed(2)}
                                </p>
                            </div>

                            {/* Tax With RRSP */}
                            <div className="bg-gray-50 rounded-md p-3">
                                <p className="text-sm text-gray-600 mb-1">Tax With RRSP</p>
                                <p className="text-xl font-bold text-gray-900">
                                    ${results.currentYearTaxWithRRSP.toFixed(2)}
                                </p>
                            </div>

                            {/* Tax Savings */}
                            <div className="bg-green-50 rounded-md p-3">
                                <p className="text-sm text-green-600 mb-1">Tax Savings</p>
                                <p className="text-xl font-bold text-green-700">
                                    ${results.currentYearTaxSaving.toFixed(2)}
                                </p>
                            </div>

                            {/* Effective Tax Rate */}
                            <div className="bg-blue-50 rounded-md p-3">
                                <p className="text-sm text-blue-600 mb-1">Effective Tax Rate</p>
                                <p className="text-xl font-bold text-blue-700">
                                    {results.effectiveTaxRate.toFixed(2)}%
                                </p>
                            </div>

                            {/* Investment Income */}
                            <div className="bg-purple-50 rounded-md p-3">
                                <p className="text-sm text-purple-600 mb-1">Investment Growth</p>
                                <p className="text-xl font-bold text-purple-700">
                                    ${results.additionalInvestmentIncome.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Projected Year Calculations */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Year Projection</h3>
                        <div className="space-y-4">
                            {/* Projected Tax Without RRSP */}
                            <div className="bg-gray-50 rounded-md p-3">
                                <p className="text-sm text-gray-600 mb-1">Projected Tax Without RRSP</p>
                                <p className="text-xl font-bold text-gray-900">
                                    ${results.projectedYearTaxWithoutRRSP.toFixed(2)}
                                </p>
                            </div>

                            {/* Projected Tax With RRSP */}
                            <div className="bg-gray-50 rounded-md p-3">
                                <p className="text-sm text-gray-600 mb-1">Projected Tax With RRSP</p>
                                <p className="text-xl font-bold text-gray-900">
                                    ${results.projectedYearTaxWithRRSP.toFixed(2)}
                                </p>
                            </div>

                            {/* Projected Tax Savings */}
                            <div className="bg-green-50 rounded-md p-3">
                                <p className="text-sm text-green-600 mb-1">Projected Tax Savings</p>
                                <p className="text-xl font-bold text-green-700">
                                    ${results.projectedYearTaxSaving.toFixed(2)}
                                </p>
                            </div>

                            {/* Projected Effective Rate */}
                            <div className="bg-blue-50 rounded-md p-3">
                                <p className="text-sm text-blue-600 mb-1">Projected Effective Rate</p>
                                <p className="text-xl font-bold text-blue-700">
                                    {results.projectedEffectiveTaxRate.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Output Section */}
            <section className="mt-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Summary</h2>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                    {/* Current Year Benefits */}
                    <div className="bg-blue-50 rounded-md p-4">
                        <h3 className="text-blue-800 font-semibold mb-2">Current Year Benefits</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-blue-600">Tax Savings</p>
                                <p className="text-2xl font-bold text-blue-700">
                                    ${results.currentYearTaxSaving.toFixed(2)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-blue-600">Investment Growth</p>
                                <p className="text-2xl font-bold text-blue-700">
                                    ${results.additionalInvestmentIncome.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Next Year Projection */}
                    <div className="bg-green-50 rounded-md p-4">
                        <h3 className="text-green-800 font-semibold mb-2">Next Year Projection</h3>
                        <div className="space-y-2">
                            <p className="text-green-600">Potential Tax Savings</p>
                            <p className="text-2xl font-bold text-green-700">
                                ${results.projectedYearTaxSaving.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RRSPCalculator;
