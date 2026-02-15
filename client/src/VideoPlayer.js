import React, { useState, useEffect } from 'react';
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
      setError('Unable to load video. Please check your connection or try again later.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomVideo();
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', minHeight: '100vh' }}>
      <h1>🎬 Social Shorts Aggregator</h1>
      <p>Watch random short videos from Instagram, TikTok, and YouTube Shorts</p>
      
      <h2>Random Short Video</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {video && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h3>{video.title}</h3>
          <p><strong>Source:</strong> {video.source}</p>
          <p><strong>Creator:</strong> {video.creator}</p>
          <button onClick={fetchRandomVideo} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}>Next Random Video</button>
        </div>
      )}
      {!video && !loading && !error && <p>No videos available. Please check back later!</p>}
    </div>
  );
}

export default VideoPlayer;
