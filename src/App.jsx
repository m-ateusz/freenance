import { useState, useEffect } from 'react';
import DebtOverview from './components/Dashboard/DebtOverview';
import DebtChart from './components/Dashboard/DebtChart';
import PaymentHistory from './components/Dashboard/PaymentHistory';
import ChatWindow from './components/Chat/ChatWindow';
import { useAuth } from './contexts/AuthContext';
import { getUserDebts, getDebtPayments } from './services/firestore';

function App() {
  const { currentUser } = useAuth();
  const [debts, setDebts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        // Get all debts
        const userDebts = await getUserDebts(currentUser.uid);
        setDebts(userDebts);

        // Get payments for each debt
        const allPayments = [];
        for (const debt of userDebts) {
          const debtPayments = await getDebtPayments(currentUser.uid, debt.id);
          allPayments.push(...debtPayments);
        }
        setPayments(allPayments);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [currentUser]);

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Debt Management Dashboard</h1>
          {currentUser && (
            <button
              onClick={() => logout()}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Sign Out
            </button>
          )}
        </div>
        
        <div className="flex gap-8">
          {/* Main content - 60% */}
          <div className="flex-[0.6] space-y-8">
            <DebtOverview 
              totalDebt={totalDebt}
              totalPaid={totalPaid}
              debts={debts}
              setDebts={setDebts}
              userId={currentUser?.uid}
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
                  userId={currentUser?.uid}
                />
              </div>
            </div>
          </div>

          {/* Chat window - 40% */}
          <div className="flex-[0.4]">
            <ChatWindow 
              debts={debts} 
              payments={payments} 
              userId={currentUser?.uid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
