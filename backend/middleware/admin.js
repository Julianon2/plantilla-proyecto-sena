// Middleware: verifica que el usuario autenticado tenga rol admin
function verificarAdmin(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({ error: 'Sin autenticación' });
  }
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado — se requiere rol admin' });
  }
  next();   // solo llega aquí si el token existe Y el rol es admin
}

module.exports = verificarAdmin;