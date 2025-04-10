import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PastAppointmentGraphs = ({
  handleGraphTypeChange,
  isBar,
  timePeriodData,
  histogramData,
  getPieData,
  COLORS
}) => {
  return (
    <div className="mt-20">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-10 border border-blue-100 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-blue-600">
            Past Appointments Analysis
          </h2>
          <select
            onChange={handleGraphTypeChange}
            value={isBar ? "bar" : "pie"}
            className="px-4 mt-4 md:mt-0 py-2 border border-blue-200 rounded-lg bg-white/50 backdrop-blur-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="bar">Bar Graph</option>
            <option value="pie">Pie Charts</option>
          </select>
        </div>

        {isBar ? (
          <div className="h-96 w-full">
            <ResponsiveContainer>
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={14} />
                <YAxis stroke="#6b7280" fontSize={14} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    border: "1px solid rgba(229, 231, 235, 0.5)",
                  }}
                />
                <Legend />
                <Bar dataKey="UG" fill={COLORS[0]} radius={[8, 8, 0, 0]} />
                <Bar dataKey="PG" fill={COLORS[1]} radius={[8, 8, 0, 0]} />
                <Bar dataKey="PHD" fill={COLORS[2]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {Object.keys(timePeriodData).map((period) => (
              <div key={period} className="h-86 w-[340px]">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  {period}
                </h3>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={getPieData(period)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {getPieData(period).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastAppointmentGraphs;
