import User from '../user/user.model.js';
import generarNumeroCuenta from '../utils/generateAcunt.js';


export const addUser = async (req, res) => {
  try {
    const { ingresosMensuales, email, DPI, phone, username, nameAccount } = req.body;

    // Validación de ingresos
    if (ingresosMensuales <= 100) {
      return res.status(400).json({ 
        error: 'Los ingresos mensuales deben ser mayores a Q100' 
      });
    }

    // Verificación de campos únicos
    const camposUnicos = await User.findOne({
      $or: [
        { email },
        { DPI },
        { phone },
        { username },
        { nameAccount }
      ]
    });

    if (camposUnicos) {
      let campoDuplicado = '';
      if (camposUnicos.email === email) campoDuplicado = 'correo electrónico';
      else if (camposUnicos.DPI === DPI) campoDuplicado = 'DPI';
      else if (camposUnicos.phone === phone) campoDuplicado = 'teléfono';
      else if (camposUnicos.username === username) campoDuplicado = 'nombre de usuario';
      else if (camposUnicos.nameAccount === nameAccount) campoDuplicado = 'nombre de cuenta';

      return res.status(400).json({ 
        error: `El ${campoDuplicado} ya está registrado en el sistema` 
      });
    }

    // Creación del usuario
    const nuevoUser = new User({
      ...req.body,
      rol: 'CLIENTE_ROL', // Valor por defecto
      saldo: 0, // Inicializar saldo en 0
      fechaCreacion: new Date()
    });

    await nuevoUser.save();

    // Excluir la contraseña en la respuesta
    const userResponse = nuevoUser.toObject();
    delete userResponse.password;

    res.status(201).json({ 
      mensaje: 'Usuario creado exitosamente',
      usuario: userResponse
    });

  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ 
      error: 'Error interno del servidor al crear usuario',
      detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


export const getUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.id !== id && req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permiso para ver este perfil' });
  }

  const user = await User.findById(id).select('-password -DPI');
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  res.json({ user });
};


export const editUser = async (req, res) => {
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


export const deleteUser = async (req, res) => {
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