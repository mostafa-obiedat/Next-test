"use client";
const { useState } = require("react");

function ReportUpload({ patientId, doctorId }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", patientId);
    formData.append("doctorId", doctorId);
    formData.append("title", "Medical Report");

    const res = await fetch("/api/reports", {
      method: "POST",
      body: formData,
    });
    if (res.ok) alert("Report uploaded!");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h4 className="text-md font-medium">Upload Report</h4>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full p-2 border rounded mb-2"
      />
      <button className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Upload
      </button>
    </form>
  );
}

module.exports = ReportUpload;