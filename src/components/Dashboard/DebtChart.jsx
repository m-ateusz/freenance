import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DebtChart({ debts, payments }) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return date.toLocaleString('default', { month: 'short' });
  });

  const paymentsByMonth = months.map(month => {
    return payments
      .filter(payment => {
        const paymentMonth = new Date(payment.date)
          .toLocaleString('default', { month: 'short' });
        return paymentMonth === month;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Payments',
        data: paymentsByMonth,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Payment History'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)'
        }
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <Line data={data} options={options} />
    </div>
  );
}

export default DebtChart;
