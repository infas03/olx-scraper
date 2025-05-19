import useFetchListings from '../hooks/useFetchListings'
import { ListingCard } from './ListingCard'

export const ListingContainer = () => {
  const { listings } = useFetchListings()

  console.log('listings: ', listings);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}