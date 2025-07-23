import React, { useEffect, useState } from 'react';
import api from './api';
import FilmOverlay from './FilmOverlay';
import './css/home.css';

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Independent', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Short', 'Sport', 'Superhero', 'Thriller', 'War', 'Western'
];

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genre, setGenre] = useState('Action');
  const [minRating, setMinRating] = useState(7);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Yeni: Arama tetikleyici
  const [searchParams, setSearchParams] = useState({ genre: 'Action', minRating: 7 });

  // Sadece 'Bul' butonuna basınca fetch
  // Basit cache objesi (arama parametrelerine göre anahtar)
const searchCache = React.useRef({});

const handleSearch = async () => {
  try {
    setLoading(true);
    setError(null);
    const params = {
      genre: searchParams.genre,
      minimum_rating: searchParams.minRating,
      sort_by: 'rating',
      order_by: 'desc',
      limit: 10
    };
    if (!searchParams.genre) delete params.genre;
    // Parametreleri anahtar olarak kullan
    const cacheKey = JSON.stringify(params);
    if (searchCache.current[cacheKey]) {
      setMovies(searchCache.current[cacheKey]);
      setLoading(false);
      return;
    }
    let newMovies = [];
    try {
      const res = await api.get('/list_movies.json', { params });
      newMovies = (res.data.data && res.data.data.movies) ? res.data.data.movies : [];
      searchCache.current[cacheKey] = newMovies;
      setMovies(newMovies);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setError('Çok fazla istek yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.');
      } else {
        setError('Filmler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
      console.error('Movie fetch error:', err);
    }
  } finally {
    setLoading(false);
  }
};

  // İlk açılışta fetch
  React.useEffect(() => { handleSearch(); }, []);

  const handleOverlayOpen = (movie) => {
    setSelectedMovie(movie);
    setSelectedMovieId(movie.id);
  };

  const handleOverlayClose = () => {
    setSelectedMovie(null);
    setSelectedMovieId(null);
  };

  return (
    <div className="home-header">
    
      <div className="home-header-logo-area">
        <span className="main-logo-text">Beat Video</span>
      </div>
      <div className="home-search-area">
        <div className="home-search-column">
          <label className="home-search-label">Tür</label>
          <select
            value={searchParams.genre}
            onChange={e => setSearchParams(sp => ({ ...sp, genre: e.target.value }))}
            className="home-genre-select"
          >
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="home-search-column">
          <label className="home-search-label">Minimum IMDb</label>
          <div className="imdb-input-container">
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              className="imdb-input"
              value={searchParams.minRating}
              onChange={e => {
                let val = e.target.value;
                // Noktadan sonra en fazla 1 basamak
                if (val.includes('.')) {
                  const [whole, dec] = val.split('.');
                  val = whole + (dec ? '.' + dec.slice(0, 1) : '');
                }
                setSearchParams(sp => ({ ...sp, minRating: Number(val) }));
              }}
              style={{ width: '70px', marginRight: 0 }}
            />
            <div className="imdb-input-arrows" style={{ position: 'static', height: 44, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <button
                className="imdb-arrow-btn"
                tabIndex={-1}
                style={{ border: 'none', background: 'none', color: '#61dafb', fontSize: 18, cursor: 'pointer', padding: 0, lineHeight: 1, marginBottom: 2 }}
                onClick={() => setSearchParams(sp => {
                  let next = Math.min(10, (sp.minRating || 0) + 0.1);
                  next = Math.round(next * 10) / 10;
                  return { ...sp, minRating: next };
                })}
                type="button"
              >▲</button>
              <button
                className="imdb-arrow-btn"
                tabIndex={-1}
                style={{ border: 'none', background: 'none', color: '#61dafb', fontSize: 18, cursor: 'pointer', padding: 0, lineHeight: 1, marginTop: 2 }}
                onClick={() => setSearchParams(sp => {
                  let next = Math.max(0, (sp.minRating || 0) - 0.1);
                  next = Math.round(next * 10) / 10;
                  return { ...sp, minRating: next };
                })}
                type="button"
              >▼</button>
            </div>
          </div>
        </div>
        <button
          onClick={handleSearch}
          style={{
            padding: '13px 36px',
            borderRadius: 10,
            background: 'linear-gradient(90deg,#38c9ff 0%,#2568ef 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 18,
            border: 'none',
            boxShadow: '0 2px 12px rgba(56,201,255,0.11)',
            cursor: 'pointer',
            marginTop: 24,
            letterSpacing: 1,
            transition: 'background 0.2s, box-shadow 0.2s',
            outline: 'none',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg,#2568ef 0%,#38c9ff 100%)'}
          onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg,#38c9ff 0%,#2568ef 100%)'}
        >
          Bul
        </button>
      </div>
      {loading && <div style={{ margin: '20px 0' }}>Filmler yükleniyor...</div>}
      {error && (
        <div className={error.includes('istek yapıldı') ? "home-warning" : "home-error"}>
          {error}
        </div>
      )}
      {!loading && !error && movies.length === 0 && (
        <div className="home-empty">Hiç film bulunamadı.</div>
      )}
      <ul className="home-movie-list">
        {movies.map((movie, idx) => {
          const id = movie.id || idx;
          return (
            <li key={id} className="home-movie-card">
              {movie.medium_cover_image && (
                <img src={movie.medium_cover_image} alt={movie.title} className="home-movie-img" />
              )} 
              <div className="home-movie-info">
                <div className="home-movie-title-row">
                  <span className="home-movie-index">{idx + 1}.</span>
                  <span className="home-movie-title" onClick={() => handleOverlayOpen(movie)}>{movie.title}</span>
                  {movie.year && <span className="home-movie-year">({movie.year})</span>}
                </div>
                {movie.rating && <div className="home-movie-rating">IMDb: {movie.rating}</div>}
                {movie.genres && <div className="home-movie-genres">Tür: {movie.genres.join(', ')}</div>}
                {movie.runtime && <div className="home-movie-runtime">Süre: {movie.runtime} dk</div>}
              </div>
            </li>
          );
        })}
      </ul>
      {/* Overlay */}
      {selectedMovie && (
        <FilmOverlay
          movie={selectedMovie}
          movieId={selectedMovieId}
          onClose={handleOverlayClose}
        />
      )}
    </div>
  );
}

export default Home;
