import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MovieCard from "./MovieCard";
import "./App.css";
import SearchIcon from "./search.svg";
import axios from "axios";
import MovieDetails from "./MovieDetails";

const OmdbMovie = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const searchMovies = async () => {
    try {
      const response = await axios.get(
        `https://movieapp-backend-uz9h.onrender.com/api/Movie/search?title=${searchTerm}`
      );
    
      setSearchResults(response.data.search);
      setMovies(response.data.search);
      // Save the search query to local storage
      saveSearchToHistory(searchTerm);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const saveSearchToHistory = (query) => {
    // Get existing search history from local storage
    const existingHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Add the new query to the history
    const updatedHistory = [query, ...existingHistory.slice(0, 4)];

    // Save the updated history to local storage
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    // Set the search history state
    setSearchHistory(updatedHistory);
  };

  useEffect(() => {
   // Fetch the initial search history from local storage
   const initialHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
   setSearchHistory(initialHistory);
  }, []);

  return (
    <Router>
      <div className="app">
        <h1>OMDB Movie Application</h1>

        <div className="search">
          <input
            placeholder="Search for movies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchMovies();
              }
            }}
          />
          <img
            src={SearchIcon}
            alt="search"
            onClick={() => searchMovies(searchTerm)}
          />
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                {searchResults !== null && searchResults?.length > 0 ? (
                  <div className="container">
                    {movies &&
                      movies.map((movie) => (
                        <Link key={movie.imdbID} to={`https://movieapp-backend-uz9h.onrender.com/api/Movie/${movie.imdbID}`}>
                          <MovieCard movie={movie} />
                        </Link>
                      ))}
                  </div>
                ) : (
                  <div className="empty">
                    <h1>
                      {searchResults !== null
                        ? "No search found"
                        : "No movie found"}
                    </h1>
                  </div>
                )}

                <div>
                  <h2 className="history">Search History:</h2>
                  <ul>
                    {searchHistory.map((query, index) => (
                      <li key={index}>{query}</li>
                    ))}
                  </ul>
                </div>
              </div>
            }
          />
          <Route path="https://movieapp-backend-uz9h.onrender.com/api/Movie/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default OmdbMovie;






