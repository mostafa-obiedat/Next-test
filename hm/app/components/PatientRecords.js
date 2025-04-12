"use client";
const PrescriptionForm = require("./PrescriptionForm");
const ReportUpload = require("./ReportUpload");
const VitalSignsForm = require("./VitalSignsForm");

function PatientRecords({ patient, user }) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-800">{patient.name}</h3>
      <p>Medical History: {patient.medicalHistory.length} entries</p>
      {user.role === "doctor" && (
        <>
          <PrescriptionForm patientId={patient.id} doctorId={user.id} />
          <ReportUpload patientId={patient.id} doctorId={user.id} />
        </>
      )}
      {user.role === "nurse" && (
        <VitalSignsForm patientId={patient.id} />
      )}
    </div>
  );
}

module.exports = PatientRecords;