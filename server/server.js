import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const server = createServer(app);
let port = process.env.PORT || 3001;

// Configure CORS to allow all origins in development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

// Parse JSON bodies with higher limit
app.use(express.json({ limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`\n${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

console.log('Server starting...');
console.log('OpenAI API Key length:', process.env.OPENAI_API_KEY?.length || 'not set');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const formatFinancialContext = (context) => {
  const { totalDebt, totalPaid, totalMonthlyPayments, debts, recentPayments } = context;
  
  let contextString = `Current Financial Situation:\n`;
  contextString += `- Total Debt: $${totalDebt.toFixed(2)}\n`;
  contextString += `- Total Paid: $${totalPaid.toFixed(2)}\n`;
  contextString += `- Total Monthly Payments: $${totalMonthlyPayments.toFixed(2)}\n\n`;
  
  contextString += `Current Debts:\n`;
  debts.forEach(debt => {
    contextString += `- ${debt.name}: $${debt.amount.toFixed(2)} (${debt.interestRate}% interest, $${debt.monthlyPayment.toFixed(2)}/month)\n`;
  });
  
  if (recentPayments.length > 0) {
    contextString += `\nRecent Payments:\n`;
    recentPayments.forEach(payment => {
      contextString += `- $${payment.amount.toFixed(2)} on ${new Date(payment.date).toLocaleDateString()}${payment.note ? ` (${payment.note})` : ''}\n`;
    });
  }
  
  return contextString;
};

const logWithTimestamp = (message, data) => {
  const timestamp = new Date().toISOString();
  const logMessage = `
========== ${timestamp} ==========
${message}
Data: ${JSON.stringify(data, null, 2)}
=====================================`;
  
  // Force immediate console output
  console.log(logMessage);
  // Also write to stderr for immediate output
  process.stderr.write(logMessage + '\n');
};

// Add a test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Server is working' });
});

app.post('/api/chat', async (req, res) => {
  console.log('\n=== Received chat request ===');
  try {
    const { message, financialContext } = req.body;
    
    console.log('Request body:', { 
      message, 
      hasFinancialContext: !!financialContext,
      financialContextKeys: financialContext ? Object.keys(financialContext) : []
    });
    
    const systemPrompt = `You are a helpful and empathetic financial advisor specializing in debt management. 
Your role is to provide practical advice and emotional support to help users overcome their debt.

Here is gathered debt information: 
${financialContext ? formatFinancialContext(financialContext) : 'None'}

Based on this information, provide specific, actionable advice that takes into account the user's current financial situation. 
Focus on:
1. Practical steps to manage and reduce debt
  - Especially which debt should be tackled first
2. Strategies to optimize interest payments
3. Budgeting advice to maintain payments
4. Specific recommendations based on their debt composition

Format your response using markdown:
- Use **bold** for important points
- Use numbered lists (1., 2., etc.) for steps
- Use bullet points for lists of items
- Use *italics* for emphasis

Keep responses clear, encouraging, and focused on achievable goals. Explain your reasoning.`;

    const messages = [
      { 
        role: "system", 
        content: systemPrompt
      },
      { role: "user", content: message }
    ];

    logWithTimestamp('OpenAI API Request:', {
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log('Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 500,
    });
    console.log('Received response from OpenAI');

    logWithTimestamp('OpenAI API Response:', {
      response: completion.choices[0].message.content,
      usage: completion.usage,
      model: completion.model,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    logWithTimestamp('OpenAI API Error:', {
      error: error.message,
      stack: error.stack
    });
    console.error('Detailed error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Try to start the server, increment port if in use
const startServer = () => {
  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}`);
      port++;
      server.listen(port);
    }
  });

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('Ready to handle requests...');
  });
};

startServer();
