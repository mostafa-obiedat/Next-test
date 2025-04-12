"use client";
const { useState } = require("react");

function Sidebar() {
  const [role] = useState("doctor"); // يفترض أن يتم تمريره من الصفحة أو Context

  return (
    <div className="w-64 bg-blue-600 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Provider Dashboard</h2>
      <ul className="space-y-4">
        <li><a href="/provider-dashboard" className="hover:bg-blue-700 p-2 rounded block">Dashboard</a></li>
        <li><a href="#" className="hover:bg-blue-700 p-2 rounded block">Patients</a></li>
        <li><a href="#" className="hover:bg-blue-700 p-2 rounded block">Appointments</a></li>
        {role === "doctor" && (
          <li><a href="#" className="hover:bg-blue-700 p-2 rounded block">Prescriptions</a></li>
        )}
        {role === "nurse" && (
          <li><a href="#" className="hover:bg-blue-700 p-2 rounded block">Duty Schedule</a></li>
        )}
        <li><a href="#" className="hover:bg-blue-700 p-2 rounded block">Notifications</a></li>
      </ul>
    </div>
  );
}

module.exports = Sidebar;