// OAuth Configuration for different platforms
/* global FB, gapi */

export const googleConfig = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
  scopes: [
    'https://www.googleapis.com/auth/youtube.readonly',
    'profile',
    'email'
  ]
};

export const facebookConfig = {
  appId: process.env.REACT_APP_FACEBOOK_APP_ID || '',
  version: 'v18.0'
};

export const instagramConfig = {
  appId: process.env.REACT_APP_FACEBOOK_APP_ID || '', // Uses Facebook App ID
  scopes: ['instagram_basic', 'instagram_content_publish']
};

export const tiktokConfig = {
  clientId: process.env.REACT_APP_TIKTOK_CLIENT_ID || '',
  redirectUri: `${window.location.origin}/auth/tiktok/callback`,
  scopes: ['user.read', 'video.list']
};

// Initialize Google Sign-In
export const initializeGoogleAuth = () => {
  if (window.gapi) {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: googleConfig.clientId,
        discoveryDocs: googleConfig.discoveryDocs,
        scope: googleConfig.scopes.join(' ')
      });
    });
  }
};

// Initialize Facebook SDK
export const initializeFacebookSdk = () => {
  window.fbAsyncInit = function () {
    if (window.FB) {
      window.FB.init({
        appId: facebookConfig.appId,
        version: facebookConfig.version,
        xfbml: true,
        status: true
      });
    }
  };

  // Load the SDK
  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
};

// Google OAuth login
export const googleLogin = async () => {
  try {
    const auth2 = window.gapi.auth2.getAuthInstance();
    const googleUser = await auth2.signIn();
    const profile = googleUser.getBasicProfile();
    const authResponse = googleUser.getAuthResponse();

    return {
      accessToken: authResponse.id_token,
      refreshToken: authResponse.id_token,
      email: profile.getEmail(),
      name: profile.getName(),
      picture: profile.getImageUrl()
    };
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// Facebook OAuth login
export const facebookLogin = async () => {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error('Facebook SDK not loaded'));
      return;
    }
    
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          window.FB.api('/me', { fields: 'id,name,email,picture' }, function (user) {
            resolve({
              accessToken: response.authResponse.accessToken,
              refreshToken: response.authResponse.accessToken,
              id: user.id,
              email: user.email,
              name: user.name,
              picture: user.picture?.data?.url
            });
          });
        } else {
          reject(new Error('Login failed'));
        }
      },
      { scope: 'public_profile,email' }
    );
  });
};

// Instagram login (via Facebook)
export const instagramLogin = async () => {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
      reject(new Error('Facebook SDK not loaded'));
      return;
    }
    
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          window.FB.api(
            '/me/instagram_accounts',
            { fields: 'id,username,name,profile_picture_url', access_token: response.authResponse.accessToken },
            function (user) {
              if (user.data && user.data.length > 0) {
                resolve({
                  accessToken: response.authResponse.accessToken,
                  id: user.data[0].id,
                  name: user.data[0].username,
                  picture: user.data[0].profile_picture_url
                });
              } else {
                reject(new Error('No Instagram account found'));
              }
            }
          );
        } else {
          reject(new Error('Login failed'));
        }
      },
      { scope: 'instagram_basic,instagram_content_publish' }
    );
  });
};

// TikTok OAuth login
export const tiktokLogin = async () => {
  const clientId = tiktokConfig.clientId;
  const redirectUri = tiktokConfig.redirectUri;
  const scope = 'user.info.basic,video.list';
  const state = Math.random().toString(36).substring(7);

  const authUrl = `https://www.tiktok.com/v1/oauth/authorize?client_key=${clientId}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}`;

  window.location.href = authUrl;
};

export default {
  googleLogin,
  facebookLogin,
  instagramLogin,
  tiktokLogin,
  initializeGoogleAuth,
  initializeFacebookSdk
};
