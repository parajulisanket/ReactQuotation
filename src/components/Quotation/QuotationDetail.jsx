import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import html2pdf from "html2pdf.js";

const getLabelFromValue = (value) => {
  const unitOptions = [
    { label: "/m", value: "Monthly" },
    { label: "/q", value: "Quarterly" },
    { label: "/y", value: "Yearly" },
    { label: "/lt", value: "Lifetime" },
  ];
  const found = unitOptions.find((opt) => opt.value === value);
  return found ? found.label : value;
};

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

  const getUnitLabel = () => {
    const validUnits = quotation?.items
      ?.map((item) => item.duration)
      .filter(Boolean);
    if (!validUnits?.length) return "";
    const frequency = {};
    validUnits.forEach((unit) => {
      frequency[unit] = (frequency[unit] || 0) + 1;
    });
    return Object.entries(frequency).sort((a, b) => b[1] - a[1])[0][0];
  };

  const handleDownloadPDF = () => {
    const element = targetRef.current;
    if (!element) return alert("PDF element not ready.");

    const opt = {
      margin: 0,
      filename: `Quotation_${id}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "px", format: [794, 1123], orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!quotation) return <p>Loading...</p>;

  const unitLabel = getLabelFromValue(getUnitLabel());

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-700 text-white px-4 py-1 text-sm rounded hover:bg-blue-800"
        >
          Save as PDF
        </button>
      </div>

      <div
        ref={targetRef}
        className="relative bg-white mx-auto border shadow"
        style={{
          width: "794px",
          height: "1123px",
          padding: "20px",
          fontSize: "10px",
          lineHeight: "1.2",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mx-8  my-4 ">
          <div>
            <h1 className="text-3xl font-bold text-[#034cc6] mb-4">
              Quotation
            </h1>
            <p className="text-[#969696] font-bold mt-2 text-[12px]">
              Quotation{" "}
              <span className="text-black mx-12">
                #{quotation.quotation_number}
              </span>
            </p>
            <p className="text-[#969696] font-bold mt-2 text-[12px]">
              Quotation Date{" "}
              <span className="text-black mx-4">
                {" "}
                {formatDate(quotation.date)}
              </span>
            </p>
          </div>
          <img src={logo} alt="Logo" className="w-40  h-auto" />
        </div>

        {/* Quotation To */}
        <div className="bg-[#f4f6fd] rounded-md mx-8 px-4 py-4 mb-6 w-80">
          <p className="font-bold text-sm text-[#2c2c2c]">QUOTATION TO</p>
          <p className="text-sm font-bold text-[#545454]">
            {quotation.client_name || ""}
          </p>
        </div>

        {/* Table */}
        <div className="grid grid-cols-2 bg-[#034cc6] text-white font-bold mx-8 px-6 py-5 mb-2 text-[14px]">
          <div>DESCRIPTION</div>
          <div className="text-right">SUBTOTAL</div>
        </div>

        <div className="mx-8">
          {quotation.items?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-2 bg-[#f6f8fc] px-6 py-2 "
            >
              <div>
                <p className="font-semibold text-[12px] pb-1 text-[#2c2c2c]">
                  {item.service_name}
                </p>
                <p className="text-[#545454] font-medium pb-2 break-words">
                  {item.description || "No description"}
                </p>
              </div>
              <div className="text-right text-[#2c2c2c] font-semibold text-[11px]">
                Rs {parseInt(item.cost || 0).toLocaleString()}{" "}
                {getLabelFromValue(item.duration)}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-end mt-10 pr-8">
          <div className="w-48">
            <div className="flex justify-between text-sm mb-6">
              <span className="text-gray-600">Subtotal</span>
              <span>
                NRs. {calculateTotal()?.toLocaleString()} {unitLabel}
              </span>
            </div>
            <div className="bg-[#034cc6] text-white p-4 px-4 font-bold flex justify-between text-xs">
              <span>TOTAL</span>
              <span>
                NRs. {calculateTotal()?.toLocaleString()}{" "}
                {unitLabel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div
          className="absolute bottom-6 left-6 right-6 text-[#454545] text-[9px] pt-2 mb-4 mx-8"
          style={{ fontSize: "12px", lineHeight: "1.3" }}
        >
          <p>www.kantipurinfotech.com</p>
          <p>Email: hello@kantipurinfotech.com</p>
          <p>Phone: +977 15244366, 9802348565</p>
          <p>New Baneshwor, Kathmandu, NP</p>
          <h3 className="font-bold uppercase mt-4 text-[#2c2c2c]">
            Terms and Conditions
          </h3>
          <p>This quotation is valid for 7 days only.</p>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;
