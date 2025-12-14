// src/pages/student/StudyResources.jsx

import React, { useState } from 'react'; // Removed useEffect
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { ChevronLeft, Book, Film, FileText, Search, Loader2, ServerCrash, Globe } from 'lucide-react';
// We are no longer fetching subjects or using mock data for them
import Input from '../../components/ui/Input';

// Helper component
const ResourceCard = ({ title, icon, children }) => (
  <Card>
    <Card.Header>
      <Card.Title className="flex items-center gap-2 text-vidya-blue">
        {icon}
        {title}
      </Card.Title>
    </Card.Header>
    <Card.Content>
      {children}
    </Card.Content>
  </Card>
);

// ✅ NEW: Hardcoded subject list per your request
const subjectsList = [
  "Machine Learning",
  "Database System",
  "Data Structures",
  "Algorithm",
  "Java",
  "Python"
];

const StudyResources = () => {
  // --- STATE CHANGES ---
  const [selectedSubject, setSelectedSubject] = useState(subjectsList[0]); // Default to first
  const [customSubject, setCustomSubject] = useState(""); // For the "Other" option
  const [customTopic, setCustomTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState(null);

  // --- REMOVED: useEffect hook to fetch subjects ---

  const handleSearch = async () => {
    // --- Logic for custom subject ---
    const subjectToSearch = selectedSubject === "Other (Custom)" 
      ? customSubject 
      : selectedSubject;

    if (customTopic.trim() === '' || subjectToSearch.trim() === '') {
      alert("Please select/enter a subject and enter a topic.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResources(null);

    try {
      const response = await fetch('/api/study-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subjectToSearch,
          topic: customTopic,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to fetch resources from the server.');
      }

      const data = await response.json();
      setResources(data);
      setCustomTopic(''); 

    } catch (err) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-8">
        <Link to="/student/dashboard" className="inline-flex items-center text-vidya-pink mb-4 hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-vidya-gray-900 mb-6">Study Resources</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* --- SUBJECTS (SIDEBAR) --- */}
          <aside className="w-full md:w-1/4">
            <Card>
              <Card.Header><Card.Title>1. Select Subject</Card.Title></Card.Header>
              <Card.Content className="p-2">
                <nav className="flex flex-col gap-1">
                  
                  {/* ✅ --- KEY CHANGE --- */}
                  {/* Renders from your new hardcoded list */}
                  {subjectsList.map(subject => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`p-2 text-left rounded-md text-sm font-medium ${
                        selectedSubject === subject
                          ? 'bg-vidya-light-pink text-vidya-pink'
                          : 'hover:bg-vidya-gray-100'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                  
                  {/* --- "Other" button --- */}
                  <button
                    key="custom"
                    onClick={() => setSelectedSubject("Other (Custom)")}
                    className={`p-2 text-left rounded-md text-sm font-medium ${
                      selectedSubject === "Other (Custom)"
                        ? 'bg-vidya-light-pink text-vidya-pink'
                        : 'hover:bg-vidya-gray-100'
                    }`}
                  >
                    Other (Custom)
                  </button>

                  {/* --- Custom subject input box --- */}
                  {selectedSubject === "Other (Custom)" && (
                    <div className="p-2 pt-3">
                      <Input
                        placeholder="Enter custom subject..."
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  )}
                </nav>
              </Card.Content>
            </Card>
          </aside>

          {/* --- MAIN CONTENT (SEARCH & RESULTS) --- */}
          <div className="flex-1 space-y-6">
            {/* --- SEARCH BAR --- */}
            <Card>
              <Card.Header>
                <Card.Title>
                  2. Enter Topic for {selectedSubject === "Other (Custom)" ? (customSubject || "...") : selectedSubject}
                </Card.Title>
              </Card.Header>
              <Card.Content className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="E.g., 'Arrays', 'Linked Lists', 'Binary Search'..."
                    className="pl-10 w-full"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                  />
                </div>
                <button 
                  onClick={handleSearch} 
                  disabled={isLoading}
                  className="bg-vidya-pink text-white px-4 py-2 rounded-md font-bold disabled:bg-gray-400 flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Generate"
                  )}
                </button>
              </Card.Content>
            </Card>

            {/* --- RESULTS AREA --- */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow">
                <Loader2 className="h-12 w-12 animate-spin text-vidya-pink" />
                <p className="mt-4 text-lg font-medium text-vidya-gray-700">Generating your resource guide...</p>
                <p className="text-sm text-vidya-gray-500">This may take a moment.</p>
              </div>
            )}

            {error && (
               <ResourceCard title="Error" icon={<ServerCrash className="h-5 w-5 text-red-500" />}>
                 <p className="text-red-600 font-medium">Error details:</p>
                 <p className="text-sm text-gray-700 mt-1">{error}</p>
                 <p className="text-sm text-gray-500 mt-4">Please try again. If the problem persists, check the server console.</p>
               </ResourceCard>
            )}

            {resources && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Summary */}
                <ResourceCard title="Summary" icon={<FileText className="h-5 w-5" />}>
                  <p className="text-vidya-gray-700 leading-relaxed">{resources.summary || "No summary available."}</p>
                </ResourceCard>

                {/* Textbooks */}
                <ResourceCard title="Textbooks" icon={<Book className="h-5 w-5" />}>
                  <ul className="list-disc space-y-2 pl-5 text-vidya-gray-700">
                    {resources.textbooks?.length > 0 ? (
                      resources.textbooks.map((text, i) => <li key={i}>{text}</li>)
                    ) : (
                      <li>No textbooks found.</li>
                    )}
                  </ul>
                </ResourceCard>

                {/* ✅ --- KEY CHANGE --- */}
                {/* Websites card now mirrors the YouTube card's style */}
                <ResourceCard title="Websites" icon={<Globe className="h-5 w-5" />}>
                  <div className="space-y-3">
                    {resources.websites?.length > 0 ? (
                      resources.websites.map((site, i) => (
                        <a 
                          key={i} 
                          href={site.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block p-3 bg-vidya-gray-50 rounded-lg hover:bg-vidya-gray-100"
                        >
                          <p className="font-medium text-vidya-pink">{site.title}</p>
                          <p className="text-sm text-blue-600 truncate">{site.link}</p>
                        </a>
                      ))
                    ) : (
                      <p>No websites found.</p>
                    )}
                  </div>
                </ResourceCard>
                
                {/* YouTube Links */}
                <ResourceCard title="YouTube Videos" icon={<Film className="h-5 w-5" />}>
                  <div className="space-y-3">
                    {resources.youtube?.length > 0 ? (
                      resources.youtube.map((vid, i) => (
                        <a 
                          key={i} 
                          href={vid.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="block p-3 bg-vidya-gray-50 rounded-lg hover:bg-vidya-gray-100"
                        >
                          <p className="font-medium text-vidya-pink">{vid.title}</p>
                          <p className="text-sm text-blue-600 truncate">{vid.link}</p>
                        </a>
                      ))
                    ) : (
                      <p>No videos found.</p>
                    )}
                  </div>
                </ResourceCard>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyResources;