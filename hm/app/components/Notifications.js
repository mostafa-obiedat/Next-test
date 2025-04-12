function Notifications({ notifications }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
        <ul className="space-y-2">
          {notifications.map((notif) => (
            <li key={notif.id} className={`text-gray-700 ${notif.read ? "opacity-50" : ""}`}>
              {notif.message} - {new Date(notif.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  module.exports = Notifications;