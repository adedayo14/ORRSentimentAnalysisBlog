import React from 'react';

const OutputSection = ({ output }) => {
  const getColor = (prediction) => {
    switch (prediction) {
      case 'positive':
        return 'bg-[#7B9EA8]'; // Positive: #7B9EA8
      case 'negative':
        return 'bg-[#D18EE2]'; // Negative: #D18EE2
      case 'neutral':
        return 'bg-[#A9A9A9]'; // Neutral: Dark Gray
      default:
        return 'bg-gray-600'; // Default color
    }
  };

  const downloadCSV = () => {
    const csvContent = `Number,Comment,Rating,Confidence Level\n` +
      output.map((result, index) => `${index + 1},"${result.text}",${result.prediction},${(result.confidence * 100).toFixed(1)}%`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(output.map((result, index) => ({
      number: index + 1,
      comment: result.text,
      rating: result.prediction,
      confidence: (result.confidence * 100).toFixed(1) + "%"
    })), null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'results.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md space-y-4 h-full w-full overflow-auto bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold uppercase">OUTPUT</h3>
        <div className="flex space-x-2">
          <button
            onClick={downloadCSV}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-full shiny-effect ${output.length === 0 ? 'opacity-50 cursor-not-allowed' : 'bg-white text-black'}`}
            disabled={output.length === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            <span className="font-bold">Download CSV</span>
          </button>
          <button
            onClick={downloadJSON}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-full shiny-effect ${output.length === 0 ? 'opacity-50 cursor-not-allowed' : 'bg-white text-black'}`}
            disabled={output.length === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            <span className="font-bold">Download JSON</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mb-2">
        <div className="col-span-8 px-4">Value</div>
        <div className="col-span-4 text-right px-4">
          <span>Confidence Level</span>
        </div>
      </div>
      {output.length === 0 ? (
        <p className="text-center text-gray-500">No data to display. Run the analysis to see the results.</p>
      ) : (
        <ul className="space-y-4">
          {output.map((result, index) => (
            <li key={index} className="flex flex-wrap items-start p-4 bg-gray-800 border border-white rounded-full shadow-md">
              <div className="w-full md:w-2/3 overflow-hidden text-ellipsis whitespace-normal px-2">
                <div className="text-md">{index + 1}. {result.text}</div>
              </div>
              <div className="w-full md:w-1/3 flex items-center justify-between px-2 mt-2 md:mt-0">
                <span className="text-md capitalize">{result.prediction}</span>
                <div className="w-1/2 h-4 bg-gray-600 rounded-full mx-2 relative">
                  <div className={`h-full rounded-full ${getColor(result.prediction)}`} style={{ width: `${(result.confidence * 100).toFixed(0)}%` }}></div>
                </div>
                <span className="text-md ml-2">{(result.confidence * 100).toFixed(0)}%</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OutputSection;
