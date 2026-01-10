import { useState } from "react";

const PROGRAMS = ["BTech", "Masters", "PhD"];
const YEARS = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
const DEPARTMENTS = ["CSE", "EE", "ME", "CE", "MEMS"];

export default function AddBatchPopup({ onAdd, onClose }) {
  const [batch, setBatch] = useState({
    program: "",
    year: "",
    dept: "",
  });

  const handleAdd = () => {
    if (!batch.program || !batch.year || !batch.dept) {
      alert("Please select all fields");
      return;
    }
    onAdd(batch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Add Batch</h3>

        {/* Program */}
        <select
          className="mb-3 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={batch.program}
          onChange={e => setBatch({ ...batch, program: e.target.value })}
        >
          <option value="">Select Program</option>
          {PROGRAMS.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Year */}
        <select
          className="mb-3 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={batch.year}
          onChange={e => setBatch({ ...batch, year: Number(e.target.value) })}
        >
          <option value="">Select Year</option>
          {YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Department */}
        <select
          className="mb-5 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={batch.dept}
          onChange={e => setBatch({ ...batch, dept: e.target.value })}
        >
          <option value="">Select Department</option>
          {DEPARTMENTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
