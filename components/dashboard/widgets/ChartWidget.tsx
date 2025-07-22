import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { WidgetConfig, FormSubmission, AggregationType, ChartType } from '../../../types';
import { Icon } from '../../ui/Icon';

interface ChartWidgetProps {
  config: WidgetConfig;
  submissions: FormSubmission[];
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const COLORS = ['#006FDC', '#00A4FF', '#4BC8FF', '#8CDFFF', '#00C49F', '#FFBB28', '#FF8042'];

const ChartWidget: React.FC<ChartWidgetProps> = ({ config, submissions, t }) => {
  const chartData = useMemo(() => {
    if (!config.formTemplateId || !config.groupByFieldId || !config.aggregationType) {
      return [];
    }
    
    const relevantSubmissions = submissions.filter(s => s.templateId === config.formTemplateId);
    
    const groupedData = relevantSubmissions.reduce((acc, submission) => {
      const groupKey = submission.data[config.groupByFieldId!] || 'N/A';
      if (!acc[groupKey]) {
        acc[groupKey] = { name: groupKey, value: 0 };
      }

      if (config.aggregationType === AggregationType.COUNT) {
        acc[groupKey].value += 1;
      } else if (config.aggregationType === AggregationType.SUM && config.sumOfFieldId) {
        const valueToSum = parseFloat(submission.data[config.sumOfFieldId]);
        if (!isNaN(valueToSum)) {
          acc[groupKey].value += valueToSum;
        }
      }
      
      return acc;
    }, {} as Record<string, { name: string, value: number }>);
    
    return Object.values(groupedData);

  }, [config, submissions]);
  
  if (chartData.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Icon name="bar-chart-3" className="w-12 h-12 mb-2 text-gray-300" />
            <p className="text-sm">{t('noChartData')}</p>
        </div>
    );
  }

  const renderChart = () => {
    switch(config.chartType) {
        case ChartType.BAR:
            return (
                 <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563', borderRadius: '0.5rem' }} cursor={{ fill: 'rgba(75, 85, 99, 0.2)' }} />
                    <Bar dataKey="value" name={config.title} fill="#006FDC" barSize={30} />
                </BarChart>
            );
        case ChartType.LINE:
            return (
                 <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563', borderRadius: '0.5rem' }} />
                    <Line type="monotone" dataKey="value" name={config.title} stroke="#006FDC" strokeWidth={2} />
                </LineChart>
            );
        case ChartType.PIE:
             return (
                 <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563', borderRadius: '0.5rem' }} />
                    <Legend wrapperStyle={{fontSize: '12px'}}/>
                </PieChart>
            );
        default:
            return null;
    }
  }


  return (
    <div className="w-full h-full">
        <ResponsiveContainer>
           {renderChart()}
        </ResponsiveContainer>
    </div>
  );
};

export default ChartWidget;
