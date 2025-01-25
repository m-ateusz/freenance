import { useState } from 'react';

function DebtOverview({ totalDebt, totalPaid, debts, setDebts }) {
  const [newDebt, setNewDebt] = useState({ 
    name: '', 
    amount: '', 
    monthlyPayment: '',
    interestRate: '' 
  });
  
  const handleAddDebt = (e) => {
    e.preventDefault();
    if (!newDebt.name || !newDebt.amount || !newDebt.monthlyPayment) return;
    
    setDebts([...debts, {
      id: Date.now(),
      name: newDebt.name,
      amount: parseFloat(newDebt.amount),
      monthlyPayment: parseFloat(newDebt.monthlyPayment),
      interestRate: parseFloat(newDebt.interestRate) || 0,
      dateAdded: new Date().toISOString()
    }]);
    
    setNewDebt({ name: '', amount: '', monthlyPayment: '', interestRate: '' });
  };

  const totalMonthlyPayments = debts.reduce((sum, debt) => sum + (debt.monthlyPayment || 0), 0);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Debt Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-md">
          <h3 className="text-sm font-medium opacity-80">Total Debt</h3>
          <p className="text-3xl font-bold">${totalDebt.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-md">
          <h3 className="text-sm font-medium opacity-80">Total Paid</h3>
          <p className="text-3xl font-bold">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-md">
          <h3 className="text-sm font-medium opacity-80">Monthly Payments</h3>
          <p className="text-3xl font-bold">${totalMonthlyPayments.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Debts</h3>
        <div className="space-y-3">
          {debts.map(debt => (
            <div key={debt.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="mb-2 md:mb-0">
                <p className="font-semibold text-gray-800">{debt.name}</p>
                <p className="text-sm text-gray-500">
                  Interest: {debt.interestRate}% | Monthly Payment: ${debt.monthlyPayment.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold text-lg text-gray-800">
                ${debt.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleAddDebt} className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-700">Add New Debt</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Debt Name</label>
            <input
              type="text"
              placeholder="Credit Card, Loan, etc."
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newDebt.name}
              onChange={e => setNewDebt({...newDebt, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
            <input
              type="number"
              placeholder="Total debt amount"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newDebt.amount}
              onChange={e => setNewDebt({...newDebt, amount: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment</label>
            <input
              type="number"
              placeholder="Monthly payment amount"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newDebt.monthlyPayment}
              onChange={e => setNewDebt({...newDebt, monthlyPayment: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
            <input
              type="number"
              placeholder="Annual interest rate"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newDebt.interestRate}
              onChange={e => setNewDebt({...newDebt, interestRate: e.target.value})}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Add Debt
        </button>
      </form>
    </div>
  );
}

export default DebtOverview;
