export const handleErrors = (err, req, res, next) => {
  if (err) {
    return res.status(500).json({ error: err.message || 'Error interno del servidor' });
  }
  next();
};
