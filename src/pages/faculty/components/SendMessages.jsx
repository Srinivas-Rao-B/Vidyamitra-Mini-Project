import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { CheckCircle } from 'lucide-react';
import { subjects as allSubjects } from '../../../data/mockData';

const messageTemplates = {
    weak_subject: "Your performance in the recent assessments needs improvement. Please schedule a meeting to discuss.",
    attendance: "Your attendance is currently below the required 75%. Please ensure you attend all future classes.",
    deadline: "Reminder: The upcoming assignment is due this Friday. Please submit it on time.",
    quiz: "There will be a surprise quiz in the next class covering the topics from last week."
};

const SendMessages = ({ students, senderName, subject }) => {
    const isProctor = !subject;
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [message, setMessage] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [templateInput, setTemplateInput] = useState({ key: null, type: null, value: '' });

    const handleSelectStudent = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
        );
    };

    useEffect(() => {
        setSelectAll(students.length > 0 && selectedStudents.length === students.length);
    }, [selectedStudents, students.length]);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(s => s.id));
        }
        setSelectAll(!selectAll);
    };

    const handleTemplateSelect = (templateKey) => {
        setMessage(messageTemplates[templateKey]);
        setSelectedStudents([]);
        setTemplateInput({ key: null, type: null, value: '' }); // Reset on new template click

        if (isProctor) {
            if (templateKey === 'weak_subject' || templateKey === 'attendance') {
                setTemplateInput({ key: templateKey, type: 'subject', value: '' });
            }
        } else { // Faculty
            if (templateKey === 'deadline' || templateKey === 'quiz') {
                setTemplateInput({ key: templateKey, type: 'date', value: '' });
            } else if (templateKey === 'weak_subject') {
                const autoSelected = students.filter(s => (s.performance[subject]?.total / 70 * 100) < 70).map(s => s.id);
                setSelectedStudents(autoSelected);
            } else if (templateKey === 'attendance') {
                const autoSelected = students.filter(s => (s.performance[subject]?.attendance.present / s.performance[subject]?.attendance.total * 100) < 75).map(s => s.id);
                setSelectedStudents(autoSelected);
            }
        }
    };

    useEffect(() => {
        if (!templateInput.key || !templateInput.value) return;

        if (templateInput.type === 'date') {
            const formattedDate = new Date(templateInput.value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
            if (templateInput.key === 'deadline') {
                setMessage(`Reminder: The upcoming assignment is due on ${formattedDate}. Please submit it on time.`);
            } else if (templateInput.key === 'quiz') {
                setMessage(`There will be a quiz on ${formattedDate} covering the topics from last week.`);
            }
        }

        if (templateInput.type === 'subject') {
            const selectedSub = templateInput.value;
            let autoSelected = [];
            if (templateInput.key === 'weak_subject') {
                autoSelected = students.filter(s => (s.performance[selectedSub]?.total / 70 * 100) < 70).map(s => s.id);
            } else if (templateInput.key === 'attendance') {
                autoSelected = students.filter(s => (s.performance[selectedSub]?.attendance.present / s.performance[selectedSub]?.attendance.total * 100) < 75).map(s => s.id);
            }
            setSelectedStudents(autoSelected);
        }
    }, [templateInput.value, templateInput.key, templateInput.type, students]);


    const handleSend = () => {
        if (selectedStudents.length === 0 || message.trim() === '') {
            alert('Please select at least one student and write a message.');
            return;
        }
        console.log({
            sender: senderName,
            subject: subject || templateInput.value,
            recipients: selectedStudents,
            message: message
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        setSelectedStudents([]);
        setMessage('');
        setSelectAll(false);
        setTemplateInput({ key: null, type: null, value: '' });
    };

    const facultyTemplates = {
        weak_subject: "Weak Subject",
        attendance: "Attendance Alert",
        deadline: "Deadline Reminder",
        quiz: "Quiz Alert"
    };
    const proctorTemplates = {
        weak_subject: "Weak Subject",
        attendance: "Attendance Alert",
    };
    const templatesToShow = isProctor ? proctorTemplates : facultyTemplates;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
                <Card.Header><Card.Title>Compose Message</Card.Title></Card.Header>
                <Card.Content>
                    {showSuccess && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
                            <CheckCircle className="h-5 w-5" />
                            <span className="block sm:inline">Message sent to {selectedStudents.length} student(s)!</span>
                        </div>
                    )}
                    <div className="mb-4">
                        <p className="font-medium mb-2">Use a template:</p>
                        <div className="flex flex-wrap gap-2 items-center">
                            {Object.entries(templatesToShow).map(([key, label]) => (
                                <Button key={key} variant="outline" size="sm" onClick={() => handleTemplateSelect(key)}>
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {templateInput.type && (
                        <div className="my-4 p-3 bg-vidya-light-pink/50 rounded-lg">
                            {templateInput.type === 'date' && (
                                <div>
                                    <label className="font-medium text-sm">Select Date:</label>
                                    <Input type="date" className="mt-1 w-full sm:w-auto" value={templateInput.value} onChange={e => setTemplateInput({ ...templateInput, value: e.target.value })} />
                                </div>
                            )}
                            {templateInput.type === 'subject' && (
                                <div>
                                    <label className="font-medium text-sm">Select Subject:</label>
                                    <select className="mt-1 w-full p-2 border rounded bg-white" value={templateInput.value} onChange={e => setTemplateInput({ ...templateInput, value: e.target.value })}>
                                        <option value="" disabled>-- Choose a subject --</option>
                                        {allSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    <textarea
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            setTemplateInput({ key: null, type: null, value: '' }); // Clear template on custom typing
                        }}
                        rows="6"
                        className="w-full p-2 border rounded-md"
                        placeholder="Or write a custom message here..."
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                        <Button onClick={handleSend}>Send Message</Button>
                    </div>
                </Card.Content>
            </Card>
            <Card>
                <Card.Header>
                    <div className="flex justify-between items-center">
                        <Card.Title>Select Students</Card.Title>
                        <div className="flex items-center">
                            <input type="checkbox" id="selectAll" checked={selectAll} onChange={handleSelectAll} className="h-4 w-4 rounded mr-2" />
                            <label htmlFor="selectAll" className="text-sm">Select All</label>
                        </div>
                    </div>
                </Card.Header>
                <Card.Content className="max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                        {students.map(student => (
                            <div key={student.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`student-${student.id}`}
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => handleSelectStudent(student.id)}
                                    className="h-4 w-4 rounded"
                                />
                                <label htmlFor={`student-${student.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {student.name} <span className="text-gray-500">({student.usn})</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </Card.Content>
            </Card>
        </div>
    );
};

export default SendMessages;
