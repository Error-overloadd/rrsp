export interface TaxBracket {
    lower: number;
    higher: number;
    rate: number;
    description?: string;
}

export const TAX_BRACKETS: TaxBracket[] = [
    { lower: 0, higher: 55867, rate: 0.25, description: '25.00%' },
    { lower: 55867, higher: 111733, rate: 0.305, description: '30.50%' },
    { lower: 111733, higher: 148269, rate: 0.36, description: '36.00%' },
    { lower: 148269, higher: 173205, rate: 0.38, description: '38.00%' },
    { lower: 173205, higher: 177922, rate: 0.4132, description: '41.32%' },
    { lower: 177922, higher: 237230, rate: 0.4232, description: '42.32%' },
    { lower: 237230, higher: 246752, rate: 0.4332, description: '43.32%' },
    { lower: 246752, higher: 355845, rate: 0.47, description: '47.00%' },
    { lower: 355845, higher: Infinity, rate: 0.48, description: '48.00%' }
];

export const getTaxBracket = (income: number): TaxBracket => {
    return TAX_BRACKETS.find(bracket => income <= bracket.higher) || TAX_BRACKETS[TAX_BRACKETS.length - 1];
};

export const calculateTaxForIncome = (income: number): number => {
    // 计算总税额
    let totalTax = 0;
    // 剩余需要计算税额的收入
    let remainingIncome = income;
    
    // 遍历每个税级
    for (const bracket of TAX_BRACKETS) {
        // 计算在当前税级中应纳税的收入金额
        // 不能小于0，且不能超过当前税级的范围(higher - lower)
        const taxableInBracket = Math.min(
            Math.max(0, remainingIncome),
            bracket.higher - bracket.lower
        );
        
        // 计算当前税级的税额并累加到总税额中
        totalTax += taxableInBracket * bracket.rate;
        // 减去已计算过的收入
        remainingIncome -= taxableInBracket;
        
        // 如果没有剩余收入需要计算，则退出循环
        if (remainingIncome <= 0) break;
    }
    
    return totalTax;
}; 