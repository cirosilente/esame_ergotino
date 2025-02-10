import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaSun, FaMoon, FaHome, FaHeart } from 'react-icons/fa';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('darkMode') === 'true'
  );
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const addToFavorites = (flight) => {
    if (!flight || (!flight.flight_iata && !flight.flight?.iata)) return;
    
    setFavorites(prev => {
      const flightId = flight.flight_iata || flight.flight?.iata;
      const isAlreadyFavorite = prev.some(f => 
        (f.flight_iata || f.flight?.iata) === flightId
      );
      if (isAlreadyFavorite) return prev;
      return [...prev, flight];
    });
  };

  const removeFromFavorites = (flightIata) => {
    setFavorites(favorites.filter(flight => flight.flight_iata !== flightIata));
  };

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0">
                  <img src="/airplane-logo.png" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
                </Link>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link 
                  to="/" 
                  className="text-gray-600 dark:text-gray-200 hover:text-blue-500 p-2"
                >
                  <FaHome className="text-xl sm:text-2xl" />
                </Link>
                <Link 
                  to="/preferiti" 
                  className="text-gray-600 dark:text-gray-200 hover:text-blue-500 relative p-2"
                >
                  <FaHeart className="text-xl sm:text-2xl" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Link>
                <button
                  onClick={toggleDarkMode}
                  className="text-gray-600 dark:text-gray-200 hover:text-blue-500 p-2"
                >
                  {darkMode ? 
                    <FaSun className="text-xl sm:text-2xl" /> : 
                    <FaMoon className="text-xl sm:text-2xl" />
                  }
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route 
              path="/" 
              element={<Home favorites={favorites} addToFavorites={addToFavorites} />} 
            />
            <Route 
              path="/preferiti" 
              element={<Favorites favorites={favorites} removeFromFavorites={removeFromFavorites} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;