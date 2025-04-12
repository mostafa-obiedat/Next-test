"use client";
const { useState } = require("react");

function VitalSignsForm({ patientId }) {
  const [form, setForm] = useState({ type: "", value: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/patients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, vitalSigns: [form] }),
    });
    if (res.ok) alert("Vital signs updated!");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h4 className="text-md font-medium">Update Vital Signs</h4>
      <input
        type="text"
        placeholder="Type (e.g., BP)"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        placeholder="Value"
        value={form.value}
        onChange={(e) => setForm({ ...form, value: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />
      <button className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Submit
      </button>
    </form>
  );
}

module.exports = VitalSignsForm;