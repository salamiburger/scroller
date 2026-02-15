import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRandomVideo } from './services/api';

function VideoPlayer() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRandomVideo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRandomVideo();
      setVideo(response.data);
    } catch (err) {
      console.error('Error fetching video:', err);
      if (err.response?.status === 400) {
        setError('No accounts connected. Please connect your accounts first!');
      } else if (err.response?.status === 401) {
        setError('Please sign in first');
      } else {
        setError('Unable to load video. Please check your connection or try again later.');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomVideo();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>🎬 Social Shorts Aggregator</h1>
        <nav style={{ display: 'flex', gap: '15px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
          <Link to="/accounts" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
            Connect Accounts
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', flex: 1 }}>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Watch random short videos from YouTube, Instagram, Facebook, and TikTok
        </p>
        
        <h2>Random Short Video</h2>
        {loading && <p style={{ textAlign: 'center' }}>⏳ Loading...</p>}
        {error && <p style={{ color: '#d32f2f', textAlign: 'center', padding: '15px', background: '#ffebee', borderRadius: '8px' }}>
          {error}
        </p>}
        {video && (
          <div style={{ 
            border: '1px solid #ddd', 
            padding: '20px', 
            borderRadius: '8px', 
            marginTop: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>{video.title}</h3>
            <p><strong>🎥 Source:</strong> {video.source.toUpperCase()}</p>
            <p><strong>👤 Creator:</strong> {video.creator}</p>
            {video.description && <p><strong>📝 Description:</strong> {video.description.substring(0, 150)}...</p>}
            <button 
              onClick={fetchRandomVideo} 
              style={{ 
                marginTop: '20px', 
                padding: '10px 20px', 
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              ➡️ Next Video
            </button>
          </div>
        )}
        {!video && !loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '30px', 
            background: '#f5f5f5', 
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <p style={{ color: '#999', marginBottom: '15px' }}>
              🎯 Get started by connecting your video accounts!
            </p>
            <Link to="/accounts" style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              Connect Your Accounts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
