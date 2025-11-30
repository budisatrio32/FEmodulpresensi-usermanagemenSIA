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
    const config = {
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'rfmp9pmudhfkb6dvdybr',
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
      wsPort: process.env.NEXT_PUBLIC_REVERB_PORT || 9090, // Changed to 9090 to match Reverb
      wssPort: process.env.NEXT_PUBLIC_REVERB_PORT || 9090,
      forceTLS: false, // Explicitly disable TLS for local development
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
    };

    console.log('[Echo] Initializing with config:', {
      wsHost: config.wsHost,
      wsPort: config.wsPort,
      forceTLS: config.forceTLS,
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
