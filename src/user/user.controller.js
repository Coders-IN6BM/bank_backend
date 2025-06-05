import User from '../user/user.model.js';
import generarNumeroCuenta from '../utils/generarCuenta.js';


export const crearUser = async (req, res) => {
  try {
    const { ingresosMensuales, correo, DPI } = req.body;

    if (ingresosMensuales <= 100) {
      return res.status(400).json({ error: 'Ingresos deben ser mayores a Q100' });
    }

    const existeCorreo = await User.findOne({ correo });
    const existeDPI = await User.findOne({ DPI });

    if (existeCorreo || existeDPI) {
      return res.status(400).json({ error: 'Correo o DPI ya registrados' });
    }

    const numeroCuenta = generarNumeroCuenta();
    const nuevoUser = new User({ ...req.body, numeroCuenta });
    await nuevoUser.save();

    res.status(201).json({ mensaje: 'Usuario creado', user: nuevoUser });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario', detalles: err.message });
  }
};


export const verUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.id !== id && req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permiso para ver este perfil' });
  }

  const user = await User.findById(id).select('-password -DPI');
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  res.json({ user });
};


export const editarUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.id !== id && req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permiso para editar este perfil' });
  }

  const { password, DPI, numeroCuenta, rol, saldo, ...datos } = req.body;

  const camposPermitidos = ['nombre', 'direccion', 'nombreTrabajo', 'ingresosMensuales', 'celular', 'correo'];
  const actualizaciones = {};

  camposPermitidos.forEach(campo => {
    if (datos[campo] !== undefined) {
      actualizaciones[campo] = datos[campo];
    }
  });

  try {
    const user = await User.findByIdAndUpdate(id, actualizaciones, { new: true }).select('-password -DPI');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};


export const eliminarUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permiso para eliminar usuarios' });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (user.rol === 'admin') {
    return res.status(403).json({ error: 'No puedes eliminar a un administrador' });
  }

  await User.findByIdAndDelete(id);
  res.json({ mensaje: 'Usuario eliminado correctamente' });
};


export const listarUsers = async (req, res) => {
  const users = await User.find().select('-password -DPI');
  res.json({ users });
};