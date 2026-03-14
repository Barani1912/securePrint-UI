// chunker.js — File splitting and reassembly logic
// Handles 16KB WebRTC chunk limits and metadata prefixing.

/**
 * Split a file into encrypted-ready chunks.
 * @param {ArrayBuffer} buffer - The file data
 * @param {string} fileName - Original file name
 * @param {string} fileType - Original file type
 * @param {string} pin - The PIN created by the user
 * @returns {Array} List of chunk objects
 */
export function splitIntoChunks(buffer, fileName, fileType, pin) {
  const CHUNK_SIZE = 16 * 1024; // 16KB for safe WebRTC transmission
  const uint8 = new Uint8Array(buffer);
  const totalChunks = Math.ceil(uint8.length / CHUNK_SIZE);
  const chunks = [];

  for (let i = 0; i < totalChunks; i++) {
    const chunkData = uint8.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    
    chunks.push({
      index: i,
      totalChunks,
      // Metadata only in the first chunk
      fileName: i === 0 ? fileName : null,
      fileType: i === 0 ? fileType : null,
      pin: i === 0 ? pin : null,
      // Send raw ArrayBuffer (PeerJS handles binary correctly and more efficiently than JSON arrays)
      data: chunkData.buffer
    });
  }

  return chunks;
}

/**
 * Reassemble chunks into a final Blob.
 * @param {Array} chunks - List of chunk objects
 * @param {string} fileType - The MIME type for the blob
 * @returns {Blob} The reassembled file
 */
export function reassembleChunks(chunks, fileType) {
  // Sort chunks by index to ensure correct order
  const sorted = [...chunks].sort((a, b) => a.index - b.index);
  
  // Extract the data parts (ArrayBuffers)
  const dataParts = sorted.map(chunk => chunk.data);
  
  return new Blob(dataParts, { type: fileType });
}
