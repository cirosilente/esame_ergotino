import FlightCard from '../components/FlightCard';

function Favorites({ favorites, removeFromFavorites }) {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
          Non hai ancora voli preferiti
        </h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">I Miei Voli Preferiti</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((flight, index) => {
          // Create a unique key using multiple flight properties with fallbacks
          const uniqueKey = [
            flight.flight_iata || 'no-iata',
            flight.departure?.scheduled || 'no-time',
            flight.departure?.airport || 'no-dep',
            flight.arrival?.airport || 'no-arr',
            index // Add index as final fallback
          ].join('-');

          return (
            <FlightCard
              key={uniqueKey}
              flight={flight}
              isFavorite={true}
              onFavoriteClick={() => removeFromFavorites(flight.flight_iata)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Favorites;