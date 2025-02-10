import FlightCard from '../components/FlightCard';
import PropTypes from 'prop-types';

function Favorites({ favorites = [], removeFromFavorites }) {
  // Aggiungi controllo di tipo
  if (!Array.isArray(favorites)) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
          Errore nel caricamento dei preferiti
        </h2>
      </div>
    );
  }

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
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        I Miei Voli Preferiti
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((flight, index) => (
          <FlightCard
            key={`${flight.flight_iata}-${index}`}
            flight={flight}
            isFavorite={true}
            onFavoriteClick={() => removeFromFavorites(flight.flight_iata)}
          />
        ))}
      </div>
    </div>
  );
}
Favorites.propTypes = {
  favorites: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeFromFavorites: PropTypes.func.isRequired,
};

export default Favorites;