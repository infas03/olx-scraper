import { useContext } from "react";
import ListingsContext from "../context/ListingContext";

export default function useFetchListings() {
  const { listings, filter, pagination } = useContext(ListingsContext);
  
  const filteredListings = listings.filter(listing => 
    listing?.title?.toLowerCase().includes(filter.toLowerCase()) ||
    listing?.location?.toLowerCase().includes(filter.toLowerCase())
  );

  return { 
    listings: filteredListings,
    pagination
  };
}