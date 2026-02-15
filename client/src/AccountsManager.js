import React, { useState, useEffect } from 'react';
import { googleLogin, facebookLogin, instagramLogin, initializeGoogleAuth, initializeFacebookSdk } from './services/oauth';
import api from './services/api';
import './AccountsManager.css';

function AccountsManager() {
  const [accounts, setAccounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConnectedAccounts();
    initializeGoogleAuth();
    initializeFacebookSdk();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      const response = await api.get('/oauth/accounts');
      setAccounts(response.data);
    } catch (err) {
      console.error('Error loading accounts:', err);
    }
  };

  const handleGoogleConnect = async () => {
    setLoading(true);
    try {
      const googleData = await googleLogin();
      await api.post('/oauth/google-callback', googleData);
      setMessage('✅ Google account connected!');
      loadConnectedAccounts();
    } catch (err) {
      setMessage('❌ Failed to connect Google account');
      console.error(err);
    }
    setLoading(false);
  };

  const handleFacebookConnect = async () => {
    setLoading(true);
    try {
      const facebookData = await facebookLogin();
      await api.post('/oauth/facebook-callback', facebookData);
      setMessage('✅ Facebook account connected!');
      loadConnectedAccounts();
    } catch (err) {
      setMessage('❌ Failed to connect Facebook account');
      console.error(err);
    }
    setLoading(false);
  };

  const handleInstagramConnect = async () => {
    setLoading(true);
    try {
      const instagramData = await instagramLogin();
      await api.post('/oauth/instagram-callback', instagramData);
      setMessage('✅ Instagram account connected!');
      loadConnectedAccounts();
    } catch (err) {
      setMessage('❌ Failed to connect Instagram account');
      console.error(err);
    }
    setLoading(false);
  };

  const handleDisconnect = async (platform) => {
    try {
      await api.post(`/oauth/disconnect/${platform}`);
      setMessage(`✅ ${platform} account disconnected`);
      loadConnectedAccounts();
    } catch (err) {
      setMessage(`❌ Failed to disconnect ${platform}`);
    }
  };

  const handleFetchVideos = async () => {
    setLoading(true);
    try {
      const response = await api.post('/videofetch/fetch');
      setMessage(`✅ Fetched ${response.data.videos.length} videos!`);
    } catch (err) {
      setMessage('❌ Failed to fetch videos: ' + err.response?.data?.error);
    }
    setLoading(false);
  };

  return (
    <div className="accounts-manager">
      <h2>Connected Accounts</h2>
      {message && <div className="message">{message}</div>}

      <div className="accounts-grid">
        {/* Google */}
        <div className="account-card">
          <div className="account-icon">🔴</div>
          <h3>YouTube</h3>
          {accounts.youtube ? (
            <>
              <p className="connected">✅ Connected</p>
              <button
                onClick={() => handleDisconnect('youtube')}
                className="btn-disconnect"
                disabled={loading}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button onClick={handleGoogleConnect} className="btn-connect" disabled={loading}>
              Connect YouTube
            </button>
          )}
        </div>

        {/* Facebook */}
        <div className="account-card">
          <div className="account-icon">📘</div>
          <h3>Facebook</h3>
          {accounts.facebook ? (
            <>
              <p className="connected">✅ Connected</p>
              <button
                onClick={() => handleDisconnect('facebook')}
                className="btn-disconnect"
                disabled={loading}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button onClick={handleFacebookConnect} className="btn-connect" disabled={loading}>
              Connect Facebook
            </button>
          )}
        </div>

        {/* Instagram */}
        <div className="account-card">
          <div className="account-icon">📷</div>
          <h3>Instagram</h3>
          {accounts.instagram ? (
            <>
              <p className="connected">✅ Connected</p>
              <button
                onClick={() => handleDisconnect('instagram')}
                className="btn-disconnect"
                disabled={loading}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button onClick={handleInstagramConnect} className="btn-connect" disabled={loading}>
              Connect Instagram
            </button>
          )}
        </div>

        {/* TikTok */}
        <div className="account-card">
          <div className="account-icon">🎵</div>
          <h3>TikTok</h3>
          {accounts.tiktok ? (
            <>
              <p className="connected">✅ Connected</p>
              <button
                onClick={() => handleDisconnect('tiktok')}
                className="btn-disconnect"
                disabled={loading}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button className="btn-connect" disabled>
              Connect TikTok (Coming Soon)
            </button>
          )}
        </div>
      </div>

      <div className="fetch-section">
        <h3>Fetch Videos</h3>
        <p>Click below to fetch latest videos from your connected accounts</p>
        <button onClick={handleFetchVideos} className="btn-fetch" disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Videos Now'}
        </button>
      </div>
    </div>
  );
}

export default AccountsManager;
