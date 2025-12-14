import React from 'react';
import Card from '../ui/Card';
import { maxMarks } from '../../data/mockData';

const PerformanceBar = ({ subject, marks, percentage }) => (
    <div className="flex items-center gap-4">
        <span className="w-1/3 text-sm font-medium text-vidya-gray-700 truncate">{subject}</span>
        <div className="w-2/3 flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div 
                    className="bg-vidya-light-brown h-4 rounded-full" 
                    style={{ 
                        width: `${percentage}%`,
                        boxShadow: '0 0 5px #B45309, 0 0 10px #B45309' 
                    }}
                ></div>
            </div>
            <span className="w-24 text-right font-semibold text-sm">{marks}/{maxMarks.total} ({percentage}%)</span>
        </div>
    </div>
);


const CurrentSemesterPerformance = ({ performance }) => {
    const performanceData = Object.entries(performance).map(([subject, data]) => ({
        subject,
        marks: data.total,
        percentage: Math.round((data.total / maxMarks.total) * 100)
    }));

    return (
        <Card>
            <Card.Header><Card.Title>Current Semester Performance</Card.Title></Card.Header>
            <Card.Content>
                <div className="space-y-4">
                    {performanceData.map(item => (
                        <PerformanceBar key={item.subject} {...item} />
                    ))}
                </div>
            </Card.Content>
        </Card>
    );
};

export default CurrentSemesterPerformance;
