export default function PaymentStatus({ status }) {
    const statusConfig = {
      pending: {
        text: 'Pending Payment',
        color: 'bg-yellow-100 text-yellow-800',
        icon: '⏳'
      },
      paid: {
        text: 'Payment Completed',
        color: 'bg-green-100 text-green-800',
        icon: '✓'
      },
      failed: {
        text: 'Payment Failed',
        color: 'bg-red-100 text-red-800',
        icon: '✗'
      },
      refunded: {
        text: 'Refunded',
        color: 'bg-blue-100 text-blue-800',
        icon: '↩️'
      },
      default: {
        text: 'Unknown Status',
        color: 'bg-gray-100 text-gray-800',
        icon: '❓'
      }
    };
  
    const currentStatus = statusConfig[status] || statusConfig.default;
  
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}>
        <span className="mr-2">{currentStatus.icon}</span>
        {currentStatus.text}
      </span>
    );
  }