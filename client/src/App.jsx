import './App.css'
import FilterBar from './components/FilterBar'
import { ListingContainer } from './components/ListContainer'
import { ListingsProvider } from './providers/ListingProvider'

function App() {
  return (
    <ListingsProvider>
      <div className="min-h-screen bg-gray-50 p-4 rounded-xl">
        <div className="min-w-6xl mx-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">OLX Listings</h1>
          <FilterBar />
          <ListingContainer />
        </div>
      </div>
    </ListingsProvider>
  )
}

export default App
