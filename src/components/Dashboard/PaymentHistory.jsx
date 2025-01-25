import { useState } from 'react';

function PaymentHistory({ payments, setPayments }) {
  const [newPayment, setNewPayment] = useState({ amount: '', date: '', note: '' });

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!newPayment.amount || !newPayment.date) return;

    setPayments([...payments, {
      id: Date.now(),
      amount: parseFloat(newPayment.amount),
      date: newPayment.date,
      note: newPayment.note
    }]);

    setNewPayment({ amount: '', date: '', note: '' });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>

      <div className="mb-6">
        <div className="space-y-2">
          {payments.sort((a, b) => new Date(b.date) - new Date(a.date)).map(payment => (
            <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">${payment.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{payment.note}</p>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(payment.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleAddPayment} className="space-y-4">
        <h3 className="text-lg font-medium">Add New Payment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Amount"
            className="border rounded p-2"
            value={newPayment.amount}
            onChange={e => setNewPayment({...newPayment, amount: e.target.value})}
          />
          <input
            type="date"
            className="border rounded p-2"
            value={newPayment.date}
            onChange={e => setNewPayment({...newPayment, date: e.target.value})}
          />
          <input
            type="text"
            placeholder="Note"
            className="border rounded p-2"
            value={newPayment.note}
            onChange={e => setNewPayment({...newPayment, note: e.target.value})}
          />
        </div>
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
