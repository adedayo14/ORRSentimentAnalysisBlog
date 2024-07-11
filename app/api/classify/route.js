import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, // Ensure this is set in your .env.local file
});

// Helper function to chunk an array
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export async function POST(req) {
  try {
    const { inputs, examples } = await req.json();
    console.log('Received inputs:', inputs.length);
    console.log('Received examples:', examples.length);

    if (!Array.isArray(inputs) || !Array.isArray(examples)) {
      throw new Error('Invalid data format: inputs and examples should be arrays');
    }

    examples.forEach(example => {
      if (typeof example.text !== 'string' || example.text.trim() === '') {
        throw new Error('Invalid example format: each example should have non-empty text property as string');
      }
      if (typeof example.label !== 'string' || example.label.trim() === '') {
        throw new Error('Invalid example format: each example should have non-empty label property as string');
      }
    });

    const inputChunks = chunkArray(inputs, 96);
    const allClassifications = [];

    for (const chunk of inputChunks) {
      const response = await cohere.classify({
        model: 'embed-english-v2.0',
        inputs: chunk,
        examples,
      });

      allClassifications.push(...response.classifications);
    }

    console.log('Cohere response:', allClassifications);
    return NextResponse.json(allClassifications.map(classification => ({
      text: classification.input,
      prediction: classification.prediction,
      confidence: classification.confidences[0] // Use the first confidence value
    })));
  } catch (error) {
    console.error('Error in classification:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
