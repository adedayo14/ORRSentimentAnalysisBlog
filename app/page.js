"use client";

import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import Navigation from './components/Navigation';
import PasswordPrompt from './components/PasswordPrompt';

const Home = () => {
  const [currentSection, setCurrentSection] = useState('train');
  const [inputs, setInputs] = useState([]);
  const [trainingExamples, setTrainingExamples] = useState([]);
  const [output, setOutput] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handlePasswordSubmit = (password) => {
    if (password === process.env.NEXT_PUBLIC_PASSWORD) {
      setAuthenticated(true);
    } else {
      setErrorMessage('Invalid password');
    }
  };

  const handleTrainingComplete = (examples) => {
    setTrainingExamples(examples);
    setCurrentSection('upload');
  };

  const classifyInputs = async () => {
    try {
      if (!inputs.length) {
        throw new Error('Inputs are missing');
      }

      const validExamples = trainingExamples.filter(example => example.text.trim() !== '' && example.label.trim() !== '');
      if (!validExamples.length) {
        throw new Error('Training examples are missing or invalid');
      }

      setLoading(true);

      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs, examples: validExamples }),
      });

      const data = await response.json();
      if (response.ok) {
        setOutput(data);
        setCurrentSection('results');
      } else {
        setErrorMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = () => {
    setTrainingExamples([]);
    setInputs([]);
    setOutput([]);
    setCurrentSection('train');
    setErrorMessage('');
    setLoading(false);
  };

  const renderSection = () => {
    if (!authenticated) {
      return <PasswordPrompt onPasswordSubmit={handlePasswordSubmit} />;
    }

    switch(currentSection) {
      case 'train':
        return <UploadSection onTrainingComplete={handleTrainingComplete} trainingExamples={trainingExamples} />;
      case 'upload':
        return <InputSection setInputs={setInputs} inputs={inputs} classifyInputs={classifyInputs} isLoading={loading} />;
      case 'results':
        return <OutputSection output={output} errorMessage={errorMessage} loading={loading} />;
      default:
        return <h1 className="text-3xl font-bold text-center mt-12">Welcome to Sentiment Analysis Tool</h1>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <header className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 animate-underline">Sentiment Analysis Tool</h1>
        </div>
      </header>
      <div className="flex-grow overflow-auto p-4">
        {renderSection()}
      </div>
      {authenticated && (
        <Navigation 
          setCurrentSection={setCurrentSection} 
          currentSection={currentSection} 
          clearAllData={clearAllData} 
        />
      )}
    </div>
  );
};

export default Home;
