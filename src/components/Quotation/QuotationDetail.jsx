import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import html2pdf from "html2pdf.js";

const QuotationDetail = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [error, setError] = useState(null);
  const targetRef = useRef(null);

  useEffect(() => {
    fetch(`https://api-website.kantipurinfotech.com/api/quotations/${id}`)
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const calculateTotal = () => {
    return quotation?.items?.reduce(
      (sum, item) => sum + (parseInt(item.cost) || 0),
      0
    );
  };

  const handleDownloadPDF = () => {
    const element = targetRef.current;
    if (!element) return alert("PDF element not ready.");

    const opt = {
      margin: 0,
      filename: `Quotation_${id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!quotation) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
        >
          Save as PDF
        </button>
      </div>

      <div
        ref={targetRef}
        className="bg-white shadow rounded mx-auto flex flex-col justify-between"
        style={{ width: "794px", minHeight: "1123px", padding: "2rem" }}
      >
        <div className="flex-grow">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-blue-700">Quotation</h1>
              <p className="text-md font-bold text-gray-400 mt-2">
                Quotation{" "}
                <span className="text-black px-10">
                  #{quotation.quotation_number}
                </span>
              </p>
              <p className="text-md font-bold text-gray-400 mt-2 flex items-center gap-2">
                Quotation Date
                <input
                  type="text"
                  value={formatDate(quotation.date)}
                  disabled
                  readOnly
                  className="text-gray-800 font-semibold border-gray-300 rounded px-2 py-1"
                />
              </p>
            </div>
            <img src={logo} alt="Logo" className="w-48 h-auto -mt-4" />
          </div>

          {/* Client Info */}
          <div className="bg-gray-100 p-4 rounded mb-14 w-[350px]">
            <h2 className="text-lg font-bold mb-1">QUOTATION TO</h2>
            <input
              type="text"
              value={quotation.client_name || ""}
              readOnly
              className="bg-transparent text-gray-600 text-xl font-semibold outline-none w-full border-gray-300 p-2 rounded"
            />
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-2 bg-blue-700 text-white p-5 font-bold">
            <div className="pl-4">DESCRIPTION</div>
            <div className="text-right pr-4">SUBTOTAL</div>
          </div>

          {/* Item List */}
          {quotation.items?.map((item, index) => (
            <div key={index} className="p-4 grid grid-cols-2 bg-gray-100">
              <div>
                <div className="font-semibold text-gray-700 mb-2">
                  {item.service_name}
                </div>
                <p className="text-sm text-gray-600 max-w-[350px] break-words">
                  {item.description || "No description"}
                </p>
              </div>
              <div className="text-right text-black font-medium">
                Rs {parseInt(item.cost || 0).toLocaleString()}
                {item.unit}
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="flex justify-end mt-8">
            <div className="w-64">
              <div className="flex justify-between mb-10">
                <div className="text-gray-600">Subtotal</div>
                <div className="font-normal">
                  NRs. {calculateTotal()?.toLocaleString()}
                </div>
              </div>
              <div className="bg-blue-700 text-white p-3 font-bold flex justify-between">
                <span>TOTAL</span>
                <span>NRs. {calculateTotal()?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-800 mb-8 pt-6 border-gray-300">
          <p>www.kantipurinfotech.com</p>
          <p>Email : hello@kantipurinfotech.com</p>
          <p>Phone : +977 15244366, 9802348565</p>
          <p>New Baneshwor, Kathmandu, NP</p>
          <h3 className="font-semibold mt-4 text-black uppercase text-[13px] tracking-wide">
            Terms and Conditions
          </h3>
          <p className="text-gray-800 text-sm">
            This quotation is valid for 7 days only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;
