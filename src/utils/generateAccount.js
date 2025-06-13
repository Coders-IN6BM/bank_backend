function generateUniqueAccountNumber() {
    // Genera un número aleatorio de 10 dígitos
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return accountNumber.toString();
}

// Ejemplo de uso
const newAccountNumber = generateUniqueAccountNumber();
console.log("Número de cuenta generado:", newAccountNumber);