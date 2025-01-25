# Debt Management Assistant

A web application that helps users manage their debt with an AI-powered chat assistant. The application includes a dashboard showing debt overview, payment history, and a chat interface for getting financial advice.

## Features

- Track total debt and payments
- Visualize payment history with charts
- Add and manage multiple debts
- Record payments
- AI-powered chat assistant for financial advice

## Prerequisites

- Node.js (v14 or higher)
- npm

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Running the Application

1. Start the backend server:
```bash
npm run server
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Tech Stack

- Frontend:
  - React (Vite)
  - Tailwind CSS
  - Chart.js
  - React Icons
- Backend:
  - Node.js
  - Express
  - OpenAI API

## Data Storage

All data is stored in the browser's localStorage. This includes:
- Debt information
- Payment history
- Chat messages

## License

MIT
