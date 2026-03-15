// peer.js — PeerJS initialization helpers
// Both functions accept serverHost so the same code works in dev and production.
// In dev, Vite proxies /peerjs to localhost:3000 (ws:true).
// In production, serverHost is the deployed Railway/Render URL.

import Peer from 'peerjs';

/**
 * Derive the PeerJS server config from the current window location.
 * In dev, Vite proxy handles /peerjs → localhost:3000.
 * In production, the same origin serves the PeerJS endpoint.
 */
function getPeerConfig(serverHost) {
  // Use VITE_PEER_SERVER from env if provided, or the passed serverHost, or current origin
  const peerUrl = import.meta.env.VITE_PEER_SERVER || serverHost || window.location.origin;
  const url = new URL(peerUrl);


  return {
    host: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: '/peerjs',
    secure: url.protocol === 'https:',
    debug: 0, // silent — set to 2 for troubleshooting
  };
}

/**
 * Create a PeerJS peer for the shop side.
 * Uses sessionId as the peer ID so the customer can connect to it.
 * @param {string} sessionId - UUID for the session (used as peer ID)
 * @param {string} [serverHost] - Optional server URL (defaults to window.location.origin)
 * @returns {Peer} PeerJS peer instance
 */
export function createShopPeer(sessionId, serverHost) {
  const config = getPeerConfig(serverHost);
  return new Peer(sessionId, config);
}

/**
 * Create a PeerJS peer for the customer side.
 * Uses a random auto-generated ID.
 * @param {string} [serverHost] - Optional server URL (defaults to window.location.origin)
 * @returns {Peer} PeerJS peer instance
 */
export function createCustomerPeer(serverHost) {
  const config = getPeerConfig(serverHost);
  return new Peer(config);
}
/**
 * Ping the server to wake it up (cold start prevention).
 * Useful for free-tier deployments like Render/Railway.
 */
export function prewarmServer(serverHost) {
  const peerUrl = import.meta.env.VITE_PEER_SERVER || serverHost || window.location.origin;
  fetch(`${peerUrl}/health`).catch(() => {});
}
