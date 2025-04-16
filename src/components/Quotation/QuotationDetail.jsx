import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QuotationDetail = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://192.168.1.15:8080/api/quotations/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch quotation.");
        return res.json();
      })
      .then((data) => setQuotation(data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load quotation.");
      });
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!quotation) return <p>Loading...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Quotation{" "}
        <span className="text-black px-2"> #{quotation.quotation_number}</span>
      </h1>
      <p>
        <strong>Client:</strong> {quotation.client_name}
      </p>
      <p>
        <strong>Total Amount:</strong> Rs {quotation.total_amount}
      </p>
      <p>
        <strong>Date:</strong> {quotation.date || "Not provided"}
      </p>

      <h2 className="text-xl mt-6 mb-2">Service Items</h2>
      {quotation.items?.length > 0 ? (
        <ul className="list-disc list-inside">
          {quotation.items.map((item) => (
            <li key={item.id} className="mb-2">
              <strong>{item.service_name}</strong> — Rs {item.cost}
              <br />
              <small>{item.description || "No description"}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No service items found.</p>
      )}
    </div>
  );
};

export default QuotationDetail;
