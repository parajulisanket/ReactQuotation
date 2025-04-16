import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllQuotations = () => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    fetch("http://192.168.1.15:8080/api/quotations/")
      .then((res) => res.json())
      .then((data) => setQuotations(data))
      .catch((err) => console.error("Failed to load quotations", err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">All Quotations</h1>

      {quotations.length === 0 ? (
        <p className="text-gray-600">No quotations found.</p>
      ) : (
        <table className="w-full table-auto border shadow rounded bg-white">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-2 border">S.N.</th>
              <th className="p-2 border">Quotation ID</th>
              <th className="p-2 border">Quotation #</th>
              <th className="p-2 border">Client Name</th>
              <th className="p-2 border">Client ID</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border text-right">Total (Rs)</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q, index) => {
              const total = q.items?.reduce((sum, item) => {
                const price = parseFloat(item.price || item.cost || "0");
                return sum + (isNaN(price) ? 0 : price);
              }, 0);

              return (
                <tr key={q.id} className="border-t">
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border text-center">{q.id}</td>
                  <td className="p-2 border text-center">
                    {q.quotation_number || "-"}
                  </td>
                  <td className="p-2 border">{q.client_name || "N/A"}</td>
                  <td className="p-2 border text-center">{q.client ?? "-"}</td>
                  <td className="p-2 border text-center">
                    {q.date
                      ? new Date(q.date).toLocaleDateString()
                      : new Date(q.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-right">
                    Rs{" "}
                    {parseFloat(q.total_amount || total || 0).toLocaleString()}
                  </td>
                  <td className="p-2 border text-center">
                    <Link
                      to={`/quotation/${q.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllQuotations;
