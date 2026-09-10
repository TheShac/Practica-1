import jwt from "jsonwebtoken";
import { redeemSSETicket } from "#src/core/sseTicketStore.js";

export function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}

// Middleware exclusivo para el endpoint SSE. El cliente primero obtiene un
// ticket de un solo uso (POST /api/auth/sse-ticket) y lo envía como
// ?ticket=<uuid> — el JWT nunca aparece en la URL ni en los logs.
export function authSSE(req, res, next) {
  const ticketId = req.query.ticket;
  if (!ticketId) return res.status(401).json({ message: "Ticket SSE requerido" });

  const ticket = redeemSSETicket(ticketId);
  if (!ticket) return res.status(401).json({ message: "Ticket SSE inválido o expirado" });

  req.user = { usuario_id: ticket.usuario_id, rol: ticket.rol };
  next();
}

export function authorizeRoles(...allowed) {
  return (req, res, next) => {
    if (!req.user?.rol) return res.status(403).json({ message: "No autorizado" });
    if (!allowed.includes(req.user.rol)) return res.status(403).json({ message: "No autorizado" });
    next();
  };
}
