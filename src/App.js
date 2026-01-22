import React, { useState, useEffect } from 'react';
import './App.css';

const M3U_URL = "https://raw.githubusercontent.com/nirob1520/NGTmovieBd/refs/heads/main/NGTmovie.m3u";

function App() {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(M3U_URL)
      .then(res => res.text())
      .then(data => {
        const lines = data.split('\n');
        const movies = [];
        for(let i = 0; i < lines.length; i++) {
          if(lines[i].startsWith('#EXTINF')) {
            const info = lines[i];
            const url = lines[i+1]?.trim();
            if(!url || !url.startsWith('http')) continue;
            const nameMatch = info.match(/,(.+)/);
            const logoMatch = info.match(/tvg-logo="([^"]+)"/);
            movies.push({
              name: nameMatch ? nameMatch[1].trim() : "Unknown",
              logo: logoMatch ? logoMatch[1].trim() : "https://via.placeholder.com/300x450?text=No+Image",
              url: url
            });
          }
        }
        setAllMovies(movies);
        setFilteredMovies(movies);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredMovies(allMovies.filter(m => m.name.toLowerCase().includes(term)));
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="logo">NGT <span>MOVIE</span></div>
        <div className="search-wrapper">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
        </div>
      </header>

      <div className="container">
        {loading ? <div className="loading-spinner"></div> : (
          <div className="movie-grid">
            {filteredMovies.map((movie, idx) => (
              <div key={idx} className="card" onClick={() => setSelectedMovie(movie)}>
                <img src={movie.logo} alt={movie.name} loading="lazy" />
                <div className="card-overlay">
                  <div className="card-title">{movie.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <div className="player-overlay active">
          <div className="video-wrapper">
            <button className="p-back" onClick={() => setSelectedMovie(null)}>✕ Close Player</button>
            <video src={selectedMovie.url} controls autoPlay playsInline />
            <h2 className="p-title">{selectedMovie.name}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
