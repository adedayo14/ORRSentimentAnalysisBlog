# Sentiment Analysis

## Overview
This is a sentiment analysis application built with Next.js, designed to classify text inputs into sentiment categories (positive, negative, neutral) using the Cohere AI API for text classification.

## Tech Stack
- **Next.js**: A React framework for server-rendered applications.
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Cohere AI**: Used for text classification via its API.
- **PapaParse**: A powerful CSV library for parsing CSV files in the browser.

## Features
- **Upload CSV Files**: Easily upload CSV files containing text inputs for sentiment analysis using PapaParse.
- **Manual Input**: Manually input text for analysis.
- **Training Examples**: Add training examples with sentiment labels to improve classification accuracy.
- **Export Results**: Export the classification results in JSON or CSV format.
- **Password Protection**: Simple password protection to restrict access to the application or prevent API key misuse.

## Getting Started

First, clone the repository and navigate to the project directory:

```bash
git clone https://github.com/adedayo14/ORRSentimentAnalysisBlog.git
cd ORRSentimentAnalysisBlog

```

## Install dependencies:

```bash
npm install
# or
yarn install
```

Set up your environment variables by creating a .env.local file in the root directory and add your API key:
```bash
NEXT_PASSWORD=your_password_here
COHERE_API_KEY=your_cohere_api_key
```
Run the development server:

```bash
npm run dev
# or
yarn dev

```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimisation) to automatically optimise and load Inter, a custom Google Font.


## Dependencies
- **cohere-ai**: API client for Cohere AI.
- **next**: The React framework for production.
- **react**: A JavaScript library for building user interfaces.
- **react-dom**: Serves as the entry point to the DOM and server renderers for React.
- **react-papaparse**: Fast and reliable CSV parser for React.

## Author
Adedayo Alao

## License
This project is licensed under the MIT License.

