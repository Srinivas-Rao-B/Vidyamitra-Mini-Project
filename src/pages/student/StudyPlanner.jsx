import React, { useState, useMemo } from 'react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus, Calendar, BookOpen, BrainCircuit, Sparkles, X, Brain } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { updatePlan } from '../../services/plannerService';
import Input from '../../components/ui/Input';

const StudyPlanner = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [showManualModal, setShowManualModal] = useState(false);
    const [showAIModal, setShowAIModal] = useState(false);
    const [showNewPlanModal, setShowNewPlanModal] = useState(false);
    const [newPlan, setNewPlan] = useState({ subject: '', date: '', time: '', duration: '' });
    const [activeTab, setActiveTab] = useState('today');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // New AI Plan Form State
    const [aiSubjects, setAiSubjects] = useState([
        { id: Date.now(), subject: '', credits: '', mappedSubject: 'NA', marks: '' }
    ]);

    // Manual Plan Functions
    const handleAddManualPlan = () => {
        if (!newPlan.subject || !newPlan.date || !newPlan.duration) {
            alert('Please fill all required fields');
            return;
        }
        const planToAdd = { 
            ...newPlan, 
            id: Date.now(), 
            completed: false, 
            type: 'manual' 
        };
        const updatedPlans = updatePlan([...plans, planToAdd]);
        setPlans(updatedPlans);
        setShowManualModal(false);
        setNewPlan({ subject: '', date: '', time: '', duration: '' });
    };
    
    const toggleComplete = (id) => {
        const updatedPlans = plans.map(p => p.id === id ? {...p, completed: !p.completed} : p);
        setPlans(updatePlan(updatedPlans));
    };

    // ML Analysis Function
    const handleMLAnalysis = async () => {
        setIsGenerating(true);
        setShowAIModal(false);

        // Prepare data from user's performance
        const performanceData = {
            subjects: [
                {
                    name: "Calculus & Linear Algebra",
                    score: 83,
                    classAvg: 76.1,
                    maxScore: 90
                },
                {
                    name: "Engineering Physics",
                    score: 83,
                    classAvg: 72.9,
                    maxScore: 90
                },
                {
                    name: "Basic Electrical Engineering",
                    score: 89,
                    classAvg: 73.4,
                    maxScore: 93
                },
                {
                    name: "Elements of Civil Engineering",
                    score: 91,
                    classAvg: 74.9,
                    maxScore: 91
                },
                {
                    name: "Engineering Graphics",
                    score: 91,
                    classAvg: 80.6,
                    maxScore: 94
                }
            ]
        };

        try {
            const response = await fetch('http://localhost:5000/api/ml-study-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(performanceData)
            });

            const data = await response.json();

            if (data.error) {
                alert('Error generating ML plan: ' + data.error);
                setIsGenerating(false);
                return;
            }

            if (data.plan && Array.isArray(data.plan)) {
                const newPlans = data.plan.map(p => ({
                    id: Date.now() + Math.random(),
                    subject: p.subject,
                    date: p.date,
                    time: p.time || '09:00',
                    duration: p.duration,
                    completed: false,
                    type: 'ai',
                    task: p.task || 'Study session'
                }));

                const updatedPlans = updatePlan([...plans, ...newPlans]);
                setPlans(updatedPlans);
                alert('ML-based Study Plan generated successfully!');
            } else {
                alert('Invalid response format from AI');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate ML plan. Please check if the server is running.');
        } finally {
            setIsGenerating(false);
        }
    };

    // New AI Plan Functions
    const handleAddSubject = () => {
        setAiSubjects([...aiSubjects, { 
            id: Date.now(), 
            subject: '', 
            credits: '', 
            mappedSubject: 'NA', 
            marks: '' 
        }]);
    };

    const handleRemoveSubject = (id) => {
        if (aiSubjects.length > 1) {
            setAiSubjects(aiSubjects.filter(s => s.id !== id));
        }
    };

    const handleSubjectChange = (id, field, value) => {
        setAiSubjects(aiSubjects.map(s => 
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    const handleGenerateNewAIPlan = async () => {
        const isValid = aiSubjects.every(s => 
            s.subject.trim() !== '' && 
            s.credits !== ''
        );

        if (!isValid) {
            alert('Please fill Subject Name and Credits for each subject');
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch('http://localhost:5000/api/new-ai-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subjects: aiSubjects })
            });

            const data = await response.json();

            if (data.error) {
                alert('Error generating plan: ' + data.error);
                setIsGenerating(false);
                return;
            }

            if (data.plan && Array.isArray(data.plan)) {
                const newPlans = data.plan.map(p => ({
                    id: Date.now() + Math.random(),
                    subject: p.subject,
                    date: p.date,
                    time: p.time || '09:00',
                    duration: p.duration,
                    completed: false,
                    type: 'ai',
                    task: p.task || 'Study session'
                }));

                const updatedPlans = updatePlan([...newPlans]);
                setPlans(updatedPlans);
                setShowNewPlanModal(false);
                setAiSubjects([{ id: Date.now(), subject: '', credits: '', mappedSubject: 'NA', marks: '' }]);
                alert('New AI Study Plan generated successfully!');
            } else {
                alert('Invalid response format from AI');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate AI plan. Please check if the server is running.');
        } finally {
            setIsGenerating(false);
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const filteredPlans = useMemo(() => {
        if (activeTab === 'today') return plans.filter(p => p.date === todayStr);
        if (activeTab === 'tomorrow') return plans.filter(p => p.date === tomorrowStr);
        if (activeTab === 'upcoming') return plans.filter(p => p.date > tomorrowStr);
        return [];
    }, [activeTab, plans, todayStr, tomorrowStr]);

    return (
        <div className="min-h-screen bg-vidya-light-pink">
            <Header />
            <main className="container mx-auto p-8">
                <Link to="/student/dashboard" className="inline-flex items-center text-vidya-pink mb-4 hover:underline">
                    <ChevronLeft className="h-4 w-4 mr-1" />Back to Dashboard
                </Link>
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-vidya-gray-900">Study Planner</h1>
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => setShowAIModal(true)} 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Sparkles className="h-4 w-4 mr-2" /> AI Study Plan
                        </Button>
                        <Button 
                            onClick={() => setShowManualModal(true)} 
                            className="bg-vidya-pink hover:bg-vidya-pink/90"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Manual Plan
                        </Button>
                    </div>
                </div>

                <Card className="shadow-lg">
                    <Card.Header>
                        <div className="flex justify-between items-center">
                            <Card.Title>My Study Schedule</Card.Title>
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    <button 
                                        onClick={() => setActiveTab('today')} 
                                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'today' 
                                                ? 'border-vidya-pink text-vidya-pink' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Today
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('tomorrow')} 
                                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'tomorrow' 
                                                ? 'border-vidya-pink text-vidya-pink' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Tomorrow
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('upcoming')} 
                                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'upcoming' 
                                                ? 'border-vidya-pink text-vidya-pink' 
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        Upcoming
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Content>
                        {filteredPlans.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No Plans for {activeTab}</h3>
                                <p className="mt-1 text-sm text-gray-500">Click "AI Study Plan" or "Manual Plan" to get started!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredPlans.sort((a,b) => (a.time || '00:00').localeCompare(b.time || '00:00')).map(plan => (
                                    <div key={plan.id} className={`p-4 rounded-lg flex items-center gap-4 transition-all ${
                                        plan.completed ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200 hover:shadow-md'
                                    }`}>
                                        <input 
                                            type="checkbox" 
                                            checked={plan.completed} 
                                            onChange={() => toggleComplete(plan.id)} 
                                            className="h-5 w-5 rounded text-vidya-pink focus:ring-vidya-pink cursor-pointer"
                                        />
                                        <div className={`p-3 bg-gradient-to-br rounded-lg ${
                                            plan.type === 'ai' 
                                                ? 'from-blue-500 to-blue-600 text-white' 
                                                : 'from-pink-500 to-pink-600 text-white'
                                        }`}>
                                            {plan.type === 'ai' ? <BrainCircuit className="h-6 w-6"/> : <BookOpen className="h-6 w-6"/>}
                                        </div>
                                        <div className="flex-grow">
                                            <p className={`font-bold text-lg ${plan.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                {plan.subject}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {plan.time ? `${plan.time} - ` : ''} {plan.duration}
                                                {plan.isOverdue && <span className="ml-2 text-red-600 font-bold">(Overdue)</span>}
                                            </p>
                                            {plan.task && <p className="text-xs text-gray-500 mt-1">{plan.task}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card.Content>
                </Card>

                {/* AI Plan Choice Modal */}
                {showAIModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-md">
                            <Card.Header>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-6 w-6 text-vidya-pink" />
                                        <Card.Title>AI Study Plan Options</Card.Title>
                                    </div>
                                    <button onClick={() => setShowAIModal(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Choose how you want to generate your study plan
                                </p>
                            </Card.Header>
                            <Card.Content className="space-y-4">
                                <button
                                    onClick={handleMLAnalysis}
                                    disabled={isGenerating}
                                    className="w-full p-6 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <Brain className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-lg text-gray-800">Run ML Analysis</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Generate plan based on your current performance, class averages, and max scores
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setShowAIModal(false);
                                        setShowNewPlanModal(true);
                                    }}
                                    disabled={isGenerating}
                                    className="w-full p-6 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-purple-100 rounded-lg">
                                            <Sparkles className="h-8 w-8 text-purple-600" />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-bold text-lg text-gray-800">New AI Plan</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Create custom plan by entering subjects with credits and previous marks
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </Card.Content>
                        </Card>
                    </div>
                )}

                {/* Loading Modal */}
                {isGenerating && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="w-full max-w-sm">
                            <Card.Content className="text-center py-8">
                                <div className="animate-spin h-12 w-12 border-4 border-vidya-pink border-t-transparent rounded-full mx-auto"></div>
                                <p className="mt-4 text-lg font-semibold">Generating AI Study Plan...</p>
                                <p className="text-sm text-gray-600 mt-2">Please wait while we analyze your data</p>
                            </Card.Content>
                        </Card>
                    </div>
                )}

                {/* New AI Plan Modal */}
                {showNewPlanModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <Card className="w-full max-w-4xl my-8">
                            <Card.Header>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-6 w-6 text-vidya-pink" />
                                        <Card.Title>Create New AI Study Plan</Card.Title>
                                    </div>
                                    <button onClick={() => setShowNewPlanModal(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Add subjects with credits and previous performance. AI will optimize your study schedule (max 2 hours/day).
                                </p>
                            </Card.Header>
                            <Card.Content className="space-y-4 max-h-[60vh] overflow-y-auto">
                                {aiSubjects.map((subject, index) => (
                                    <div key={subject.id} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-semibold text-gray-800">Subject {index + 1}</h4>
                                            {aiSubjects.length > 1 && (
                                                <button 
                                                    onClick={() => handleRemoveSubject(subject.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-700 block mb-1">
                                                    Subject Name *
                                                </label>
                                                <Input 
                                                    type="text" 
                                                    placeholder="e.g., Machine Learning"
                                                    value={subject.subject}
                                                    onChange={e => handleSubjectChange(subject.id, 'subject', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-700 block mb-1">
                                                    Credits *
                                                </label>
                                                <select 
                                                    value={subject.credits}
                                                    onChange={e => handleSubjectChange(subject.id, 'credits', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-700 block mb-1">
                                                    Mapped Subject
                                                </label>
                                                <Input 
                                                    type="text" 
                                                    placeholder="NA or related subject"
                                                    value={subject.mappedSubject}
                                                    onChange={e => handleSubjectChange(subject.id, 'mappedSubject', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-700 block mb-1">
                                                    Previous Marks (/100)
                                                </label>
                                                <Input 
                                                    type="number" 
                                                    placeholder="e.g., 85"
                                                    min="0"
                                                    max="100"
                                                    value={subject.marks}
                                                    onChange={e => handleSubjectChange(subject.id, 'marks', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <Button 
                                    variant="ghost" 
                                    onClick={handleAddSubject}
                                    className="w-full border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50"
                                >
                                    <Plus className="h-5 w-5 mr-2" /> Add Another Subject
                                </Button>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <Button 
                                        variant="ghost" 
                                        onClick={() => setShowNewPlanModal(false)}
                                        disabled={isGenerating}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleGenerateNewAIPlan}
                                        disabled={isGenerating}
                                        className="bg-pink-600 hover:bg-vidya-pink/90"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Generate Plan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}

                {/* Manual Plan Modal */}
                {showManualModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="w-full max-w-md">
                            <Card.Header>
                                <div className="flex justify-between items-center">
                                    <Card.Title>Add Manual Study Plan</Card.Title>
                                    <button onClick={() => setShowManualModal(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </Card.Header>
                            <Card.Content className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                                    <Input 
                                        type="text" 
                                        value={newPlan.subject} 
                                        onChange={e => setNewPlan({...newPlan, subject: e.target.value})}
                                        placeholder="e.g., Mathematics"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                    <Input 
                                        type="date" 
                                        value={newPlan.date} 
                                        onChange={e => setNewPlan({...newPlan, date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <Input 
                                        type="time" 
                                        value={newPlan.time} 
                                        onChange={e => setNewPlan({...newPlan, time: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                                    <Input 
                                        type="text" 
                                        placeholder="e.g., 1 hour" 
                                        value={newPlan.duration} 
                                        onChange={e => setNewPlan({...newPlan, duration: e.target.value})}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="ghost" onClick={() => setShowManualModal(false)}>Cancel</Button>
                                    <Button onClick={handleAddManualPlan}>Add Plan</Button>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudyPlanner;