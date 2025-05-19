import defaultPic from '../assets/default.svg';

export const ListingCard = ({ listing }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={listing.image !== 'N/A' ? listing.image : defaultPic}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-black font-bold text-lg mb-1 truncate">
          {listing.title}
        </h3>
        <p className="text-green-600 font-semibold mb-2">{listing.price}</p>
        <p className="text-gray-600 text-sm mb-1">{listing.location}</p>
        <p className="text-gray-500 text-xs">{listing.date}</p>
        <a
          href={listing.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View on OLX
        </a>
      </div>
    </div>
  );
};
