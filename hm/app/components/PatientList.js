"use client";
const { useState } = require("react");
const PatientRecords = require("./PatientRecords");

function PatientList({ patients, user }) {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Patients</h2>
      <ul className="space-y-2">
        {patients.map((patient) => (
          <li
            key={patient.id}
            className="p-2 hover:bg-gray-100 rounded cursor-pointer"
            onClick={() => setSelectedPatient(patient)}
          >
            {patient.name}
          </li>
        ))}
      </ul>
      {selectedPatient && <PatientRecords patient={selectedPatient} user={user} />}
    </div>
  );
}

module.exports = PatientList;