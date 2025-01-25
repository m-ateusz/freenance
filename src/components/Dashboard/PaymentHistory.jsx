import { useState } from 'react';

function PaymentHistory({ payments, setPayments, debts, setDebts }) {
  const [newPayment, setNewPayment] = useState({ 
    amount: '', 
    date: '', 
    note: '', 
    debtId: '',
    interestAmount: 0,
    capitalAmount: 0
  });

  const calculateInterestAndCapital = (amount, debtId) => {
    console.log('All debts:', debts);
    console.log('Looking for debt with ID:', debtId, 'type:', typeof debtId);
    
    // Convert debtId to number since it comes from select as string
    const numericDebtId = parseInt(debtId, 10);
    const debt = debts.find(d => d.id === numericDebtId);
    
    console.log('Found debt:', debt);
    
    if (!debt || !amount) return { interestAmount: 0, capitalAmount: parseFloat(amount) || 0 };

    // Convert amount to float
    const paymentAmount = parseFloat(amount);
    
    // Calculate monthly interest using proper float division
    const monthlyInterestRate = parseFloat(debt.interestRate) / 100.0 / 12.0;
    const interestDue = parseFloat(debt.amount) * monthlyInterestRate;

    // If payment is less than interest due, all goes to interest
    if (paymentAmount <= interestDue) {
      return {
        interestAmount: paymentAmount,
        capitalAmount: 0
      };
    }

    // Otherwise, pay interest first, then capital
    return {
      interestAmount: interestDue,
      capitalAmount: paymentAmount - interestDue
    };
  };

  const handleAmountChange = (e) => {
    const amount = e.target.value;
    if (!amount || !newPayment.debtId) {
      setNewPayment({
        ...newPayment,
        amount,
        interestAmount: 0,
        capitalAmount: 0
      });
      return;
    }

    const { interestAmount, capitalAmount } = calculateInterestAndCapital(amount, newPayment.debtId);
    console.log('Amount Change:', { amount, interestAmount, capitalAmount });
    
    setNewPayment({
      ...newPayment,
      amount,
      interestAmount,
      capitalAmount
    });
  };

  const handleDebtChange = (e) => {
    const debtId = e.target.value;
    if (!debtId || !newPayment.amount) {
      setNewPayment({
        ...newPayment,
        debtId,
        interestAmount: 0,
        capitalAmount: 0
      });
      return;
    }

    const { interestAmount, capitalAmount } = calculateInterestAndCapital(newPayment.amount, debtId);
    
    setNewPayment({
      ...newPayment,
      debtId,
      interestAmount,
      capitalAmount
    });
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!newPayment.amount || !newPayment.date || !newPayment.debtId) return;

    // Convert debtId to number for consistency
    const numericDebtId = parseInt(newPayment.debtId, 10);
    const { interestAmount, capitalAmount } = calculateInterestAndCapital(newPayment.amount, numericDebtId);
    
    // Add payment to history
    const payment = {
      id: Date.now(),
      amount: parseFloat(newPayment.amount),
      date: newPayment.date,
      note: newPayment.note,
      debtId: numericDebtId,  // Store as number
      interestAmount,
      capitalAmount
    };

    // Update payments state
    setPayments(currentPayments => {
      const updatedPayments = [...currentPayments, payment];
      return updatedPayments;
    });

    // Find the debt and calculate new amount
    const debt = debts.find(d => d.id === numericDebtId);
    if (debt) {
      const newAmount = parseFloat(debt.amount) - payment.capitalAmount;
      
      // Update debts state with the new amount
      setDebts(currentDebts => {
        return currentDebts.map(d => 
          d.id === numericDebtId
            ? { ...d, amount: newAmount }
            : d
        );
      });
    }

    // Reset form
    setNewPayment({
      amount: '',
      date: '',
      note: '',
      debtId: '',
      interestAmount: 0,
      capitalAmount: 0
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>

      <div className="mb-6">
        <div className="space-y-2">
          {payments.sort((a, b) => new Date(b.date) - new Date(a.date)).map(payment => {
            const debt = debts.find(d => d.id === payment.debtId);
            return (
              <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">${payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {debt?.name || 'Unknown Debt'} - Interest: ${payment.interestAmount.toFixed(2)}, 
                    Capital: ${payment.capitalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">{payment.note}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(payment.date).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleAddPayment} className="space-y-4">
        <h3 className="text-lg font-medium">Add New Payment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Amount"
              className="border rounded p-2 w-full"
              value={newPayment.amount}
              onChange={handleAmountChange}
              required
            />
            <select
              className="border rounded p-2 w-full"
              value={newPayment.debtId}
              onChange={handleDebtChange}
              required
            >
              <option value="">Select Debt</option>
              {debts.map(debt => (
                <option key={debt.id} value={debt.id}>{debt.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <input
              type="date"
              className="border rounded p-2 w-full"
              value={newPayment.date}
              onChange={e => setNewPayment({...newPayment, date: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Note"
              className="border rounded p-2 w-full"
              value={newPayment.note}
              onChange={e => setNewPayment({...newPayment, note: e.target.value})}
            />
          </div>
        </div>
        {newPayment.amount && newPayment.debtId && (
          <div className="text-sm text-gray-600">
            Interest: ${newPayment.interestAmount.toFixed(2)}, 
            Capital: ${newPayment.capitalAmount.toFixed(2)}
          </div>
        )}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Payment
        </button>
      </form>
    </div>
  );
}

export default PaymentHistory;
