import User from "../user/user.model.js";
import Account from "../account/account.model.js";

export async function generateUniqueAccountNumber() {
    let isUnique = false;
    let accountNumber;

    while (!isUnique) {
        // Genera un número aleatorio de 12 dígitos para cuentas bancarias
        accountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();

        // Verifica si el número ya existe en la base de datos de cuentas
        const existingAccount = await Account.findOne({ numAccount: accountNumber });
        if (!existingAccount) {
            isUnique = true;
        }
    }

    return accountNumber;
}
