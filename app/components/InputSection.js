import React, { useState, useCallback } from 'react';
import FileUploadModal from './FileUploadModal';

const InputSection = ({ setInputs, inputs = [], classifyInputs, isLoading }) => {
  const [inputText, setInputText] = useState("");
  const [showInputField, setShowInputField] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const [editIndex, setEditIndex] = useState(null);

  const handleFileUpload = useCallback((results) => {
    const data = hasHeader ? results.data.slice(1) : results.data;
    const newInputs = data
      .map((row) => row[0])
      .filter(input => input.trim() !== ''); // Filter out empty inputs
    setInputs(prev => [...prev, ...newInputs]);
    setShowModal(false);
    setError(""); // Clear error on successful upload
  }, [hasHeader, setInputs]);

  const addInput = useCallback(() => {
    if (inputText.trim() !== "") {
      setInputs(prev => [inputText, ...prev]); // Add new input at the top
      setInputText("");
      setShowInputField(false);
      setError(""); // Clear error on adding input
    }
  }, [inputText, setInputs]);

  const removeInput = useCallback((index) => {
    setInputs(prev => prev.filter((_, i) => i !== index));
  }, [setInputs]);

  const clearData = () => {
    setInputs([]);
    setInputText("");
  };

  const handleRunClick = () => {
    if (inputs.length === 0) {
      setError("Please upload data or add data manually.");
    } else {
      setError("");
      classifyInputs();
    }
  };

  const handleInputChange = (index, value) => {
    setInputs(prev => prev.map((input, i) => (i === index ? value : input)));
  };

  return (
    <div className="p-4 border rounded-lg shadow-md space-y-6 h-full w-full overflow-auto">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-sm font-semibold uppercase">UPLOAD DATA</h3>
        <div className="flex space-x-2">
          <button onClick={() => setShowModal(true)} className="flex items-center space-x-1 text-sm bg-white text-black border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0-2.112 2.13" />
            </svg>
            <span>Upload a CSV file</span>
          </button>
          <button
            onClick={handleRunClick}
            className="bg-black text-white flex items-center justify-center space-x-2 px-4 py-2 rounded-full shiny-effect border border-gray-300"
            style={{ width: '180px' }}
          >
            {isLoading ? <div className="loader"></div> : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
                <span className="font-bold">RUN</span>
              </>
            )}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      {showModal && (
        <FileUploadModal
          onFileUpload={handleFileUpload}
          hasHeader={hasHeader}
          setHasHeader={setHasHeader}
          title="Upload Sentences"
          description="Add your data using a .csv file. The file must have one column: examples."
          closeModal={() => setShowModal(false)}
        />
      )}
      {showInputField && (
        <div className="flex space-x-4 mt-8">
          <input
            className="flex-grow p-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            style={{
              '--tw-ring-color': 'black',
              '--tw-ring-offset-width': '0px',
              'padding-left': '20px' // Added padding to move cursor away from the edge
            }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder=" Type your input here..."
          />
          <button onClick={addInput} className="bg-black text-white px-4 py-2 rounded-full text-sm">
            Add Input
          </button>
        </div>
      )}
      {!showInputField && (
        <button onClick={() => setShowInputField(true)} className="text-black flex items-center space-x-2 mt-12 text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Add input</span>
        </button>
      )}
      <ul className="space-y-2 mt-8">
        {inputs.map((input, index) => (
          <li key={index} className="flex justify-between items-center p-2 rounded-lg border border-gray-300">
            <div className="flex items-center space-x-2 text-sm flex-grow">
              <button onClick={() => removeInput(index)} className="text-gray-500 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <span>{index + 1}.</span>
              {editIndex === index ? (
                <input
                  type="text"
                  className="flex-grow p-1 border border-gray-300 rounded-lg text-sm focus:border-black focus:ring-0"
                  style={{ 'padding-left': '20px' }} // Added padding to move cursor away from the edge
                  value={input}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onBlur={() => setEditIndex(null)}
                />
              ) : (
                <span onClick={() => setEditIndex(index)}>{input}</span>
              )}
            </div>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default InputSection;
