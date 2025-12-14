import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import Card from '../ui/Card';

const SemesterProgressChart = ({ students }) => {
    const [selectedSem, setSelectedSem] = useState('All');
    const semesters = [...new Set(students.map(s => s.semester))].sort();

    const processData = () => {
        const sections = ['A', 'B', 'C'];
        if (selectedSem === 'All') {
            return sections.map(sec => {
                const data = { section: `Section ${sec}` };
                semesters.forEach(sem => {
                    const filteredStudents = students.filter(s => s.semester === sem && s.section === sec);
                    const passed = filteredStudents.filter(s => s.passed).length;
                    data[`sem${sem}`] = passed;
                });
                return data;
            });
        } else {
            return sections.map(sec => {
                const filteredStudents = students.filter(s => s.semester == selectedSem && s.section === sec);
                const passed = filteredStudents.filter(s => s.passed).length;
                return { section: `Section ${sec}`, passed };
            });
        }
    };

    const data = processData();
    const COLORS = ['#EC4899', '#3B82F6', '#10B981']; // Pink, Blue, Green

    return (
        <Card>
            <Card.Header>
                <div className="flex justify-between items-center">
                    <Card.Title>Passed Students by Section</Card.Title>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedSem('All')} className={`text-sm p-2 rounded ${selectedSem === 'All' ? 'bg-vidya-pink text-white' : ''}`}>All Semesters</button>
                        {semesters.map(sem => (
                            <button key={sem} onClick={() => setSelectedSem(sem)} className={`text-sm p-2 rounded ${selectedSem == sem ? 'bg-vidya-pink text-white' : ''}`}>Semester {sem}</button>
                        ))}
                    </div>
                </div>
            </Card.Header>
            <Card.Content>
                <ResponsiveContainer width="100%" height={250}>
                    {selectedSem === 'All' ? (
                        <BarChart data={data} layout="horizontal">
                            <XAxis dataKey="section" type="category" />
                            <YAxis type="number" />
                            <Tooltip />
                            <Legend />
                            {semesters.map((sem, i) => (
                                <Bar key={sem} dataKey={`sem${sem}`} stackId="a" fill={COLORS[i % COLORS.length]} name={`Sem ${sem} Passed`} />
                            ))}
                        </BarChart>
                    ) : (
                        <BarChart data={data}>
                            <XAxis dataKey="section" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="passed" name="Students Passed">
                                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </Card.Content>
        </Card>
    );
};

export default SemesterProgressChart;
