import { FaHeart, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';

function FlightCard({ flight, isFavorite, onFavoriteClick }) {
  if (!flight) return null;

  // Migliore estrazione dei dati con più controlli
  const flightInfo = {
    number: flight.flight?.iata || flight.flight_iata || 'N/A',
    airline: {
      name: flight.airline?.name || 'N/A',
      iata: flight.airline?.iata || 'N/A'
    },
    departure: {
      airport: flight.departure?.airport || 'N/A',
      iata: flight.departure?.iata || 'N/A',
      terminal: flight.departure?.terminal || 'N/A',
      gate: flight.departure?.gate || 'N/A',
      time: flight.departure?.scheduled ? 
        new Date(flight.departure.scheduled).toLocaleString('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'N/A'
    },
    arrival: {
      airport: flight.arrival?.airport || 'N/A',
      iata: flight.arrival?.iata || 'N/A',
      terminal: flight.arrival?.terminal || 'N/A',
      gate: flight.arrival?.gate || 'N/A',
      time: flight.arrival?.scheduled ? 
        new Date(flight.arrival.scheduled).toLocaleString('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'N/A'
    },
    status: flight.flight_status || 'N/A'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
            {flightInfo.airline.name} ({flightInfo.number})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Codice compagnia: {flightInfo.airline.iata}
          </p>
        </div>
        <button
          onClick={onFavoriteClick}
          className={`p-2 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'text-red-500 hover:text-red-600 hover:scale-110' 
              : 'text-gray-400 hover:text-red-500 hover:scale-110'
          }`}
          title={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        >
          {isFavorite ? (
            <FaTrash className="text-xl" />
          ) : (
            <FaHeart className="text-xl" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">Partenza</p>
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {flightInfo.departure.airport} ({flightInfo.departure.iata})
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            Terminal: {flightInfo.departure.terminal}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            Gate: {flightInfo.departure.gate}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {flightInfo.departure.time}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 dark:text-gray-400 mb-1">Arrivo</p>
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {flightInfo.arrival.airport} ({flightInfo.arrival.iata})
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            Terminal: {flightInfo.arrival.terminal}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            Gate: {flightInfo.arrival.gate}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {flightInfo.arrival.time}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Stato: <span className="font-semibold capitalize">{flightInfo.status}</span>
        </p>
      </div>
    </div>
  );
}
FlightCard.propTypes = {
  flight: PropTypes.shape({
    flight: PropTypes.shape({
      iata: PropTypes.string,
    }),
    flight_iata: PropTypes.string,
    airline: PropTypes.shape({
      name: PropTypes.string,
      iata: PropTypes.string,
    }),
    departure: PropTypes.shape({
      airport: PropTypes.string,
      iata: PropTypes.string,
      terminal: PropTypes.string,
      gate: PropTypes.string,
      scheduled: PropTypes.string,
    }),
    arrival: PropTypes.shape({
      airport: PropTypes.string,
      iata: PropTypes.string,
      terminal: PropTypes.string,
      gate: PropTypes.string,
      scheduled: PropTypes.string,
    }),
    flight_status: PropTypes.string,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onFavoriteClick: PropTypes.func.isRequired,
};

export default FlightCard;