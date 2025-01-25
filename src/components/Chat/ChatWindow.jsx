import { useState, useRef, useEffect } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import ReactMarkdown from 'react-markdown';

function ChatWindow({ debts, payments }) {
  const [messages, setMessages] = useLocalStorage('chatMessages', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const prepareFinancialContext = () => {
    console.log('Current debts:', debts);
    console.log('Current payments:', payments);

    const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalMonthlyPayments = debts.reduce((sum, debt) => sum + (debt.monthlyPayment || 0), 0);

    const debtDetails = debts.map(debt => ({
      name: debt.name,
      amount: debt.amount,
      monthlyPayment: debt.monthlyPayment,
      interestRate: debt.interestRate
    }));

    const recentPayments = payments
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(payment => ({
        amount: payment.amount,
        date: payment.date,
        note: payment.note
      }));

    const context = {
      totalDebt,
      totalPaid,
      totalMonthlyPayments,
      debts: debtDetails,
      recentPayments
    };

    console.log('Prepared financial context:', context);
    return context;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    // Update messages state with user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const financialContext = prepareFinancialContext();
      const serverPort = 3001;
      const serverUrl = `http://localhost:${serverPort}/api/chat`;
      
      console.log('Sending request to server:', serverUrl);
      console.log('Financial context:', financialContext);
      
      const userMessageContent = input.trim();
      
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessageContent,
          financialContext
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      console.log('Received response from server:', data);

      const aiMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      };

      // Update messages with both user message and AI response
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'system',
        content: `Error: ${error.message}. Please try again.`,
        timestamp: new Date().toISOString()
      };
      // Update messages with both user message and error message
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg flex flex-col h-[calc(100vh-8rem)] border border-gray-100">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg">
        <h2 className="text-xl font-bold text-white">AI Financial Advisor</h2>
        <p className="text-blue-100 text-sm">Get help with your debt management strategy</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-2">👋 Welcome! I'm here to help you manage your debt.</p>
            <p>Ask me anything about:</p>
            <ul className="list-disc list-inside text-left max-w-xs mx-auto mt-2 space-y-1">
              <li>Debt repayment strategies</li>
              <li>Budgeting tips</li>
              <li>Interest rate optimization</li>
              <li>Financial planning</li>
            </ul>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white ml-4'
                  : message.role === 'system'
                  ? 'bg-red-100 text-red-900'
                  : 'bg-white text-gray-900 shadow-sm border border-gray-200 mr-4'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                      li: ({node, ...props}) => <li className="ml-2" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                      em: ({node, ...props}) => <em className="italic" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm md:text-base">{message.content}</p>
              )}
              <p className={`text-xs mt-1 ${
                message.role === 'user' 
                  ? 'text-blue-100' 
                  : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mr-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about managing your debt..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;
