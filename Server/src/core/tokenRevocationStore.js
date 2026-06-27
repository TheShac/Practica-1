// In-memory revocation store. Clears on server restart — acceptable for
// single-instance deployment without Redis.
// Maps usuario_id -> unix timestamp (seconds) of last logout.
const revokedBefore = new Map();

export function revokeUserTokens(usuario_id) {
  revokedBefore.set(usuario_id, Math.floor(Date.now() / 1000));
}

// Returns true if the token's iat predates the last logout for this user.
export function isRefreshTokenRevoked(usuario_id, iat) {
  const revokedAt = revokedBefore.get(usuario_id);
  return revokedAt !== undefined && iat <= revokedAt;
}
