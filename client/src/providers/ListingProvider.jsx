import { useState, useEffect } from "react";
import ListingsContext from "../context/ListingContext";

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
  });

  useEffect(() => {
    fetch(`/api/listings?page=${pagination.page}&limit=${pagination.limit}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data.data);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
        }));
      });
  }, [pagination.page, pagination.limit]);

  return (
    <ListingsContext.Provider
      value={{
        listings,
        filter,
        setFilter,
        pagination,
        setPagination,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}
