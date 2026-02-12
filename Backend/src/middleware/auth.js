import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}

export function authorizeRoles(...allowed) {
  return (req, res, next) => {
    if (!req.user?.rol) return res.status(403).json({ message: "No autorizado" });
    if (!allowed.includes(req.user.rol)) return res.status(403).json({ message: "No autorizado" });
    next();
  };
}
