import User from '../user/user.model.js';
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import generateAcunt from '../utils/generateAcunt.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

  const valido = await bcrypt.compare(password, user.password);
  if (!valido) return res.status(400).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign(
    { id: user._id, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token });
};

export const register = async (req, res) => {
  try {
    const {
      nombre, username, password, rol,
      DPI, direccion, celular, correo,
      nombreTrabajo, ingresosMensuales
    } = req.body;

    const existeUsername = await User.findOne({ username });
    if (existeUsername) return res.status(400).json({ error: 'Username ya existe' });

    const existeCorreo = await User.findOne({ correo });
    if (existeCorreo) return res.status(400).json({ error: 'Correo ya registrado' });

    const existeDPI = await User.findOne({ DPI });
    if (existeDPI) return res.status(400).json({ error: 'DPI ya registrado' });

    if (ingresosMensuales <= 100) {
      return res.status(400).json({ error: 'Ingresos deben ser mayores a Q100' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({
      nombre,
      username,
      password: hashedPassword,
      rol: rol || 'cliente',
      numeroCuenta: generateAcunt(),
      DPI,
      direccion,
      celular,
      correo,
      nombreTrabajo,
      ingresosMensuales,
      saldo: 0,
      fechaCreacion: new Date()
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el registro', detalles: error.message });
  }
};