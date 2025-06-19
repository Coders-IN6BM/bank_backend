import User from "../user/user.model.js";

async function generateUniqueAccountNumber() {
    let isUnique = false;
    let accountNumber;

    while (!isUnique) {
        // Genera un número aleatorio de 10 dígitos
        accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        // Verifica si el número ya existe en la base de datos
        const existingUser = await User.findOne({ accountNumber });
        if (!existingUser) {
            isUnique = true;
        }
    }

    // Crea un nuevo usuario en la base de datos con el número generado
    const newUser = new User({ accountNumber });
    await newUser.save();

    return accountNumber;
}

// Ejemplo de uso
(async () => {
    const newAccountNumber = await generateUniqueAccountNumber();
    console.log("Número de cuenta generado y guardado:", newAccountNumber);
})();