
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from './api';
import './App.css';

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
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          Yükleniyor...
        </div>
      )}

      {error && (
        <div style={{
          background: '#ff4444',
          color: 'white',
          padding: '16px 24px',
          borderRadius: 8,
          maxWidth: 400,
          margin: '20px auto',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {!loading && !error && !movie && (
        <div style={{
          textAlign: 'center',
          padding: '40px 0'
        }}>
          Film bulunamadı.
        </div>
      )}

      {!loading && !error && movie && (
        <div style={{
          background: '#2a2a2a',
          borderRadius: 16,
          padding: '32px',
          minWidth: 320,
          maxWidth: 500,
          width: '90%',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '20px auto'
        }}>
          <h1 style={{ 
            marginBottom: 24,
            color: '#fff',
            textAlign: 'center',
            fontSize: 28
          }}>
            {movie.title}
          </h1>

          {movie.poster && (
            <div style={{
              width: '100%',
              maxWidth: 300,
              marginBottom: 24,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <img 
                src={movie.poster} 
                alt={movie.title} 
                style={{ 
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }} 
              />
            </div>
          )}

          <div style={{
            background: '#222',
            padding: '12px 20px',
            borderRadius: 8,
            marginBottom: 24,
            width: '100%',
            maxWidth: 300
          }}>
            <p style={{ 
              color: '#aaa',
              margin: 0,
              fontSize: 16
            }}>
              Yıl: {movie.year || '-'}
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            marginBottom: 32
          }}>
            <button 
              onClick={() => handleCountChange(count - 1)}
              style={{
                fontSize: 20,
                padding: '8px 16px',
                background: '#444',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                color: '#fff'
              }}
            >
              ⬅️
            </button>

            <input 
              type="number"
              value={count}
              min={1}
              onChange={e => handleCountChange(e.target.value)}
              style={{
                width: 60,
                textAlign: 'center',
                fontSize: 18,
                padding: '8px',
                borderRadius: 6,
                border: '1px solid #666',
                background: '#333',
                color: '#fff'
              }}
            />

            <button 
              onClick={() => handleCountChange(count + 1)}
              style={{
                fontSize: 20,
                padding: '8px 16px',
                background: '#444',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                color: '#fff'
              }}
            >
              ➡️
            </button>
          </div>

          <div style={{
            display: 'flex',
            gap: 16
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                color: '#61dafb',
                textDecoration: 'none',
                fontWeight: 'bold',
                padding: '12px 24px',
                background: 'rgba(97, 218, 251, 0.1)',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseOver={e => e.target.style.background = 'rgba(97, 218, 251, 0.2)'}
              onMouseOut={e => e.target.style.background = 'rgba(97, 218, 251, 0.1)'}
            >
              ← Geri Dön
            </button>

            <Link
              to="/"
              style={{
                color: '#61dafb',
                textDecoration: 'none',
                fontWeight: 'bold',
                padding: '12px 24px',
                background: 'rgba(97, 218, 251, 0.1)',
                borderRadius: 8,
                transition: 'background 0.2s ease'
              }}
              onMouseOver={e => e.target.style.background = 'rgba(97, 218, 251, 0.2)'}
              onMouseOut={e => e.target.style.background = 'rgba(97, 218, 251, 0.1)'}
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
