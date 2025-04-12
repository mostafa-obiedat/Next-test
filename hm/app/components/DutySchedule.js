function DutySchedule({ shifts }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Duty Schedule</h2>
        <ul className="space-y-2">
          {shifts.map((shift, index) => (
            <li key={index} className="text-gray-700">
              {shift.day}: {shift.startTime} - {shift.endTime}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  module.exports = DutySchedule;