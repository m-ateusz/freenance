import { useState, useEffect } from 'react';
import DebtOverview from './components/Dashboard/DebtOverview';
import DebtChart from './components/Dashboard/DebtChart';
import PaymentHistory from './components/Dashboard/PaymentHistory';
import ChatWindow from './components/Chat/ChatWindow';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [debts, setDebts] = useLocalStorage('debts', []);
  const [payments, setPayments] = useLocalStorage('payments', []);
  
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-[2000px] mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Debt Management Dashboard</h1>
        
        <div className="flex gap-8">
          {/* Main content - 60% */}
          <div className="flex-[0.6] space-y-8">
            <DebtOverview 
              totalDebt={totalDebt}
              totalPaid={totalPaid}
              debts={debts}
              setDebts={setDebts}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-100">
                <DebtChart debts={debts} payments={payments} />
              </div>
              <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-100">
                <PaymentHistory 
                  payments={payments} 
                  setPayments={setPayments}
                  debts={debts}
                  setDebts={setDebts}
                />
              </div>
            </div>
          </div>

          {/* Chat window - 40% */}
          <div className="flex-[0.4]">
            <ChatWindow debts={debts} payments={payments} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
