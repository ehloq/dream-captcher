import Cookies, { ICookies } from "./cookies.model.js";

class CookiesDatabase {
    async saveNewCookie(cookieData: ICookies): Promise<ICookies | null> {
        try {
            const newCookie = new Cookies(cookieData); 
            await newCookie.save();
            return newCookie;
        } catch (error) {
            return null;
        }
    }
}

export default CookiesDatabase;