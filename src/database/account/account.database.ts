import Account, { IAccount } from './account.model.js';

const saveNewAccount = async (accountData: IAccount): Promise<IAccount | null> => {
    try {
        const newAccount = new Account(accountData);
        const savedAccount = await newAccount.save();
        return savedAccount;
    } catch (error) {
        return null;
    }
}

const checkAccountExists = async (username: string, password: string): Promise<boolean> => {
    try {
        const existingAccount = await Account.findOne({ username, password });
        return !!existingAccount;
    } catch (error) {
        return false;
    }
}

export {saveNewAccount, checkAccountExists};