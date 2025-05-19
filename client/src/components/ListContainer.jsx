import { memo, useCallback, useContext } from "react";
import ListingsContext from "../context/ListingContext";
import useFetchListings from "../hooks/useFetchListings";
import { ListingCard } from "./ListingCard";
import PaginationButton from "./PaginationButton";

export const ListingContainer = memo(() => {
  const { listings } = useFetchListings();
  const { pagination, setPagination } = useContext(ListingsContext);

  const handlePageChange = useCallback(
    (newPage) => {
      setPagination((prev) => ({
        ...prev,
        page: newPage,
      }));
    },
    [setPagination]
  );

  const hasPrevious = pagination.page > 1;
  const hasNext = pagination.page * pagination.limit < pagination.total;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  console.log("listings: ", listings);

  return (
    <div className="space-y-6">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative min-h-[300px]"        
        key={`listings-page-${pagination.page}`}
      >
        {listings.map((listing) => (
          <ListingCard
            key={`${listing.id}-${pagination.page}`}
            listing={listing}
            className="transition-transform hover:scale-[1.02] duration-200"
          />
        ))}
        {listings.length === 0 && (
          <div className="fixed top-72 left-1/2 transform -translate-x-1/2 bg-gray-500 px-8 py-4 rounded-lg z-50 shadow-2xl">
            <span className="text-white text-lg font-bold">
              No listings found!
            </span>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <PaginationButton
            disabled={!hasPrevious}
            onClick={() => handlePageChange(pagination.page - 1)}
            label="<"
          />

          <span className="px-4 py-2 bg-gray-400 rounded text-sm">
            Page {pagination.page} of {totalPages}
          </span>

          <PaginationButton
            disabled={!hasNext}
            onClick={() => handlePageChange(pagination.page + 1)}
            label=">"
          />
        </div>
      )}
    </div>
  );
});
