/**
 * Laravel Echo Configuration
 * WebSocket client untuk real-time updates
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Only run on client-side
if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}

let echoInstance = null;

/**
 * Get or create Echo instance
 * @returns {Echo} Echo instance
 */
export const getEcho = () => {
  // Guard against server-side rendering
  if (typeof window === 'undefined') {
    console.warn('Echo can only be initialized on client-side');
    return null;
  }

  if (!echoInstance) {
    // Get token from cookies
    let token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    // Fallback to localStorage if not found in cookies
    if (!token) {
      token = localStorage.getItem('token') || localStorage.getItem('access_token');
    }

    const config = {
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'rfmp9pmudhfkb6dvdybr',
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
      wsPort: process.env.NEXT_PUBLIC_REVERB_PORT || 9090,
      wssPort: process.env.NEXT_PUBLIC_REVERB_PORT || 9090,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
      authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
      auth: {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          Accept: 'application/json',
        },
      },
    };

    console.log('[Echo] Initializing with auth:', {
      wsHost: config.wsHost,
      wsPort: config.wsPort,
      key: config.key.substring(0, 8) + '...',
    });

    echoInstance = new Echo(config);
  }

  return echoInstance;
};

/**
 * Disconnect Echo
 */
export const disconnectEcho = () => {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
};

export default getEcho;
