
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from './api';
import './css/detail-card.css';
import './css/detail-poster.css';
import './css/detail-info.css';
import './css/detail-controls.css';
import './css/detail-actions.css';
import './css/detail-status.css';


function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/movie/${id}`);
        setMovie(res.data.movie || null);
      } catch (err) {
        setError('Film detayları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        console.error('Movie detail fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleCountChange = (value) => {
    const newValue = Math.max(1, Number(value));
    setCount(newValue);
  };

  return (
    <div className="App-header">
      {loading && (
        <div className="detail-loading">Yükleniyor...</div>
      )}

      {error && (
        <div className="detail-error">{error}</div>
      )}

      {!loading && !error && !movie && (
        <div className="detail-notfound">Film bulunamadı.</div>
      )}

      {!loading && !error && movie && (
        <div className="detail-card">
          <h1 className="detail-title">{movie.title}</h1>

          {movie.poster && (
            <div className="detail-poster">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="detail-poster-img"
              />
            </div>
          )}

          <div className="detail-info">
            <p className="detail-year">Yıl: {movie.year || '-'}</p>
          </div>

          <div className="detail-controls">
            <button 
              onClick={() => handleCountChange(count - 1)}
              className="detail-btn"
            >
              ⬅️
            </button>

            <input 
              type="number"
              value={count}
              min={1}
              onChange={e => handleCountChange(e.target.value)}
              className="detail-input"
            />

            <button 
              onClick={() => handleCountChange(count + 1)}
              className="detail-btn"
            >
              ➡️
            </button>
          </div>

          <div className="detail-actions" style={{display:'flex',gap:16}}>
            <button
              onClick={() => navigate(-1)}
              className="detail-btn detail-action-btn"
            >
              ← Geri Dön
            </button>

            <Link
              to="/"
              className="detail-btn detail-action-btn"
            >
              Ana Sayfa
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Detail;
