import { useState, useEffect } from 'react';
import ListingsContext from '../context/ListingContext';

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => setListings(data));
  }, []);

  return (
    <ListingsContext.Provider value={{ listings, filter, setFilter }}>
      {children}
    </ListingsContext.Provider>
  );
}
