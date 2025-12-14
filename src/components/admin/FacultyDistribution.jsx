import React from 'react';
import Card from '../ui/Card';

const FacultyDistribution = ({ faculty }) => {
    const data = faculty.reduce((acc, f) => {
        acc[f.designation] = (acc[f.designation] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(data);

    return (
        <Card>
            <Card.Header><Card.Title>Faculty Distribution</Card.Title></Card.Header>
            <Card.Content>
                <div className="space-y-2">
                    {chartData.map(([name, value]) => (
                        <div key={name} className="flex justify-between items-center text-sm">
                            <span className="font-medium text-vidya-gray-700">{name}</span>
                            <span className="font-bold text-vidya-dark-pink bg-vidya-light-pink px-2 py-0.5 rounded-full">{value}</span>
                        </div>
                    ))}
                </div>
            </Card.Content>
        </Card>
    );
};

export default FacultyDistribution;
