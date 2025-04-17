import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Quotation = () => {
  const navigate = useNavigate();

  const [quotationNumber, setQuotationNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [clientId, setClientId] = useState(null);
  const [clients, setClients] = useState([]);
  const [customClient, setCustomClient] = useState("");
  const [items, setItems] = useState([]);
  const [quotationDate, setQuotationDate] = useState("");

  const fetchClients = () => {
    fetch("https://api-website.kantipurinfotech.com/api/clients/")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Failed to fetch clients", err));
  };

  useEffect(() => {
    fetch("https://api-website.kantipurinfotech.com/api/quotations/")
      .then((res) => res.json())
      .then((data) => setQuotationNumber(data.quotation_number))
      .catch((err) => console.error("Failed to fetch quotation number", err));

    fetchClients();
  }, []);

  const handleCompanyNameChange = (e) => {
    const value = e.target.value;
    const selectedClient = clients.find((c) => c.id.toString() === value);
    if (value === "__custom__") {
      setClientId(null);
      setCompanyName("__custom__");
    } else if (selectedClient) {
      setClientId(selectedClient.id);
      setCompanyName(selectedClient.name);
      setCustomClient("");
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
      const response = await fetch(
        "https://api-website.kantipurinfotech.com/api/quotations/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error("API Error: " + error);
      }

      const result = await response.json();
      setQuotationNumber(result.quotation_number || quotationNumber);
      fetchClients();
      alert("Quotation generated!");
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to create quotation. See console for details.");
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (parseInt(item.price) || 0), 0);
  };

  const unitLabel =
    items.length === 0
      ? ""
      : items.some((item) => item.unit === "/m")
      ? "/m"
      : "/y";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex gap-4 justify-between items-start">
        {/* LEFT SIDE FORM */}
        <div className="w-[64%] bg-gray-50 -ml-20 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-700">
            Service Items
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-800 font-medium mb-1 px-1">
                Quotation To
              </label>
              <select
                value={clientId || ""}
                onChange={handleCompanyNameChange}
                className="appearance-none border  bg-white shadow-none  px-3 py-2 rounded h-12 w-full"
              >
                <option value="__custom__">-- Other (enter manually) --</option>
                <option value="">-- Select Client --</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {companyName === "__custom__" && (
                <input
                  type="text"
                  value={customClient}
                  onChange={(e) => setCustomClient(e.target.value)}
                  placeholder="Enter client name"
                  className="mt-2 border px-3 py-2 rounded w-full"
                />
              )}
            </div>

            <div className="text-right">
              <label className="text-gray-800 font-medium mb-1 px-2 block">
                Quotation Date
              </label>
              <input
                type="date"
                value={quotationDate}
                onChange={(e) => setQuotationDate(e.target.value)}
                className="border px-3 py-2 rounded w-44"
              />
            </div>
          </div>

          {/* Service Items Table */}
          <table className="w-full table-auto text-sm border ">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="p-2">Title</th>
                <th className="p-2">Price</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Description</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">
                    <input
                      value={item.title}
                      onChange={(e) =>
                        handleItemChange(index, "title", e.target.value)
                      }
                      className="w-full border px-2 py-1 rounded"
                      placeholder="Title"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                      className="w-24 border px-2 py-1 rounded"
                      type="number"
                      placeholder="Price"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(index, "unit", e.target.value)
                      }
                      className="border px-2 py-1 rounded"
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
                      className="w-44 border px-2 py-1 rounded"
                      placeholder="Description"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 font-bold text-xl"
                    >
                      −
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleGenerateQuotation}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Generate Quotation
            </button>
            <button
              onClick={addNewItem}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* RIGHT SIDE PREVIEW (UNCHANGED) */}
        <div
          className="w-[36%] bg-white p-8 -mr-20 rounded shadow flex flex-col justify-between"
          style={{ width: "794px", height: "1123px", maxWidth: "794px" }}
        >
          <div className="flex-grow">
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
                    type="text"
                    value={
                      quotationDate
                        ? new Date(quotationDate).toLocaleDateString("en-GB")
                        : ""
                    }
                    placeholder="DD/MM/YYYY"
                    disabled
                    readOnly
                    className="text-gray-800 font-semibold border-gray-300 rounded px-2 py-1"
                  />
                </p>
              </div>
              <img src={logo} alt="Logo" className="w-45 -mt-8" />
            </div>

            <div className="bg-gray-100 p-4 rounded mb-14 w-[350px]">
              <h2 className="text-lg font-bold mb-1">QUOTATION TO</h2>
              <p className="text-xl text-gray-700 font-semibold">
                {companyName === "__custom__"
                  ? customClient
                  : companyName || ""}
              </p>
            </div>

            <div className="grid grid-cols-2 bg-blue-700 text-white p-5 font-bold mb-2">
              <div className="pl-4">DESCRIPTION</div>
              <div className="text-right pr-4">SUBTOTAL</div>
            </div>

            {items.map((item, index) => (
              <div key={index} className="p-4 grid grid-cols-2 bg-gray-100">
                <div>
                  <div className="font-semibold text-gray-700 mb-2">
                    {item.title}
                  </div>
                  <p className="text-sm text-gray-600 max-w-[350px] break-words">
                    {item.description}
                  </p>
                </div>
                <div className="text-right text-black font-medium">
                  Rs {parseInt(item.price || 0).toLocaleString()}
                  {item.unit}
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-8">
              <div className="w-64">
                <div className="flex justify-between mb-10">
                  <div className="text-gray-600">Subtotal</div>
                  <div className="font-normal">
                    NRs. {calculateTotal().toLocaleString()} {unitLabel}
                  </div>
                </div>
                <div className="bg-blue-700 text-white p-3 font-bold flex justify-between">
                  <span>TOTAL</span>
                  <span>
                    NRs. {calculateTotal().toLocaleString()}{" "}
                    {unitLabel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-gray-800 mb-8 leading-relaxed">
            <div className="mb-6">
              <p>www.kantipurinfotech.com</p>
              <p>Email : hello@kantipurinfotech.com</p>
              <p>Phone : +977 15244366, 9802348565</p>
              <p>New Baneshwor, Kathmandu, NP</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-black uppercase text-[13px] tracking-wide">
                Terms and Conditions
              </h3>
              <p className="text-gray-800 text-sm">
                This quotation is valid for 7 days only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotation;
