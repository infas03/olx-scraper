import { useContext } from 'react'
import ListingsContext from '../context/ListingContext'

export default function FilterBar() {
  const { filter, setFilter } = useContext(ListingsContext)

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search listings..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}