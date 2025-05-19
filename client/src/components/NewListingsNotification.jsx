import { useContext, useState, useEffect, useCallback } from "react";
import ListingsContext from "../context/ListingContext";
import SocketContext from "../context/SocketContext";

export default function NewListingsNotification() {
  const { newListings, clearNewListings } = useContext(SocketContext);
  const { refreshListings, setPagination, setFilter } =
    useContext(ListingsContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(newListings);
  }, [newListings]);

  const handleUpdateClick = useCallback(async () => {
    await clearNewListings();
    await setFilter("");
    await setPagination({
      page: 1,
      limit: 24,
      total: 0,
    });
    await refreshListings();
    setIsVisible(false);
  }, [clearNewListings, refreshListings, setPagination, setFilter]);

  if (!isVisible) return null;

  return (
    <div
      onClick={handleUpdateClick}
      className="fixed top-12 right-12 z-50 cursor-pointer"
    >
      <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-bounce">
        <span className="mr-2">🎉</span>
        <div>
          <p className="font-bold">New listings!</p>
        </div>
      </div>
    </div>
  );
}
