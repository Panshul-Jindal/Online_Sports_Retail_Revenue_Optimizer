import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PricingStrategies.css";
const PricingStrategies = () => {
    const [strategies, setStrategies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items per page
  
    useEffect(() => {
      const fetchStrategies = async () => {
        const response = await axios.get("http://localhost:5000/api/admin/pricing-strategies");
        setStrategies(response.data);
      };
  
      fetchStrategies();
    }, []);
  
    const handleDecision = async (requestId, decision, approvedPercentage, approvedTimePeriod) => {
      await axios.post("http://localhost:5000/api/admin/pricing-strategies/decision", {
        requestId,
        decision,
        approvedPercentage,
        approvedTimePeriod,
      });
      setStrategies((prev) =>
        prev.map((s) =>
          s.request_id === requestId ? { ...s, admin_action: decision } : s
        )
      );
    };
  
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = strategies.filter((strategy) => strategy.admin_action === "pending").slice(indexOfFirstItem, indexOfLastItem);
  
    const totalPages = Math.ceil(strategies.filter((strategy) => strategy.admin_action === "pending").length / itemsPerPage);
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    return (
      <div>
        <h2>Pricing Strategies</h2>
        <ul>
          {currentItems.map((strategy) => (
            <li key={strategy.request_id}>
              {strategy.product_name} - {strategy.reason} - Suggested: {strategy.suggested_percentage}%
              <button onClick={() => handleDecision(strategy.request_id, "approved", strategy.suggested_percentage, "7 days")}>
                Approve
              </button>
              <button onClick={() => handleDecision(strategy.request_id, "rejected")}>Reject</button>
            </li>
          ))}
        </ul>
  
        {/* Pagination Controls */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default PricingStrategies;