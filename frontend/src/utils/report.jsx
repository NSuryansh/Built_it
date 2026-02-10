import React, { forwardRef } from "react";

export const Report = forwardRef(function Report({ stats }, ref) {
  if (!stats || !Array.isArray(stats)) return null;

  const aggregateData = () => {
    const categories = {};
    const gender = {};
    const acadProg = {};
    let totalCases = 0;
    let emergencyCount = 0;

    stats.forEach((user) => {
      totalCases += user.stats.total || 0;
      emergencyCount += user.stats.isEmergencyCount || 0;

      Object.entries(user.stats.categories || {}).forEach(([cat, count]) => {
        categories[cat] = (categories[cat] || 0) + count;
      });

      Object.entries(user.stats.demographics?.gender || {}).forEach(
        ([g, count]) => {
          gender[g] = (gender[g] || 0) + count;
        },
      );

      Object.entries(user.stats.demographics?.acadProg || {}).forEach(
        ([prog, count]) => {
          acadProg[prog] = (acadProg[prog] || 0) + count;
        },
      );
    });

    return { categories, gender, acadProg, totalCases, emergencyCount };
  };

  const totals = aggregateData();

  return (
    <div ref={ref} className="p-10 bg-white text-black w-[900px] font-sans">
      <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter">
            CASE STATISTICS REPORT
          </h1>
          <p className="text-sm text-gray-500 font-mono uppercase">
            Report ID: {Math.random().toString(36).substr(2, 9)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400">GENERATED</p>
          <p className="text-lg font-bold">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-10">
        <div className="border-l-4 border-red-600 pl-4 py-2 bg-red-50">
          <p className="text-xs font-bold text-red-800 uppercase">Emergency</p>
          <p className="text-3xl font-bold">{totals.emergencyCount}</p>
        </div>
        <div className="border-l-4 border-black pl-4 py-2 bg-gray-50">
          <p className="text-xs font-bold text-gray-500 uppercase">
            Total Cases
          </p>
          <p className="text-3xl font-bold">{totals.totalCases}</p>
        </div>
        <div className="border-l-4 border-black pl-4 py-2 bg-gray-50">
          <p className="text-xs font-bold text-gray-500 uppercase">Personnel</p>
          <p className="text-3xl font-bold">{stats.length}</p>
        </div>
        <div className="border-l-4 border-black pl-4 py-2 bg-gray-50">
          <p className="text-xs font-bold text-gray-500 uppercase">Active</p>
          <p className="text-3xl font-bold">
            {stats.filter((u) => u.stats.total > 0).length}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-black"></span> PERSONNEL BREAKDOWN
      </h2>
      <table className="w-full mb-10 border-collapse border border-gray-300">
        <thead className="bg-gray-100 uppercase text-[10px] font-bold">
          <tr>
            <th className="border p-3 text-left">ID</th>
            <th className="border p-3 text-left">Contributor</th>
            <th className="border p-3 text-center">New</th>
            <th className="border p-3 text-center">Open</th>
            <th className="border p-3 text-center">Closed</th>
            <th className="border p-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {stats.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border p-3 text-gray-400 font-mono">{user.id}</td>
              <td className="border p-3 font-semibold">
                {user.name} <br />
                <span className="text-[10px] font-normal text-gray-500 italic">
                  {user.email}
                </span>
              </td>
              <td className="border p-3 text-center">
                {user.stats.status.NEW}
              </td>
              <td className="border p-3 text-center">
                {user.stats.status.OPEN}
              </td>
              <td className="border p-3 text-center">
                {user.stats.status.CLOSED}
              </td>
              <td className="border p-3 text-right font-bold">
                {user.stats.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-10">
        <div>
          <h3 className="font-bold border-b-2 border-black mb-3 pb-1 text-sm uppercase">
            Case Categories
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(totals.categories).map(([name, count]) => (
                <tr key={name} className="border-b border-gray-100">
                  <td className="py-2">{name}</td>
                  <td className="py-2 text-right font-bold text-gray-600">
                    {count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="font-bold border-b-2 border-black mb-3 pb-1 text-sm uppercase">
            Demographics
          </h3>
          <div className="space-y-6">
            <section>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Gender Distribution
              </p>
              {Object.entries(totals.gender).map(([label, val]) => (
                <div
                  key={label}
                  className="flex justify-between items-center text-sm mb-1"
                >
                  <span>{label}</span>
                  <span className="font-mono bg-gray-100 px-2 rounded font-bold">
                    {val}
                  </span>
                </div>
              ))}
            </section>
            <section>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Academic Programs
              </p>
              {Object.entries(totals.acadProg).map(([label, val]) => (
                <div
                  key={label}
                  className="flex justify-between items-center text-sm mb-1"
                >
                  <span>{label}</span>
                  <span className="font-mono bg-gray-100 px-2 rounded font-bold">
                    {val}
                  </span>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center border-t pt-4 border-dotted">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
          End of Official Case Statistics Report - Confidential
        </p>
      </div>
    </div>
  );
});
