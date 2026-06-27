import { randomUUID } from 'crypto';

// In-memory store for one-time SSE auth tickets.
// Clears on server restart — acceptable for single-instance deployment.
const tickets = new Map(); // uuid -> { usuario_id, rol, expiresAt }
const TICKET_TTL_MS = 30_000; // 30 seconds

export function createSSETicket(usuario_id, rol) {
  const id = randomUUID();
  tickets.set(id, { usuario_id, rol, expiresAt: Date.now() + TICKET_TTL_MS });
  return id;
}

export function redeemSSETicket(id) {
  const ticket = tickets.get(id);
  if (!ticket) return null;
  tickets.delete(id); // one-time use — immediately removed after first read
  if (Date.now() > ticket.expiresAt) return null;
  return ticket;
}
