import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quotation from "./components/Quotation";
import QuotationDetail from "./components/Quotation/QuotationDetail";
import AllQuotations from "./components/Quotation/AllQuotations";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 py-2 rounded-lg">
        <Routes>
          <Route path="/" element={<Quotation />} />
          <Route path="/all-quotations" element={<AllQuotations />} />{" "}
          <Route path="/quotation/:id" element={<QuotationDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
