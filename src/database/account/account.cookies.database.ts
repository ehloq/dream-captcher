import { Cookie } from "playwright";
import Account, { IAccount } from "./account.model.js";
import CookieDatabase from "../cookies/cookies.database.js";

class AccountCookiesDatabase {
    private cookiesDB: CookieDatabase;

    constructor() {
        this.cookiesDB = new CookieDatabase();
    }

    async saveAccountWithCookies(accountDetails: IAccount, cookies: Cookie[] | null): Promise<IAccount | null> {
        try {
            // Guardar la cuenta en la base de datos
            const newAccount = new Account(accountDetails);
            await newAccount.save();

            // Si las cookies no son null, guardarlas en la base de datos
            if (cookies) {
                const cookieData = {
                    referenceId: newAccount._id,
                    type: 'Cuenta',
                    country: accountDetails.country,
                    countryCode: accountDetails.countryCode,
                    username: accountDetails.username,
                    cookies: cookies,
                    active: true,
                    createdAt: new Date()
                };
                await this.cookiesDB.saveNewCookie(cookieData);
                newAccount.hasCookies = true;
            } else {
                newAccount.hasCookies = false;
            }

            // Guardar el estado actualizado de la cuenta
            await newAccount.save();

            return newAccount;
        } catch (error) {
            console.error('Error saving account with cookies:', error);
            return null;
        }
    }
}

export default AccountCookiesDatabase;