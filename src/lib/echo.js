/**
 * Laravel Echo Configuration
 * WebSocket client untuk real-time updates
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Cookies from 'js-cookie';

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

  const token = Cookies.get('token');

  if (!token) {
    console.warn('[Echo] No auth token found via Cookies.');
    return null;
  }

  if (echoInstance) {
     return echoInstance;
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
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  };

  console.log('[Echo] Initializing with config:', {
    wsHost: config.wsHost,
    wsPort: config.wsPort,
    key: config.key.substring(0, 8) + '...',
    hasToken: !!token,
  });

  echoInstance = new Echo(config);

    // Add connection state listeners for debugging
  if (echoInstance.connector && echoInstance.connector.pusher) {
    const pusher = echoInstance.connector.pusher;
    
    pusher.connection.bind('connected', () => {
      console.log('[Echo] ✅ WebSocket connected');
    });
    
    pusher.connection.bind('disconnected', () => {
      console.warn('[Echo] ❌ WebSocket disconnected');
    });
    
    pusher.connection.bind('error', (err) => {
      console.error('[Echo] ❌ WebSocket error:', err);
    });

    pusher.connection.bind('state_change', (states) => {
      console.log('[Echo] Connection state changed:', states.previous, '→', states.current);
    });
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
