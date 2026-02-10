import React, { forwardRef } from "react";

export const Report = forwardRef(function Report({ stats }, ref) {
  if (!stats) return null;
  console.log(stats);
  return (
    <div ref={ref} className="p-10 bg-white text-black w-[800px]">
      <h1 className="text-3xl font-bold mb-6">INVOICE</h1>

      <div className="mb-6">
        <p>
          <strong>Order No:</strong> {1}
        </p>
        <p>
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </p>
        <p>
          <strong>Status:</strong> {1}
        </p>
      </div>

      <hr className="my-4" />

      <h3 className="font-bold mb-2">Customer</h3>
      <p>ABC</p>
      <p>b</p>
      <p>9</p>

      <hr className="my-4" />

      <table className="w-full border border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">Product</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(3)].map((item) => (
            <tr key={item}>
              <td className="border p-2">abc</td>
              <td className="border p-2 text-center">dj</td>
              <td className="border p-2 text-right">
                ₹{Number(10).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mt-6 text-xl font-bold">
        Total: ₹{Number(30).toFixed(2)}
      </div>
    </div>
  );
});
