"use client";
const { useState } = require("react");

function PrescriptionForm({ patientId, doctorId }) {
  const [form, setForm] = useState({ medication: "", dosage: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, doctorId, ...form }),
    });
    if (res.ok) alert("Prescription added!");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h4 className="text-md font-medium">Add Prescription</h4>
      <input
        type="text"
        placeholder="Medication"
        value={form.medication}
        onChange={(e) => setForm({ ...form, medication: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="Dosage"
        value={form.dosage}
        onChange={(e) => setForm({ ...form, dosage: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <button className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Submit
      </button>
    </form>
  );
}

module.exports = PrescriptionForm;