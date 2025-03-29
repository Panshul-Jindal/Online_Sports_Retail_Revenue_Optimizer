import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PricingStrategies.css";

const StockStrategies = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items per page

    useEffect(() => {
        const fetchSuggestions = async () => {
            const response = await axios.get("http://localhost:5000/api/admin/stock-strategies");
            setSuggestions(response.data);
        };

        fetchSuggestions();
    }, []);

    const handleDecision = async (suggestionId, decision, productId, suggestedPercentageChange) => {
        await axios.post("http://localhost:5000/api/admin/stock-strategies/decision", {
            suggestionId,
            decision,
            productId,
            suggestedPercentageChange,
        });
        setSuggestions((prev) =>
            prev.map((s) =>
                s.suggestion_id === suggestionId ? { ...s, admin_decision: decision } : s
            )
        );
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = suggestions.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(suggestions.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <h2>Stock Strategy Suggestions</h2>
            <ul>
                {currentItems
                    .filter((s) => s.admin_decision === "Pending")
                    .map((s) => (
                        <li key={s.suggestion_id}>
                            {s.product_name} - {s.stock_change_reason} - Suggested: {s.suggested_percentage_change}%
                            <button
                                onClick={() => {
                                    console.log(s);
                                    handleDecision(s.suggestion_id, "Accepted", s.product_id, s.suggested_percentage_change);
                                }}
                            >
                                Accept
                            </button>
                            <button
                                onClick={() =>
                                    handleDecision(s.suggestion_id, "Rejected", s.product_id, s.suggested_percentage_change)
                                }
                            >
                                Reject
                            </button>
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
export default StockStrategies;