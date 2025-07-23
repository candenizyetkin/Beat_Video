

import React, { useEffect, useState } from 'react';
import api from './api';
import FilmOverlay from './FilmOverlay';
import './App.css';

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Independent', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Short', 'Sport', 'Superhero', 'Thriller', 'War', 'Western'
];

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genre, setGenre] = useState('Independent');
  const [minRating, setMinRating] = useState(9);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Yeni: Arama tetikleyici
  const [searchParams, setSearchParams] = useState({ genre: 'Independent', minRating: 9 });

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
    <div className="App-header">
      {/* Desktop için kenarlara mockup reklam slotları */}
      <div className="mockup-ads-left" style={{ display: 'none' }}></div>
      <div className="mockup-ads-right" style={{ display: 'none' }}></div>
      {/* Logo ve tema butonu */}
      <div className="header-logo-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
        <span className="main-logo-text" style={{ margin: 0, fontWeight: 700, fontSize: 32 }}>Beat Video</span>
        <button
          onClick={() => {
            const theme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', theme);
          }}
          style={{
            background: 'var(--card-bg, #222)',
            color: 'var(--text-main, #fff)',
            border: '1.5px solid #38c9ff',
            borderRadius: 8,
            padding: '6px 16px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            marginLeft: 8
          }}
          aria-label="Tema değiştir"
        >
          🌙 / ☀️
        </button>
      </div>
      {/* Filtreler */}
      <div className="search-area" style={{
        background: 'var(--card-bg, rgba(30,34,45,0.96))',
        boxShadow: 'var(--card-shadow, 0 4px 24px rgba(0,0,0,0.22))',
        borderRadius: 18,
        padding: '20px 10px 14px 10px',
        marginBottom: 24,
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 18,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '@media (max-width: 768px)': {
          padding: '16px 8px'
        }
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 180 }}>
          <label style={{ color: '#b6eaff', fontWeight: 600, marginBottom: 6, letterSpacing: 1 }}>Tür</label>
          <select
            value={searchParams.genre}
            onChange={e => setSearchParams(sp => ({ ...sp, genre: e.target.value }))}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1.5px solid #3e6c88',
              fontSize: 16,
              background: '#232c36',
              color: '#fff',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'border 0.2s',
            }}
          >
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 140 }}>
          <label style={{ color: '#b6eaff', fontWeight: 600, marginBottom: 6, letterSpacing: 1 }}>Minimum IMDb</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: 100 }}>
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
        <div style={{ background: error.includes('istek yapıldı') ? '#ffae44' : '#ff4444', color: 'white', padding: '12px 24px', borderRadius: 8, margin: '20px 0', fontWeight: 600 }}>
          {error}
        </div>
      )}
      {!loading && !error && movies.length === 0 && (
        <div style={{ margin: '20px 0' }}>Hiç film bulunamadı.</div>
      )}
      <ul style={{ listStyle: 'none', padding: 0, width: '100%', maxWidth: 600, margin: '0 auto' }}>
        {movies.map((movie, idx) => {
          const id = movie.id || idx;
          return (
            <li key={id} className="movie-card" style={{
              margin: '12px 0',
              background: 'var(--card-bg, #2a2a2a)',
              padding: '14px 8px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              boxShadow: 'var(--card-shadow, 0 4px 12px rgba(0,0,0,0.2))',
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
              gap: 14,
              '@media (max-width: 768px)': {
                padding: '12px 6px'
              }
            }}>
              {movie.medium_cover_image && (
                <img src={movie.medium_cover_image} alt={movie.title} style={{ width: 80, height: 120, objectFit: 'cover', borderRadius: 8, marginRight: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 'bold', fontSize: 20, color: '#61dafb' }}>{idx + 1}.</span>
                  <span onClick={() => handleOverlayOpen(movie)} style={{ fontWeight: 'bold', fontSize: 18, color: '#61dafb', textDecoration: 'underline', cursor: 'pointer' }}>{movie.title}</span>
                  {movie.year && <span style={{ fontSize: 14, color: '#aaa', marginLeft: 8 }}>({movie.year})</span>}
                </div>
                {movie.rating && <div style={{ fontSize: 15, color: '#ffd700', margin: '4px 0' }}>IMDb: {movie.rating}</div>}
                {movie.genres && <div style={{ fontSize: 14, color: '#aaa', margin: '2px 0' }}>Tür: {movie.genres.join(', ')}</div>}
                {movie.runtime && <div style={{ fontSize: 14, color: '#aaa', margin: '2px 0' }}>Süre: {movie.runtime} dk</div>}
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
