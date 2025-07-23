import React, { useEffect, useState } from 'react';
import api from './api';

export default function FilmOverlay({ movie, movieId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hangi alanlar eksikse fetch yap
  // Detay cache'i (movieId'ye göre)
  const detailCache = React.useRef({});

  // Overlay açıkken body scroll'unu engelle
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
      // Önce cache'e bak
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.75)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.2s',
      padding: '8px',
      boxSizing: 'border-box',
    }}>
      <div className="FilmOverlayContent" style={{
        background: 'var(--card-bg, #222)',
        borderRadius: 16,
        padding: '24px 16px',
        minWidth: 260,
        maxWidth: 500,
        width: '95%',
        maxHeight: '90vh',
        margin: '32px 8px',
        boxShadow: 'var(--card-shadow, 0 4px 16px rgba(0,0,0,0.2))',
        color: 'var(--text-main, #fff)',
        position: 'relative',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            color: 'var(--primary, #2568ef)',
            fontSize: 28,
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          aria-label="Kapat"
        >
          ×
        </button>
        {loading && <div style={{ color: '#61dafb', marginBottom: 16 }}>Detaylar yükleniyor...</div>}

        {displayMovie.medium_cover_image && (
          <img src={displayMovie.medium_cover_image} alt={displayMovie.title} style={{ width: 120, height: 180, objectFit: 'cover', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', marginBottom: 24 }} />
        )}
        <h2 style={{ color: 'var(--primary, #2568ef)', marginBottom: 12 }}>{displayMovie.title} {displayMovie.year && <span style={{ fontSize: 18, color: 'var(--muted, #aaa)' }}>({displayMovie.year})</span>}</h2>
        {displayMovie.rating && <div style={{ fontSize: 16, color: '#ffd700', marginBottom: 8 }}>IMDb: {displayMovie.rating}</div>}
        {displayMovie.genres && <div style={{ fontSize: 15, color: '#aaa', marginBottom: 8 }}>Tür: {displayMovie.genres.join(', ')}</div>}
        {displayMovie.runtime && <div style={{ fontSize: 15, color: '#aaa', marginBottom: 8 }}>Süre: {displayMovie.runtime} dk</div>}
        {displayMovie.summary && <div style={{ fontSize: 15, color: '#ccc', marginBottom: 12 }}>{displayMovie.summary}</div>}
        {displayMovie.language && <div style={{ fontSize: 14, color: '#aaa', marginBottom: 4 }}>Dil: {displayMovie.language}</div>}
        {displayMovie.mpa_rating && <div style={{ fontSize: 14, color: '#aaa', marginBottom: 4 }}>MPA: {displayMovie.mpa_rating}</div>}
        {displayMovie.download_count && <div style={{ fontSize: 14, color: '#aaa', marginBottom: 4 }}>İndirme: {displayMovie.download_count}</div>}
        {displayMovie.like_count && <div style={{ fontSize: 14, color: '#aaa', marginBottom: 4 }}>Beğeni: {displayMovie.like_count}</div>}
      </div>
    </div>
  );
}
