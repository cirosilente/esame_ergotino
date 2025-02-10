import { useState, useEffect } from 'react';
import axios from 'axios';
import FlightCard from '../components/FlightCard';

const API_KEY = import.meta.env.VITE_AVIATION_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

if (!API_KEY || !API_URL) {
  throw new Error('Variabili ambiente mancanti');
}

function Home({ favorites, addToFavorites }) {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchFlights = async () => {
      try {
        const cachedData = sessionStorage.getItem('flightData');
        const cacheTime = sessionStorage.getItem('flightDataTime');
        const isCacheValid = cacheTime && (Date.now() - Number(cacheTime)) < 300000;

        if (cachedData && isCacheValid) {
          setFlights(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        const response = await axios.get(API_URL, {
          params: { access_key: API_KEY, limit: 60 },
          signal
        });

        if (!Array.isArray(response.data?.data)) {
          throw new Error('Formato dati non valido');
        }

        sessionStorage.setItem('flightData', JSON.stringify(response.data.data));
        sessionStorage.setItem('flightDataTime', Date.now().toString());

        setFlights(response.data.data);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) return; // Se la richiesta è stata annullata, non fare nulla
        setError(err.message || 'Errore nel caricamento dei voli');
        setLoading(false);
      }
    };

    fetchFlights();

    return () => controller.abort(); // Annulla la richiesta quando il componente si smonta
  }, []);

  useEffect(() => {
    if (!flights.length) return;
    
    setFilteredFlights(
      searchQuery
        ? flights.filter(flight =>
            flight.flight_iata?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : flights
    );
  }, [searchQuery, flights]);

  if (loading) return <div className="text-center">Caricamento...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per codice IATA..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 
                      dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFlights.map((flight, index) => (
          <FlightCard
            key={`${flight.flight_iata}-${flight.departure?.scheduled}-${index}`}
            flight={flight}
            isFavorite={favorites.some(f => f.flight_iata === flight.flight_iata)}
            onFavoriteClick={() => addToFavorites(flight)}
          />
        ))}
      </div>

      {filteredFlights.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          Nessun volo trovato con il codice IATA "{searchQuery}"
        </div>
      )}
    </div>
  );
}

export default Home;
