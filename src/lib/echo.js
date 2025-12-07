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

  // Ambil URL dari env, jangan hardcoded localhost
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

  /**
   * Logic untuk bersihkan trailing slash kalau ada (biar ga double slash //)
   * Entahlah ini saran dari gemini.
   */
  const cleanBaseUrl = apiBaseUrl.replace(/\/+$/, '');

  const provider = process.env.NEXT_PUBLIC_BROADCAST_PROVIDER || 'reverb';

  let config;
  if (provider === 'pusher') {
    // Pusher (cloud) configuration
    config = {
      broadcaster: 'pusher',
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER, // let Pusher pick the correct host per cluster
      forceTLS: true,
      authEndpoint: `${cleanBaseUrl}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    };
  } else {
    // Reverb (self-hosted) configuration
    config = {
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || process.env.NEXT_PUBLIC_REVERB_KEY || 'rfmp9pmudhfkb6dvdybr',
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 9090),
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 9090),
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_TLS || 'false') === 'true',
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
      authEndpoint: `${cleanBaseUrl}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    };
  }

  console.log('[Echo] Initializing with config:', {
    provider,
    wsHost: config.wsHost,
    wsPort: config.wsPort,
    key: (config.key || '').substring(0, 8) + '...',
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
