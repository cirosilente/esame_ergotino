import { FaHeart, FaTrash } from 'react-icons/fa';

function FlightCard({ flight, isFavorite, onFavoriteClick }) {
  if (!flight) return null;

  const flightNumber = flight.flight_iata || 'N/A';
  const airlineName = flight.airline?.name || 'Compagnia non disponibile';
  const departureAirport = flight.departure?.airport || 'N/A';
  const arrivalAirport = flight.arrival?.airport || 'N/A';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            {flight.flight_iata}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            {flight.airline?.name || 'Compagnia non disponibile'}
          </p>
        </div>
        <button
          onClick={onFavoriteClick}
          className={`p-1.5 sm:p-2 rounded-full transition-colors duration-200 ${
            isFavorite 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-400 hover:text-red-500'
          }`}
          title={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        >
          {isFavorite ? (
            <FaTrash className="text-lg sm:text-xl" />
          ) : (
            <FaHeart className="text-lg sm:text-xl" />
          )}
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm sm:text-base">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Partenza</p>
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              {flight.departure.airport}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {new Date(flight.departure.scheduled).toLocaleString('it-IT')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Arrivo</p>
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              {flight.arrival.airport}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {new Date(flight.arrival.scheduled).toLocaleString('it-IT')}
            </p>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Stato: <span className="font-semibold">{flight.flight_status}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FlightCard;