import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";
import { usePDF } from "react-to-pdf";
import { useNavigate } from "react-router-dom";

const Quotation = () => {
  const targetRef = useRef();
  const { toPDF, targetRef: pdfRef } = usePDF({
    filename: `Quotation.pdf`,
    page: { width: 794, height: 1123 },
  });
  const navigate = useNavigate();

  const [quotationNumber, setQuotationNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [clientId, setClientId] = useState(null);
  const [clients, setClients] = useState([]);
  const [customClient, setCustomClient] = useState("");
  const [quotationDate, setQuotationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [items, setItems] = useState([]);
  const [savedItems, setSavedItems] = useState(items);

  const fetchClients = () => {
    fetch("http://192.168.1.15:8080/api/clients/")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Failed to fetch clients", err));
  };

  useEffect(() => {
    fetch("http://192.168.1.15:8080/api/quotations/generate-number/")
      .then((res) => res.json())
      .then((data) => setQuotationNumber(data.quotation_number))
      .catch((err) => console.error("Failed to fetch quotation number", err));

    fetchClients();
  }, []);

  const handleCompanyNameChange = (e) => {
    const value = e.target.value;
    if (value === "__custom__") {
      setCompanyName(value);
      setClientId(null);
    } else {
      const selectedClient = clients.find((c) => c.id.toString() === value);
      if (selectedClient) {
        setCompanyName(selectedClient.name);
        setClientId(selectedClient.id);
        setCustomClient("");
      }
    }
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
        unit: "/m",
        description: "",
      },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleGenerateQuotation = async () => {
    const finalClientName =
      companyName === "__custom__" ? customClient : companyName;

    if (items.length === 0) {
      alert("Please add at least one service item.");
      return;
    }

    const transformedItems = items.map((item) => ({
      service_name: item.title,
      cost: item.price,
      description: item.description,
      unit: item.unit,
    }));

    const payload = {
      quotationNumber,
      client_name: finalClientName,
      clientId: clientId,
      items: transformedItems,
      date: quotationDate,
    };

    try {
      const response = await fetch("http://192.168.1.15:8080/api/quotations/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error("API Error: " + error);
      }

      const result = await response.json();

      setQuotationNumber(result.quotation_number || quotationNumber);
      setQuotationDate(result.date || quotationDate);
      setSavedItems([...items]);

      // Refresh client list in case a new client was created
      fetchClients();

      alert("Quotation generated!");
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to create quotation. See console for details.");
    }
  };

  const calculateTotal = () => {
    return savedItems.reduce(
      (sum, item) => sum + (parseInt(item.price) || 0),
      0
    );
  };

  const handleDownloadPDF = () => {
    toPDF();
  };

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

      <div className="flex gap-4 justify-between">
        {/* Service Table */}
        <div className="w-[50%] bg-gray-50 p-4 rounded-lg shadow -ml-10">
          <h2 className="text-xl font-bold mb-4 text-blue-700">
            Service Items
          </h2>
          <table className="w-full table-auto text-sm border">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="p-2 w-40">Title</th>
                <th className="p-2 w-24">Price</th>
                <th className="p-2 w-16">Unit</th>
                <th className="p-2">Description</th>
                <th className="p-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleItemChange(index, "title", e.target.value)
                      }
                      className="w-full border px-1 py-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                      className="w-full border px-1 py-1 rounded"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(index, "unit", e.target.value)
                      }
                      className="border px-1 py-1 rounded w-full"
                    >
                      <option value="/m">/m</option>
                      <option value="/y">/y</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      rows={2}
                      className="w-full border px-1 py-1 rounded resize-none"
                      placeholder="Description"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 text-xl font-bold hover:text-red-700"
                      title="Remove"
                    >
                      −
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleGenerateQuotation}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Generate Quotation
            </button>
            <button
              onClick={addNewItem}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* Quotation Preview */}
        <div
          ref={pdfRef}
          className="w-[50%] bg-white p-8 rounded shadow"
          style={{ width: "794px", maxWidth: "100%" }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-blue-700">Quotation</h1>
              <p className="text-md font-bold text-gray-400 mt-2">
                Quotation{" "}
                <span className="text-black px-10">
                  #{quotationNumber || ""}
                </span>
              </p>
              <p className="text-md font-bold text-gray-400 mt-2 flex items-center gap-2">
                Quotation Date
                <input
                  type="date"
                  value={quotationDate}
                  onChange={(e) => setQuotationDate(e.target.value)}
                  className="text-gray-800 font-semibold  border-gray-300 rounded px-2 py-1"
                />
              </p>
            </div>
            <img src={logo} alt="Logo" className="w-45 -mt-8" />
          </div>

          <div className="bg-gray-100 p-4 rounded mb-14 w-[350px]">
            <h2 className="text-lg font-bold mb-1">QUOTATION TO</h2>
            <select
              value={
                companyName === "__custom__"
                  ? "__custom__"
                  : clients.find((c) => c.name === companyName)?.id || ""
              }
              onChange={handleCompanyNameChange}
              className="bg-transparent text-gray-600 text-xl  outline-none w-full  p-2 rounded"
            >
              <option value="">-- Select Client --</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} (ID: {client.id})
                </option>
              ))}
              <option value="__custom__">-- Other (enter manually) --</option>
            </select>

            {companyName === "__custom__" && (
              <input
                type="text"
                value={customClient}
                onChange={(e) => setCustomClient(e.target.value)}
                placeholder="Enter client name"
                className="mt-3 bg-transparent text-gray-600 text-xl font-semibold outline-none w-full  border-gray-300 p-2 rounded"
              />
            )}
          </div>

          <div>
            <div className="grid grid-cols-2 bg-blue-700 text-white p-5 font-bold">
              <div className="pl-4">Description</div>
              <div className="text-right pr-4">Price</div>
            </div>

            {savedItems.map((item, index) => (
              <div
                key={index}
                className={`p-4 grid grid-cols-2 bg-gray-100 ${
                  index === 0 ? "mt-2" : ""
                }`}
              >
                <div>
                  <div className="font-semibold text-gray-700 mb-2">
                    {item.title}
                  </div>
                  <p className="text-sm text-gray-600 max-w-[350px] break-words">
                    {item.description}
                  </p>
                </div>
                <div className="text-right text-black font-medium">
                  Rs {parseInt(item.price).toLocaleString()}
                  {item.unit}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-8">
            <div className="w-64">
              <div className="flex justify-between mb-10">
                <div className="text-gray-600">Subtotal</div>
                <div className="font-medium">
                  Rs {calculateTotal().toLocaleString()}
                </div>
              </div>
              <div className="bg-blue-700 text-white p-3 font-bold flex justify-between">
                <span>TOTAL</span>
                <span>Rs {calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-sm text-gray-700">
            <p>www.kantipurinfotech.com</p>
            <p>Email: hello@kantipurinfotech.com</p>
            <p>Phone: +977 15244366, 9802348565</p>
            <p>New Baneshwor, Kathmandu, NP</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-1">TERMS AND CONDITIONS</h3>
            <p className="text-gray-700 text-sm">
              This quotation is valid for 7 days only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotation;
