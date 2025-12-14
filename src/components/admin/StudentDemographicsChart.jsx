import React from 'react';
import { ResponsiveContainer, Treemap } from 'recharts';
import Card from '../ui/Card';

const COLORS = ['#EC4899', '#10B981', '#3B82F6']; // Pink, Green, Light Blue

const CustomizedContent = (props) => {
    const { depth, x, y, width, height, index, name, value } = props;

    if (width < 40 || height < 20) {
        return (
             <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth === 1 ? COLORS[index % COLORS.length] : 'rgba(0,0,0,0.2)',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1),
                }}
            />
        );
    }

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth === 1 ? COLORS[index % COLORS.length] : 'rgba(0,0,0,0.2)',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1),
                }}
            />
            <text
                x={x + width / 2}
                y={y + height / 2}
                dy="0.35em"
                textAnchor="middle"
                fill="#fff"
                style={{
                    fontSize: depth === 1 ? 14 : 12,
                    fontWeight: 'bold',
                    pointerEvents: 'none',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
                }}
            >
                {name} {depth > 1 ? `(${value})` : ''}
            </text>
        </g>
    );
};


const StudentDemographicsChart = ({ students }) => {
    const processData = () => {
        const dataMap = new Map(); // Seat Allotment -> Semester -> Count

        students.forEach(s => {
            if (!dataMap.has(s.seatAllotment)) {
                dataMap.set(s.seatAllotment, new Map());
            }
            const semesterMap = dataMap.get(s.seatAllotment);

            const semKey = `Sem ${s.semester}`;
            if (!semesterMap.has(semKey)) {
                semesterMap.set(semKey, 0);
            }
            semesterMap.set(semKey, semesterMap.get(semKey) + 1);
        });

        // Convert nested Maps to the structure recharts expects
        return Array.from(dataMap, ([allotmentName, semesterMap]) => ({
            name: allotmentName,
            children: Array.from(semesterMap, ([semesterName, size]) => ({
                name: semesterName,
                size,
            })),
        }));
    };

    const data = processData();

    return (
        <Card>
            <Card.Header><Card.Title>Student Demographics</Card.Title></Card.Header>
            <Card.Content>
                <ResponsiveContainer width="100%" height={250}>
                    <Treemap
                        data={data}
                        dataKey="size"
                        stroke="#fff"
                        fill="#8884d8"
                        content={<CustomizedContent />}
                        aspectRatio={4 / 3}
                    />
                </ResponsiveContainer>
            </Card.Content>
        </Card>
    );
};

export default StudentDemographicsChart;
