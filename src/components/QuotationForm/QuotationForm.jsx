import React, { useState } from "react";

function QuotationForm({ onAddItem }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price) return;
    onAddItem({ title, description, price });
    setTitle("");
    setDescription("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Title
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Social Media Designs"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Description
        </label>
        <textarea
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about delivery time, variation, etc."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price (NRs)
        </label>
        <input
          type="number"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 12000"
          required
        />
      </div>
      <div className="pt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Add to Quotation
        </button>
      </div>
    </form>
  );
}

export default QuotationForm;
