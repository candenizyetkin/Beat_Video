import React, { useEffect, useState } from 'react';
import api from './api';
import './css/overlay-bg.css';
import './css/overlay-content.css';
import './css/overlay-close.css';
import './css/overlay-poster.css';
import './css/overlay-title.css';
import './css/overlay-info.css';
import './css/overlay-loading.css';

export default function FilmOverlay({ movie, movieId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const detailCache = React.useRef({});


  useEffect(() => {
    document.body.classList.add('overlay-open');
    return () => {
      document.body.classList.remove('overlay-open');
    };
  }, []);

  useEffect(() => {
    if (!movie) return;
    const missingFields = [
      'summary', 'download_count', 'like_count', 'runtime'
    ].some(field => movie[field] === undefined || movie[field] === null);
    if (missingFields && movieId) {
      // Cache kontrolü
      if (detailCache.current[movieId]) {
        setDetail(detailCache.current[movieId]);
        setError(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      api.get(`/movie/${movieId}`)
        .then(res => {
          const detailData = res.data.movie || null;
          detailCache.current[movieId] = detailData;
          setDetail(detailData);
        })
        .catch(err => {
          if (err.response && err.response.status === 429) {
            setError('Detay sorgusu limiti aşıldı (429). Lütfen biraz bekleyip tekrar deneyin.');
          } else if (err.response && err.response.status === 403) {
            setError('API erişim izniniz yok (403). RapidAPI anahtarınızı ve planınızı kontrol edin.');
          } else {
            setError('Film detayları yüklenemedi.');
          }
        })
        .finally(() => setLoading(false));
    } else {
      setDetail(null);
    }
  }, [movie, movieId]);

  const displayMovie = detail || movie;
  if (!movie) return null;

  return (
    <div className="overlay-bg">
      <div className="overlay-content">
        <button
          onClick={onClose}
          className="overlay-close"
          aria-label="Kapat"
        >
          ×
        </button>
        {loading && <div className="overlay-loading">Detaylar yükleniyor...</div>}

        {displayMovie.medium_cover_image && (
          <img src={displayMovie.medium_cover_image} alt={displayMovie.title} className="overlay-poster" />
        )}
        <h2 className="overlay-title">{displayMovie.title} {displayMovie.year && <span className="overlay-title-year">({displayMovie.year})</span>}</h2>
        {displayMovie.rating && <div className="overlay-info rating">IMDb: {displayMovie.rating}</div>}
        {displayMovie.genres && <div className="overlay-info">Tür: {displayMovie.genres.join(', ')}</div>}
        {displayMovie.runtime && <div className="overlay-info">Süre: {displayMovie.runtime} dk</div>}
        {displayMovie.summary && <div className="overlay-info summary">{displayMovie.summary}</div>}
        {displayMovie.language && <div className="overlay-info">Dil: {displayMovie.language}</div>}
        {displayMovie.mpa_rating && <div className="overlay-info">MPA: {displayMovie.mpa_rating}</div>}
        {displayMovie.download_count && <div className="overlay-info">İndirme: {displayMovie.download_count}</div>}
        {displayMovie.like_count && <div className="overlay-info">Beğeni: {displayMovie.like_count}</div>}
      </div>
    </div>
  );
}
