import { model, Schema } from 'mongoose';

export interface IAccount {
    _id?: string;
    email: string;
    password: string;
    username: string;
    country: string;
    countryCode: string;
    hasCookies: boolean;
    active?: boolean;
    ipAddress?: string;
    userAgent?: string;
    createdAt?: Date;
}

const accountSchema: Schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    hasCookies: { type: Boolean, default: false },
    active: { type: Boolean, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default model<IAccount>('facebooks_accounts', accountSchema);