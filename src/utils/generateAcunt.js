import crypto from "crypto";

function generarNumeroCuenta() {
  return crypto.randomBytes(4).toString('hex'); 
}

export default generarNumeroCuenta;