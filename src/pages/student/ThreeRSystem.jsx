// src/pages/student/ThreeRSystem.jsx
import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { ChevronLeft, Edit, Eye, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input'; // ✅ Import Input component
import { db } from '../../data/mockData';

// ✅ Helper function to format the date
const formatSummaryDate = (dateString) => {
    const date = new Date(dateString);
    // Adjust for timezone offset to prevent date from shifting
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString('en-GB', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

// ✅ New component to render a summary in the correct format
const SummaryCard = ({ summary }) => (
    <div className="p-4 border rounded-md">
        <p className="font-bold text-vidya-pink">{formatSummaryDate(summary.date)}</p>
        <div className="mt-2 text-sm font-medium text-vidya-gray-700">
            <span className="font-semibold">Subject:</span> {summary.subject}
            <span className="ml-4 font-semibold">Topic:</span> {summary.topic}
        </div>
        <p className="mt-2 whitespace-pre-wrap text-vidya-gray-800">{summary.content}</p>
    </div>
);

const ThreeRSystem = () => {
    const [activeTab, setActiveTab] = useState('review');
    const [summaries, setSummaries] = useState(db.summaries);
    
    // ✅ State for new inputs
    const [todaySubject, setTodaySubject] = useState('');
    const [todayTopic, setTodayTopic] = useState('');
    const [todaySummary, setTodaySummary] = useState('');

    // ✅ Updated save handler
    const handleSave = () => {
        if (!todaySubject || !todayTopic || !todaySummary) {
            alert("Please fill in all fields (Subject, Topic, and Summary) before saving.");
            return;
        }
        const newSummary = { 
            date: new Date().toISOString().split('T')[0], // Use YYYY-MM-DD for reliable matching
            subject: todaySubject,
            topic: todayTopic,
            content: todaySummary 
        };
        // Add new summary to the start of the array
        setSummaries([newSummary, ...summaries]);
        
        // Clear inputs
        setTodaySubject('');
        setTodayTopic('');
        setTodaySummary('');
        alert('Summary Saved!');
    };

    // ✅ Updated logic for Recall tab
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateString = yesterday.toISOString().split('T')[0];
    const yesterdaySummary = summaries.find(s => s.date === yesterdayDateString);

    // Find the most recent summary if yesterday's doesn't exist
    // Make sure summaries[0] exists before trying to access it
    const mostRecentSummary = yesterdaySummary ? null : (summaries.length > 0 ? summaries[0] : null);

    const tabs = [
        { id: 'review', name: 'Review', icon: Edit },
        { id: 'recall', name: 'Recall', icon: Eye },
        { id: 'revise', name: 'Revise', icon: RefreshCw },
    ];

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto p-8">
                <Link to="/student/dashboard" className="inline-flex items-center text-vidya-pink mb-4 hover:underline"><ChevronLeft className="h-4 w-4 mr-1" />Back to Dashboard</Link>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-vidyamitra-gray-900">3R Summary System</h1>
                    <p className="mt-2 text-vidya-gray-500">Review → Recall → Revise: A systematic approach to effective learning.</p>
                </div>

                <Card className="mt-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id ? 'border-vidya-pink text-vidya-pink' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    <tab.icon className="h-5 w-5" /> {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <Card.Content>
                        {/* --- REVIEW TAB --- */}
                        {activeTab === 'review' && (
                            <div>
                                <h3 className="text-lg font-semibold">Today's Study Summary ({new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})</h3>
                                <p className="text-sm text-vidya-gray-500 mb-4">Write a summary of what you studied today. Include key concepts, insights, and areas for improvement.</p>
                                
                                {/* ✅ New Input Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-vidya-gray-700 mb-1">Subject</label>
                                        <Input value={todaySubject} onChange={(e) => setTodaySubject(e.target.value)} placeholder="e.g., Data Structures" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-vidya-gray-700 mb-1">Topic</label>
                                        <Input value={todayTopic} onChange={(e) => setTodayTopic(e.target.value)} placeholder="e.g., Arrays and Pointers" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-vidya-gray-700 mb-1">Summary</label>
                                    <textarea value={todaySummary} onChange={(e) => setTodaySummary(e.target.value)} rows="8" className="w-full p-2 border rounded-md" placeholder="What did you study today? Write your summary here..."></textarea>
                                </div>
                                <Button onClick={handleSave} className="mt-4">Save Summary</Button>
                            </div>
                        )}

                        {/* --- RECALL TAB --- */}
                        {activeTab === 'recall' && (
                            <div>
                                {/* ✅ Updated Logic */}
                                <h3 className="text-lg font-semibold">
                                    {yesterdaySummary ? "Yesterday's Summary" : "Recently Added Summary"}
                                </h3>
                                <p className="text-sm text-vidya-gray-500 mb-4">Review what you studied recently to reinforce your learning.</p>
                                
                                {yesterdaySummary ? (
                                    <SummaryCard summary={yesterdaySummary} />
                                ) : mostRecentSummary ? (
                                    <SummaryCard summary={mostRecentSummary} />
                                ) : ( 
                                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                                        <Eye className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No Recent Summary Found</h3>
                                        <p className="mt-1 text-sm text-gray-500">You haven't created any summaries yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- REVISE TAB --- */}
                        {activeTab === 'revise' && (
                            <div>
                                <h3 className="text-lg font-semibold">All Study Summaries</h3>
                                <p className="text-sm text-vidya-gray-500 mb-4">Access all your past summaries for comprehensive revision.</p>
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {summaries.length > 0 ? summaries.map((summary, index) => ( 
                                        // ✅ Use the new SummaryCard component and a proper key
                                        <SummaryCard key={`${summary.date}-${index}`} summary={summary} /> 
                                    )) : <p>No summaries saved yet.</p>}
                                </div>
                            </div>
                        )}
                    </Card.Content>
                </Card>
            </main>
        </div>
    );
};

export default ThreeRSystem;