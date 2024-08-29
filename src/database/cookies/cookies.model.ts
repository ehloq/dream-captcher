import { Cookie } from 'playwright';
import { model, Schema } from 'mongoose';

export interface ICookies {
    referenceId: string;
    type: string;
    country: string;
    countryCode: string;
    username: string;
    cookies: Cookie[];
    active: boolean;
    createdAt: Date;
}

const cookiesSchema: Schema = new Schema({
    referenceId: { type: String, ref: 'referenceId' },
    type: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    username: { type: String, required: true },
    cookies: [{ type: Schema.Types.Mixed }],
    active: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default model<ICookies>('facebooks_cookies', cookiesSchema);