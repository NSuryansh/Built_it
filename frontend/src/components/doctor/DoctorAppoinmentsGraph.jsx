import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const PastAppointmentGraphs = ({ timePeriodData, getPieData, COLORS, handleGraphTypeChange, isBar, histogramData, selectedTimePeriod, handleTimePeriodChange }) => {
    return (
      <div className="py-12 mt-10">
        <div className="w-full">
          <h1 className="text-center sm:text-left text-3xl sm:text-4xl font-extrabold text-blue-600 mb-2">
            Past Appointments
          </h1>
          <p className="text-center sm:text-left text-md sm:text-lg text-gray-600 tracking-wide font-light mb-8">
            Analyze your appointment history by time period and student category
          </p>
        </div>
  
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
            
              <select
                className="form-select px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white"
                onChange={handleGraphTypeChange}
                defaultValue="pie"
              >
                
                <option value="pie">Pie Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>
  
            {/* {!isBar && (
              <div className="flex items-center mt-4 sm:mt-0">
                
                <select
                  className="form-select px-4 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white"
                  value={selectedTimePeriod}
                  onChange={handleTimePeriodChange}
                >
                  {Object.keys(timePeriodData).map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>
            )} */}
          </div>
  
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {isBar ? (
                <BarChart
                  data={histogramData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="UG" fill="#0088FE" />
                  <Bar dataKey="PG" fill="#00C49F" />
                  <Bar dataKey="PHD" fill="#FFBB28" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={getPieData(selectedTimePeriod)}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {getPieData(selectedTimePeriod).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  
export default PastAppointmentGraphs