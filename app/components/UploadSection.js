import React, { useState, useCallback, useEffect } from 'react';
import TrainingProgress from './TrainingProgress';
import FileUploadModal from './FileUploadModal';

const UploadSection = ({ onTrainingComplete, trainingExamples }) => {
  const [examples, setExamples] = useState(trainingExamples || []);
  const [inputText, setInputText] = useState("");
  const [showInputField, setShowInputField] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    setExamples(trainingExamples);
  }, [trainingExamples]);

  const handleFileUpload = useCallback((results) => {
    const data = hasHeader ? results.data.slice(1) : results.data;
    const newExamples = data
      .map((row) => ({
        text: row[0],
        label: row[1]?.toLowerCase(), // Convert label to lowercase, handle undefined
      }))
      .filter(example => example.text.trim() !== '' && example.label.trim() !== '')
      .slice(0, 100 - examples.length);
    setExamples(prev => [...prev, ...newExamples]);
    setShowModal(false);
    setError(""); // Clear any existing error messages
  }, [hasHeader, examples.length]);

  const startTraining = useCallback(() => {
    setIsTraining(true);
    setTrainingProgress(0);

    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsTraining(false);
            onTrainingComplete(examples); // Pass examples to parent component
          }, 3000); // Delay of 3 seconds
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 300);
  }, [examples, onTrainingComplete]);

  const addExample = useCallback((label) => {
    if (inputText.trim() !== "" && examples.length < 100) {
      setExamples(prev => {
        const updatedExamples = [{ text: inputText, label: label.toLowerCase() }, ...prev]; // Add new example at the top
        return updatedExamples.slice(0, 100);
      });
      setInputText("");
      setShowInputField(false);
      setError(""); // Clear any existing error messages
    }
  }, [inputText, examples.length]);

  const removeExample = useCallback((index) => {
    setExamples(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleExampleChange = (index, value) => {
    setExamples(prev => prev.map((example, i) => (i === index ? { ...example, text: value } : example)));
  };

  const handleLabelChange = (index, value) => {
    setExamples(prev => prev.map((example, i) => (i === index ? { ...example, label: value.toLowerCase() } : example)));
  };

  const getColorDot = useCallback((label) => {
    switch (label) {
      case 'positive':
        return 'bg-[#7B9EA8]';
      case 'negative':
        return 'bg-[#D18EE2]';
      case 'neutral':
        return 'bg-[#A9A9A9]';
      default:
        return 'bg-gray-200';
    }
  }, []);

  const validateExamples = () => {
    const counts = {
      positive: examples.filter(ex => ex.label === 'positive').length,
      negative: examples.filter(ex => ex.label === 'negative').length,
      neutral: examples.filter(ex => ex.label === 'neutral').length,
    };

    if (counts.positive < 2 || counts.negative < 2 || counts.neutral < 2) {
      setError("Please add at least 2 examples for each sentiment category.");
      return false;
    }
    return true;
  };

  const handleStartTraining = () => {
    if (validateExamples()) {
      startTraining();
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md space-y-2 h-full w-full overflow-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold uppercase">TRAINING EXAMPLES</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1 text-sm bg-white text-black border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0-2.112 2.13" />
            </svg>
            <span>Upload a CSV file</span>
          </button>
          <button
            onClick={handleStartTraining}
            className="bg-black text-white flex items-center justify-center space-x-2 px-4 py-2 rounded-full shiny-effect"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span className="font-bold">Start Training</span>
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">Add at least 2 examples for each sentiment category (positive, negative, neutral). Maximum 100 examples in total.</p>
      {showModal && (
        <FileUploadModal
          onFileUpload={handleFileUpload}
          hasHeader={hasHeader}
          setHasHeader={setHasHeader}
          title="Upload Labelled Examples"
          description="Add your data using a .csv file. The file must have two columns: examples and sentiment and at least 2 examples per sentiment. Maximum 100 examples in total."
          closeModal={() => setShowModal(false)}
        />
      )}
      {isTraining ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-50">
          <TrainingProgress isTraining={isTraining} trainingProgress={trainingProgress} />
        </div>
      ) : null}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className={`p-4 ${isTraining ? 'blur-sm' : ''}`}>
        {showInputField && (
          <div className="flex space-x-4 mt-4">
            <input
              className="flex-grow p-2 pl-4 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your input here..."
              style={{ width: '50%' }}
            />
            <div className="flex space-x-2">
              <button onClick={() => addExample('positive')} className="bg-[#7B9EA8] text-white px-4 py-2 rounded-full text-sm">Positive</button>
              <button onClick={() => addExample('negative')} className="bg-[#D18EE2] text-white px-4 py-2 rounded-full text-sm">Negative</button>
              <button onClick={() => addExample('neutral')} className="bg-[#A9A9A9] text-white px-4 py-2 rounded-full text-sm">Neutral</button>
            </div>
          </div>
        )}
        {!showInputField && (
          <button onClick={() => setShowInputField(true)} className="text-black flex items-center space-x-2 mt-4 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Add training example</span>
          </button>
        )}
        <table className="w-full table-auto rounded-lg mt-4">
          <thead>
            <tr className="bg-gray-100 rounded-lg">
              <th className="px-4 py-2 text-left text-sm w-2/5">Example</th>
              <th className="px-4 py-2 text-center text-sm w-1/5">Positive</th>
              <th className="px-4 py-2 text-center text-sm w-1/5">Negative</th>
              <th className="px-4 py-2 text-center text-sm w-1/5">Neutral</th>
            </tr>
          </thead>
          <tbody>
            {examples.map((example, index) => (
              <tr key={index} className="bg-white rounded-lg">
                <td className="px-4 py-2 border-t flex items-start space-x-2 text-sm">
                  <button onClick={() => removeExample(index)} className="text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  <span className={`dot ${getColorDot(example.label)} flex-shrink-0`}></span>
                  {editIndex === index ? (
                    <input
                      type="text"
                      className="flex-grow p-1 border border-gray-300 rounded-lg text-sm"
                      value={example.text}
                      onChange={(e) => handleExampleChange(index, e.target.value)}
                      onBlur={() => setEditIndex(null)}
                      autoFocus
                    />
                  ) : (
                    <span className="flex-grow" onClick={() => setEditIndex(index)}>
                      {example.text}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 border-t text-center align-middle w-1/5">
                  <button
                    onClick={() => setExamples(prev => prev.map((ex, i) => i === index ? { ...ex, label: 'positive' } : ex))}
                    className={`rounded-full flex items-center justify-center ${
                      example.label === 'positive' ? 'bg-[#7B9EA8] text-white' : 'bg-gray-200 text-black'
                    }`}
                    style={{ width: '150px', height: '20px', margin: '0 auto', borderRadius: '9999px' }} // Ensure fully rounded edges
                  >
                  </button>
                </td>
                <td className="px-4 py-2 border-t text-center align-middle w-1/5">
                  <button
                    onClick={() => setExamples(prev => prev.map((ex, i) => i === index ? { ...ex, label: 'negative' } : ex))}
                    className={`rounded-full flex items-center justify-center ${
                      example.label === 'negative' ? 'bg-[#D18EE2] text-white' : 'bg-gray-200 text-black'
                    }`}
                    style={{ width: '150px', height: '20px', margin: '0 auto', borderRadius: '9999px' }} // Ensure fully rounded edges
                  >
                  </button>
                </td>
                <td className="px-4 py-2 border-t text-center align-middle w-1/5">
                  <button
                    onClick={() => setExamples(prev => prev.map((ex, i) => i === index ? { ...ex, label: 'neutral' } : ex))}
                    className={`rounded-full flex items-center justify-center ${
                      example.label === 'neutral' ? 'bg-[#A9A9A9] text-white' : 'bg-gray-200 text-black'
                    }`}
                    style={{ width: '150px', height: '20px', margin: '0 auto', borderRadius: '9999px' }} // Ensure fully rounded edges
                  >
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadSection;

