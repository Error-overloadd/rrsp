'use client';
import React from 'react';
import { 
  ResponsiveContainer, 
  Treemap, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface ResultProps {
  results: {
    currentYearTaxWithoutRRSP: number;
    currentYearTaxWithRRSP: number;
    currentYearTaxSaving: number;
    effectiveTaxRate: number;
    marginalTaxRate: number;
    preInvestmentIncome: number;
    projectedYearTaxWithoutRRSP: number;
    projectedYearTaxWithRRSP: number;
    projectedYearTaxSaving: number;
    projectedEffectiveRate: number;
    afterInvestmentIncome: number;
  };
  projectionYear: string;
}

const Result: React.FC<ResultProps> = ({ results, projectionYear }) => {
  // 为树状图准备数据
  const treeMapData = [
    {
      name: 'RRSP Benefits',
      children: [
        {
          name: 'Tax Savings',
          size: results.currentYearTaxSaving,
          value: results.currentYearTaxSaving,
          color: '#3b82f6'
        },
        {
          name: 'Investment Income',
          size: results.preInvestmentIncome,
          value: results.preInvestmentIncome,
          color: '#8b5cf6'
        },
        {
          name: 'After-tax Growth',
          size: results.afterInvestmentIncome,
          value: results.afterInvestmentIncome,
          color: '#10b981'
        }
      ]
    }
  ];

  // 为柱状图准备数据
  const barChartData = [
    {
      name: 'Current Year',
      'Tax Without RRSP': results.currentYearTaxWithoutRRSP,
      'Tax With RRSP': results.currentYearTaxWithRRSP,
      'Tax Savings': results.currentYearTaxSaving
    },
    {
      name: `Year ${projectionYear}`,
      'Tax Without RRSP': results.projectedYearTaxWithoutRRSP,
      'Tax With RRSP': results.projectedYearTaxWithRRSP,
      'Tax Savings': results.projectedYearTaxSaving
    }
  ];

  // 自定义树状图的颜色
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  // 自定义树状图的工具提示
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-blue-600">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* 左侧：当前年度分析 */}
        <div className="bg-white/90 p-6 rounded-lg shadow-lg border border-blue-50">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Current Year Analysis</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-black">Tax Without RRSP</p>
              <p className="text-2xl text-black font-bold">${results.currentYearTaxWithoutRRSP.toFixed(2)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <p className="text-black">Tax With RRSP</p>
              <p className="text-2xl text-black font-bold">${results.currentYearTaxWithRRSP.toFixed(2)}</p>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <p className="text-green-600">Tax Savings</p>
              <p className="text-2xl font-bold text-green-600">${results.currentYearTaxSaving.toFixed(2)}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <p className="text-blue-600">Effective Tax Rate</p>
              <p className="text-2xl font-bold text-blue-600">{results.effectiveTaxRate.toFixed(2)}%</p>
            </div>

            <div className="bg-purple-50 p-4 rounded">
              <p className="text-purple-600">Pre-tax Investment Income</p>
              <p className="text-2xl font-bold text-purple-600">${results.preInvestmentIncome.toFixed(2)}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded">
              <p className="text-purple-600">After-tax Investment Income</p>
              <p className="text-2xl font-bold text-purple-600">${results.afterInvestmentIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* 右侧：未来预测 */}
        <div className="bg-white/90 p-6 rounded-lg shadow-lg border border-blue-50">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Next {Number(projectionYear)} Year Projection</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">Projected Tax Without RRSP</p>
              <p className="text-2xl text-black font-bold">${results.projectedYearTaxWithoutRRSP.toFixed(2)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-600">Projected Tax With RRSP</p>
              <p className="text-2xl text-black font-bold">${results.projectedYearTaxWithRRSP.toFixed(2)}</p>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <p className="text-green-600">Projected Tax Savings</p>
              <p className="text-2xl font-bold text-green-600">${results.projectedYearTaxSaving.toFixed(2)}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <p className="text-blue-600">Projected Effective Rate</p>
              <p className="text-2xl font-bold text-blue-600">{results.projectedEffectiveRate.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section with Charts */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Summary</h2>
        
        {/* Tree Map Chart */}
        <div className="mb-8">
          <h3 className="text-xl text-blue-800 font-semibold mb-4">RRSP Benefits Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treeMapData[0].children}
                dataKey="size"
                stroke="#fff"
                fill="#8884d8"
                content={<CustomizedContent colors={COLORS} />}
              >
                <Tooltip content={<CustomTooltip />} />
              </Treemap>
            </ResponsiveContainer>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            By claiming RRSP deduction in the current year, you will save ${results.currentYearTaxSaving.toFixed(2)} of taxes this year. 
            You are also projected to earn an additional ${results.preInvestmentIncome.toFixed(2)} pre-tax investment income from tax saving.
          </p>
        </div>
        
        {/* Bar Chart */}
        <div>
          <h3 className="text-xl text-blue-800 font-semibold mb-4">Tax Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="Tax Without RRSP" fill="#ef4444" />
                <Bar dataKey="Tax With RRSP" fill="#3b82f6" />
                <Bar dataKey="Tax Savings" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

// 自定义树状图内容组件
const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, colors, name, value } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[Math.floor((index / root.children.length) * colors.length)] : colors[index % colors.length],
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 && width > 50 && height > 30 ? (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 7}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            fontWeight="bold"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 14}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
          >
            ${value.toFixed(2)}
          </text>
        </>
      ) : null}
    </g>
  );
};

export default Result; 