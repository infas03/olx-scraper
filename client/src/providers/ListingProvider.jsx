import { useState, useEffect } from "react";
import ListingsContext from "../context/ListingContext";
import { useCallback } from "react";

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
  });

  const fetchListings = useCallback(() => {
    const query = new URLSearchParams({
      page: pagination.page,
      limit: pagination.limit,
      ...(searchQuery && { search: searchQuery })
    }).toString();

    fetch(`/api/listings?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data.data);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
        }));
      });
  }, [pagination.page, pagination.limit, searchQuery]);

    useEffect(() => {
    const timer = setTimeout(() => {
      if (filter) {
        setSearchQuery(filter);
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        setSearchQuery("");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filter]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <ListingsContext.Provider
      value={{
        listings,
        filter,
        setFilter,
        pagination,
        setPagination,
        refreshListings: fetchListings,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}
