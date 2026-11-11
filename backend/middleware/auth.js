// Librería oficial para crear y verificar tokens JWT
const jwt = require('jsonwebtoken');

// Middleware que verifica el token JWT en el header Authorization
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // extraer el token después de "Bearer "

  if (!token) return res.status(401).json({ error: 'Acceso denegado — token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // datos del usuario disponibles en la ruta
    next();               // continuar a la ruta protegida
  } catch (err) {
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;