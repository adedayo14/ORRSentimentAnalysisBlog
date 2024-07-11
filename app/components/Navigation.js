// app/components/Navigation.js

import React from 'react';

const Navigation = ({ setCurrentSection, currentSection, clearAllData }) => {
  const navItems = [
    { name: "01. Train Model", id: "train" },
    { name: "02. Upload Data", id: "upload" },
    { name: "03. Results", id: "results" }
  ];

  return (
    <div className="fixed bottom-8 inset-x-0 mx-auto w-full max-w-6xl px-4">
      <div className="flex justify-evenly bg-white rounded-full border border-gray-300 shadow-lg py-2 px-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentSection(item.id)}
            className="flex-1 text-center font-semibold relative"
          >
            <span className={`
              inline-block px-12 py-2 rounded-full transition-all duration-300
              ${currentSection === item.id
                ? 'bg-black text-white'
                : 'text-black hover:bg-gray-100 rounded-full'
              }
            `}>
              {item.name}
            </span>
          </button>
        ))}
        <button
          onClick={clearAllData}
          className="flex-1 text-center font-semibold relative"
        >
          <span className="inline-block px-12 py-2 rounded-full transition-all duration-300 border border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white">
            RESET
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
