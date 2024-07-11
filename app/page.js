'use client';

import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import Navigation from './components/Navigation';
import PasswordPrompt from './components/PasswordPrompt';

const Home = () => {
  const [currentSection, setCurrentSection] = useState('train'); // Start with 'train' by default
  const [inputs, setInputs] = useState([]); // State for inputs
  const [trainingExamples, setTrainingExamples] = useState([]); // State for training examples
  const [output, setOutput] = useState([]); // State for outputs
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for password authentication

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
        body: JSON.stringify({ inputs, examples: validExamples }), // Ensure to send examples with inputs
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

  const handlePasswordSubmit = (password) => {
    const correctPassword = 'Adedayo'; // Replace with your actual password
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const renderSection = () => {
    switch (currentSection) {
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

  if (!isAuthenticated) {
    return <PasswordPrompt onPasswordSubmit={handlePasswordSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <div className="flex-grow overflow-auto p-4">
        {renderSection()}
      </div>
      <Navigation 
        setCurrentSection={setCurrentSection} 
        currentSection={currentSection} 
        clearAllData={clearAllData} 
      />
    </div>
  );
};

export default Home;
