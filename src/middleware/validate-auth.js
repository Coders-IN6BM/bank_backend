import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const permitirRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
};

export const verificarUsuario = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  next();
};

export const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }
  next();
};

export const verificarCliente = (req, res, next) => {
  if (req.usuario.rol !== 'cliente') {
    return res.status(403).json({ error: 'Acceso denegado: solo clientes' });
  }
  next();
};

export const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.usuario = decoded;
    next();
  });
};

export const verificarTokenYRoles = (roles) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Token inválido' });
      req.usuario = decoded;

      if (!roles.includes(req.usuario.rol)) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
      next();
    });
  };
};

export const verificarTokenYPropietario = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.usuario = decoded;

    if (req.usuario.id !== req.params.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  });
};

export const verificarTokenYPropietarioOAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.usuario = decoded;

    if (req.usuario.id !== req.params.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  });
};