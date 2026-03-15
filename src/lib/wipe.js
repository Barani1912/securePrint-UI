// wipe.js — Session wipe utility
// Called when session ends for any reason:
// print complete, timer expired, 3 wrong PINs, manual cancel, tab closed.
// Nulls all state, revokes blob URLs, destroys peer connection, removes event handlers.

/**
 * Wipe all session data from browser memory.
 * @param {Object} params
 * @param {Function} params.setFileBlob - useState setter for file blob
 * @param {Function} params.setFileName - useState setter for file name
 * @param {Function} params.setFileType - useState setter for file type
 * @param {Function} params.setPin - useState setter for PIN
 * @param {string|null} params.blobUrl - Current blob URL to revoke
 * @param {Object} params.peerRef - React ref holding PeerJS peer instance
 * @param {Function|null} params.clearCountdown - Function to clear countdown interval
 */
export function wipeSession({
  setFileBlob,
  setFileName,
  setFileType,
  setPin,
  blobUrl,
  peerRef,
  clearCountdown,
}) {
  // Null all file state
  if (setFileBlob) setFileBlob(null);
  if (setFileName) setFileName(null);
  if (setFileType) setFileType(null);
  if (setPin) setPin('');

  // Revoke blob URL to free memory
  if (blobUrl) {
    try { URL.revokeObjectURL(blobUrl); } catch (e) { /* ignore */ }
  }

  // Destroy WebRTC peer connection
  if (peerRef && peerRef.current) {
    try {
      peerRef.current.destroy();
    } catch (e) { /* ignore */ }
    peerRef.current = null;
  }

  // Remove event handlers
  window.onafterprint = null;
  if (window._spVisHandler) {
    document.removeEventListener('visibilitychange', window._spVisHandler);
    window._spVisHandler = null;
  }

  // Clear countdown timer
  if (clearCountdown) clearCountdown();
}
