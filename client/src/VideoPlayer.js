import React, { useState, useEffect } from 'react';
import { getRandomVideo } from './services/api';

function VideoPlayer() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomVideo = async () => {
    setLoading(true);
    try {
      const response = await getRandomVideo();
      setVideo(response.data);
    } catch (err) {
      console.error('Error fetching video:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomVideo();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Random Short Video</h2>
      {loading && <p>Loading...</p>}
      {video && (
        <div>
          <h3>{video.title}</h3>
          <p>Source: {video.source}</p>
          <p>Creator: {video.creator}</p>
          <button onClick={fetchRandomVideo}>Next Random Video</button>
        </div>
      )}
      {!video && !loading && <p>No videos available</p>}
    </div>
  );
}

export default VideoPlayer;
