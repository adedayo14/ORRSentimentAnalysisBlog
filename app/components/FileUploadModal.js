// app/components/FileUploadModal.js

import React from 'react';
import { useCSVReader } from 'react-papaparse';

const FileUploadModal = ({ onFileUpload, hasHeader, setHasHeader, title, closeModal, description }) => {
  const { CSVReader } = useCSVReader();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-700">{description}</p>
        <CSVReader onUploadAccepted={onFileUpload}>
          {({ getRootProps, acceptedFile, ProgressBar }) => (
            <div className="flex flex-col items-center w-full">
              <div {...getRootProps()} className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-100 text-center text-sm text-gray-700">
                {acceptedFile ? acceptedFile.name : "Drag and drop to upload or choose a .csv"}
              </div>
              {acceptedFile && <ProgressBar className="w-full mt-2" />}
            </div>
          )}
        </CSVReader>
        <div className="flex items-center space-x-2 mt-4">
          <label htmlFor="header-toggle" className="text-sm">File contains a header row</label>
          <input
            type="checkbox"
            id="header-toggle"
            className="checkbox-black"
            checked={hasHeader}
            onChange={() => setHasHeader(!hasHeader)}
          />
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
