import React from "react";

function QuotationItem({ item }) {
  return (
    <div className="flex justify-between items-start bg-gray-50 px-4 rounded-md shadow-sm">
      <div className="text-gray-800">
        <h3 className="font-semibold text-base">{item.title}</h3>
        <p className="text-sm mt-1 whitespace-pre-line">{item.description}</p>
      </div>
      <div className="text-right font-semibold text-gray-900 whitespace-nowrap">
        Rs {parseFloat(item.price).toLocaleString()}/m
      </div>
    </div>
  );
}

export default QuotationItem;
