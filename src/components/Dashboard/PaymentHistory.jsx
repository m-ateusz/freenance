import { useState } from 'react';
import { addPayment } from '../../services/firestore';

export default function PaymentHistory({ payments, setPayments, debts, userId }) {
  const [newPayment, setNewPayment] = useState({
    amount: '',
    debtId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const paymentData = {
      amount: parseFloat(newPayment.amount),
      debtId: newPayment.debtId,
      date: new Date(newPayment.date).toISOString()
    };

    try {
      const docRef = await addPayment(userId, newPayment.debtId, paymentData);
      setPayments([...payments, { ...paymentData, id: docRef.id }]);
      setNewPayment({
        amount: '',
        debtId: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment History</h3>
      
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Debt</label>
            <select
              value={newPayment.debtId}
              onChange={(e) => setNewPayment({ ...newPayment, debtId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a debt</option>
              {debts.map((debt) => (
                <option key={debt.id} value={debt.id}>
                  {debt.name} (${debt.amount.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={newPayment.date}
              onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Payment
        </button>
      </form>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {payments.sort((a, b) => new Date(b.date) - new Date(a.date)).map((payment) => {
          const debt = debts.find(d => d.id === payment.debtId);
          return (
            <div
              key={payment.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">
                    {debt ? debt.name : 'Unknown Debt'}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${payment.amount.toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(payment.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
