import { useContext } from "react";
import ListingsContext from "../context/ListingContext";
import useFetchListings from "../hooks/useFetchListings";
import { ListingCard } from "./ListingCard";

export const ListingContainer = () => {
  const { listings } = useFetchListings();
  const { pagination, setPagination } = useContext(ListingsContext);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  console.log('listings: ', listings);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      <div className="flex justify-center items-center mt-8 gap-2">
        {pagination.page > 1 && (
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Previous
          </button>
        )}
        <span className="px-4 py-2 bg-gray-400 rounded">
          Page {pagination.page}
        </span>
        {pagination.page * pagination.limit < pagination.total && (
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </>
  );
};
