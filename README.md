# Debt Management Assistant

A web application that helps users manage their debt with an AI-powered chat assistant. The application includes a dashboard showing debt overview, payment history, and a chat interface for getting financial advice.

## Features

### Dashboard
- Real-time debt overview with total debt and amount paid
- Interactive debt visualization charts
- Payment history tracking with date and amount
- Support for multiple debts with different interest rates
- Automatic interest and capital allocation calculation

### AI Chat Assistant
- Natural language interaction for financial advice
- Voice input support with WebM audio recording
- Context-aware responses based on your financial situation
- Real-time debt and payment information integration
- Markdown support for formatted responses

### Payment Management
- Add and track payments for specific debts
- Automatic payment distribution between interest and capital
- Historical payment record keeping
- Payment impact visualization on total debt

### Data Management
- Automatic data persistence using localStorage
- No account required - all data stays in your browser
- Export/import functionality for data backup
- Privacy-focused design

## Prerequisites

- Node.js (v14 or higher)
- npm
- Modern web browser with WebM audio support

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

### Frontend
- React (Vite) for UI components
- Tailwind CSS for styling
- Chart.js for data visualization
- React Icons for UI elements
- WebAudio API for voice recording

### Backend
- Node.js with Express
- OpenAI API for chat and voice transcription
- Multer for file upload handling
- CORS for cross-origin resource sharing

### Data Storage
- Browser's localStorage for persistent data storage
- Stores:
  - Debt information
  - Payment history
  - Chat messages
  - User preferences

## Security Features
- Environment variable based API key management
- Client-side data storage for privacy
- Input validation for all forms
- Secure audio file handling

## License

MIT
