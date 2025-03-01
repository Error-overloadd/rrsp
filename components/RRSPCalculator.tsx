'use client';
import { useState } from 'react';
import Calculation from './Calculation';

const RRSPCalculator = () => {
    const [formData, setFormData] = useState({
        province: '',
        currentIncome: '',
        projectedIncome: '',
        rateOfReturn: '',
        unusedContribution: '',
        projectionYear: '1'
    });

    return (
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-blue-100">
            <Calculation 
                formData={formData} 
                setFormData={setFormData} 
            />
        </div>
    );
};

export default RRSPCalculator;
