import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import FlightCard from "../components/FlightCard";

// removeFromFavorites è passato come prop ma non è utilizzato nella lista dei voli
// Modifica la definizione della funzione rimuovendo il parametro inutilizzato
function Home({ favorites, addToFavorites, removeFromFavorites }) {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Controllo delle variabili d'ambiente
  useEffect(() => {
    if (
      !import.meta.env.VITE_AVIATION_API_KEY ||
      !import.meta.env.VITE_API_URL
    ) {
      setError("Configurazione API mancante");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchFlights = async () => {
      try {
        // Verifica cache
        const cachedData = sessionStorage.getItem("flightData");
        const cacheTime = sessionStorage.getItem("flightDataTime");
        const isCacheValid =
          cacheTime && Date.now() - Number(cacheTime) < 300000;

        if (cachedData && isCacheValid) {
          const parsedData = JSON.parse(cachedData);
          setFlights(parsedData);
          setFilteredFlights(parsedData);
          setLoading(false);
          return;
        }

        // Chiamata API
        const response = await axios.get(import.meta.env.VITE_API_URL, {
          params: {
            access_key: import.meta.env.VITE_AVIATION_API_KEY,
            limit: 60,
          },
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        if (!response.data?.data || !Array.isArray(response.data.data)) {
          throw new Error("Formato dati non valido");
        }

        // Salva in cache
        sessionStorage.setItem(
          "flightData",
          JSON.stringify(response.data.data)
        );
        sessionStorage.setItem("flightDataTime", Date.now().toString());

        setFlights(response.data.data);
        setFilteredFlights(response.data.data);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Errore API:", err);
        setError(
          err.response?.data?.error?.message ||
            "Errore nel caricamento dei voli"
        );
        setLoading(false);
      }
    };

    fetchFlights();

    return () => controller.abort();
  }, []);

  // Filtro di ricerca
  useEffect(() => {
    if (!flights.length) return;

    const filtered = searchQuery
      ? flights.filter((flight) =>
          flight.flight_iata?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : flights;

    setFilteredFlights(filtered);
  }, [searchQuery, flights]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Caricamento voli...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

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
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
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
            key={`${flight.flight_iata}-${index}`}
            flight={flight}
            isFavorite={favorites.some(
              (f) => f.flight_iata === flight.flight_iata
            )}
            onFavoriteClick={() => {
              const isAlreadyFavorite = favorites.some(
                (f) => f.flight_iata === flight.flight_iata
              );
              if (isAlreadyFavorite) {
                removeFromFavorites(flight.flight_iata);
              } else {
                addToFavorites(flight);
              }
            }}
          />
        ))}
      </div>

      {filteredFlights.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
          {searchQuery
            ? `Nessun volo trovato con il codice IATA "${searchQuery}"`
            : "Nessun volo disponibile"}
        </div>
      )}
    </div>
  );
}
Home.propTypes = {
  favorites: PropTypes.array.isRequired,
  addToFavorites: PropTypes.func.isRequired,
  removeFromFavorites: PropTypes.func.isRequired,
};

export default Home;
