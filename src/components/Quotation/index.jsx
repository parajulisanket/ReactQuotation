import React, { useState, useRef } from "react";
import logo from "../../assets/logo.png";
import { usePDF } from "react-to-pdf";

const Quotation = () => {
  const targetRef = useRef();
  const { toPDF, targetRef: pdfRef } = usePDF({
    filename: `Quotation.pdf`,
  });
  const [quotationNumber, setQuotationNumber] = useState("2025105");
  const [companyName, setCompanyName] = useState("Leo Migrations");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([
    {
      title: "Social Media Designs",
      price: "12000",
      description:
        "Up to 15 Graphics Designs for your social media platforms. Delivery Time: Within 3 hours of order/post. Upto 3 language variations included. Additional order costs Rs 750 per post.",
    },
    {
      title: "Short Reels Editing",
      price: "32000",
      description:
        "Editing, animating the captured reels <30 sec, 4 per week. Delivery Time: Within 24 hours of order/reel. Additional order costs Rs 5000 per video.",
    },
  ]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleQuotationNumberChange = (e) => {
    setQuotationNumber(e.target.value);
  };

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addNewItem = () => {
    setItems([
      ...items,
      {
        title: "",
        price: "",
        description: "",
      },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (parseInt(item.price) || 0), 0);
  };

  const handleDownloadPDF = () => {
    toPDF();
  };

  const totalPages = Math.max(2, Math.ceil((items.length - 3) / 5) + 1);

  const getItemsForCurrentPage = () => {
    if (currentPage === 1) {
      return items.slice(0, 3);
    } else {
      const startIndex = 3 + (currentPage - 2) * 5;
      return items.slice(startIndex, startIndex + 5);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 flex justify-end">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
              clipRule="evenodd"
            />
          </svg>
          Save as PDF
        </button>
      </div>
      <div ref={pdfRef} className="max-w-4xl mx-auto p-8 bg-white">
        {currentPage === 1 ? (
          <>
            <div className="flex justify-between mb-4">
              <div>
                <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-bold text-blue-700">
                    Quotation
                  </h1>
                </div>
                <div className="mt-2 text-gray-600">
                  <p className="font-bold text-gray-500">
                    Quotation{" "}
                    <span className="ml-8 text-black">
                      #
                      <input
                        type="text"
                        value={quotationNumber}
                        onChange={handleQuotationNumberChange}
                        className="w-24 bg-transparent text-black outline-none"
                      />
                    </span>
                  </p>
                  <p className="font-bold text-gray-500">
                    Quotation Date{" "}
                    <span className="ml-2 text-black">{currentDate}</span>
                  </p>
                </div>
              </div>
              <img src={logo} alt="Kantipur Infotech" className="w-48 -mt-8" />
            </div>

            <div className="bg-gray-100 p-5 rounded-lg mb-8 max-w-[350px]">
              <h2 className="text-xl font-bold mb-1">QUOTATION TO</h2>
              <input
                type="text"
                value={companyName}
                onChange={handleCompanyNameChange}
                className="text-gray-600 font-bold text-xl bg-transparent outline-none w-full"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <div>
                <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-bold text-blue-700">
                    Quotation
                  </h1>
                </div>
                <div className="mt-2 text-gray-600">
                  <p className="font-bold text-gray-500">
                    Quotation{" "}
                    <span className="ml-8 text-black">#{quotationNumber}</span>
                  </p>
                  <p className="font-bold text-gray-500">
                    Quotation Date{" "}
                    <span className="ml-2 text-black">{currentDate}</span>
                  </p>
                </div>
              </div>
              <img src={logo} alt="Kantipur Infotech" className="w-48 -mt-8" />
            </div>

            <div className="bg-gray-100 p-5 rounded-lg mb-8 max-w-[350px]">
              <h2 className="text-xl font-bold mb-1">QUOTATION TO</h2>
              <p className="text-gray-600 font-bold text-xl">{companyName}</p>
            </div>
          </>
        )}

        <div className="mb-8 space-y-2">
          <div className="bg-blue-700 text-white grid grid-cols-2 p-4">
            <div className="font-bold mx-5">DESCRIPTION</div>
            <div className="text-right font-bold mx-5">SUBTOTAL</div>
          </div>

          {getItemsForCurrentPage().map((item, index) => (
            <div key={index} className="bg-gray-100 border-b py-6 relative">
              <div className="grid grid-cols-2 mb-2 mx-8">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    handleItemChange(
                      currentPage === 1
                        ? index
                        : 3 + (currentPage - 2) * 5 + index,
                      "title",
                      e.target.value
                    )
                  }
                  className="font-semibold bg-transparent outline-none text-gray-600"
                  placeholder="Enter title"
                />
                <div className="text-right">
                  <input
                    type="text"
                    value={`Rs ${item.price}/m`}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      handleItemChange(
                        currentPage === 1
                          ? index
                          : 3 + (currentPage - 2) * 5 + index,
                        "price",
                        value
                      );
                    }}
                    className="text-right bg-transparent outline-none w-32 font-semibold text-gray-600"
                  />
                </div>
              </div>
              <textarea
                value={item.description}
                onChange={(e) =>
                  handleItemChange(
                    currentPage === 1
                      ? index
                      : 3 + (currentPage - 2) * 5 + index,
                    "description",
                    e.target.value
                  )
                }
                className="text-gray-600 text-sm bg-transparent outline-none resize-none mx-8 w-[400px]"
                placeholder="Enter description"
                rows="2"
              />
              <button
                onClick={() =>
                  removeItem(
                    currentPage === 1
                      ? index
                      : 3 + (currentPage - 2) * 5 + index
                  )
                }
                className="absolute top-6 right-[-20px] text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}

          <button
            onClick={addNewItem}
            className="mt-4 text-[#2563EB] hover:text-blue-700 flex items-center gap-2"
          >
            <span className="text-2xl">+</span> Add Item
          </button>
        </div>

        <div className="flex justify-end text-gray-500 mb-8 items-center gap-2">
          Page
          <input
            type="number"
            value={currentPage}
            min={1}
            max={totalPages}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 1 && value <= totalPages) {
                setCurrentPage(value);
              }
            }}
            className="w-12 text-center border border-gray-300 rounded px-1"
          />
          of {totalPages}
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className={`px-2 py-1 rounded ${
                currentPage > 1
                  ? "text-blue-700 hover:bg-blue-50"
                  : "text-gray-300"
              }`}
            >
              ←
            </button>
            <button
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              className={`px-2 py-1 rounded ${
                currentPage < totalPages
                  ? "text-blue-700 hover:bg-blue-50"
                  : "text-gray-300"
              }`}
            >
              →
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end mt-20 mb-16">
          <div className="w-64">
            <div className="flex justify-between mb-4">
              <div>Subtotal</div>
              <div>NRs. {calculateTotal().toLocaleString()}/m</div>
            </div>

            <div className="bg-blue-700 text-white p-4 flex justify-between font-bold">
              <div>TOTAL</div>
              <div>NRS. {calculateTotal().toLocaleString()}/M</div>
            </div>
          </div>
        </div>

        <div className="text-gray-600 mb-8">
          <input
            type="text"
            defaultValue="www.kantipurinfotech.com"
            className="bg-transparent outline-none w-full"
          />
          <input
            type="text"
            defaultValue="Email : hello@kantipurinfotech.com"
            className="bg-transparent outline-none w-full"
          />
          <input
            type="text"
            defaultValue="Phone : +977 15244366, 9802348565"
            className="bg-transparent outline-none w-full"
          />
          <input
            type="text"
            defaultValue="New Baneshwor, Kathmandu, NP"
            className="bg-transparent outline-none w-full"
          />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">TERMS AND CONDITIONS</h3>
          <textarea
            defaultValue="This quotation is valid for 7 days only."
            className="text-gray-600 w-full bg-transparent outline-none resize-none"
            rows="2"
          />
        </div>
      </div>
    </>
  );
};

export default Quotation;
