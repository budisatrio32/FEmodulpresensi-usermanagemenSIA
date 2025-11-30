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
    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'rfmp9pmudhfkb6dvdybr',
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
      wsPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
      wssPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https',
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
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
