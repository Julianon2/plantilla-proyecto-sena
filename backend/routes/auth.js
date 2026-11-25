// 1. Importar dependencias
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const router = express.Router();

// Dominios de correo que aceptamos al registrarse
const dominiosPermitidos = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "mac.com",
];

// 2. POST /api/auth/registro — crear cuenta nueva
router.post("/registro", async (req, res) => {
  try {
    // El rol NO se lee del cuerpo: lo que manda el navegador no es de fiar
    const { nombre, email, password, departamento, municipio } = req.body;

    // Validar los datos: el servidor revisa aunque la página ya lo haya hecho
    if (!nombre || nombre.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "El nombre debe tener al menos 3 caracteres" });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "El correo no es válido" });
    }
    // El dominio es lo que va después de la última @
    const dominio = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
    if (!dominiosPermitidos.includes(dominio)) {
      return res.status(400).json({
        error: "Usa un correo de Gmail, Hotmail, Outlook, Yahoo o iCloud",
      });
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar que el email no exista ya
    const existe = await Usuario.findOne({ email });
    if (existe)
      return res.status(400).json({ error: "El email ya está registrado" });

    // Encriptar la contraseña con 10 rondas de bcrypt
    const hash = await bcrypt.hash(password, 10);

    // Guardar el usuario con la contraseña encriptada
    const usuario = await Usuario.create({
      nombre,
      email,
      password: hash,
      departamento,
      municipio,
      rol: "cliente",
    });

    res
      .status(201)
      .json({ mensaje: "Usuario creado correctamente", id: usuario._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. POST /api/auth/login — iniciar sesión y recibir token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario)
      return res.status(401).json({ error: "Email o contraseña incorrectos" });

    // Comparar la contraseña con el hash guardado en Atlas
    const valida = await bcrypt.compare(password, usuario.password);
    if (!valida)
      return res.status(401).json({ error: "Email o contraseña incorrectos" });

    // Crear el token JWT — dura 24 horas
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({ token, nombre: usuario.nombre, rol: usuario.rol });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET /api/auth/perfil — devuelve los datos del usuario logueado (requiere token)
const verificarToken = require("../middleware/auth");

router.get("/perfil", verificarToken, async (req, res) => {
  try {
    // req.usuario.id viene del token — lo usa verificarToken
    // select('-password') excluye el hash de contraseña de la respuesta
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. PUT /api/auth/perfil — la persona cambia sus datos
// Solo se aceptan estos tres campos. El correo y el rol NO se leen del cuerpo:
// lo que manda el navegador no es de fiar (el mismo principio del registro).
router.put("/perfil", verificarToken, async (req, res) => {
  try {
    const { nombre, departamento, municipio } = req.body;

    if (typeof nombre !== "string" || nombre.trim().length < 3) {
      return res.status(400).json({ error: "El nombre debe tener al menos 3 caracteres" });
    }
    if (!departamento || !municipio) {
      return res.status(400).json({ error: "Selecciona un departamento y un municipio" });
    }

    // req.usuario.id sale del token: cada persona solo puede cambiar sus propios datos
    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario.id,
      { nombre: nombre.trim(), departamento, municipio },
      { new: true, runValidators: true },
    ).select("-password");
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. PUT /api/auth/password — cambiar la contraseña
// Pide la actual: así, quien encuentre una sesión abierta no puede quedarse con la cuenta.
router.put("/password", verificarToken, async (req, res) => {
  try {
    const { actual, nueva } = req.body;

    if (typeof actual !== "string" || !actual) {
      return res.status(400).json({ error: "Escribe tu contraseña actual" });
    }
    if (typeof nueva !== "string" || nueva.length < 6) {
      return res.status(400).json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
    }

    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Comparar lo que escribió con el hash guardado
    const correcta = await bcrypt.compare(actual, usuario.password);
    if (!correcta) {
      // 400 y no 401: la sesión está bien, lo que está mal es el dato
      return res.status(400).json({ error: "La contraseña actual no es correcta" });
    }
    if (actual === nueva) {
      return res.status(400).json({ error: "La nueva contraseña debe ser distinta de la actual" });
    }

    usuario.password = await bcrypt.hash(nueva, 10);
    await usuario.save();

    res.json({ mensaje: "Contraseña actualizada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Exportar el router
module.exports = router;
