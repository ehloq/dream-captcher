import { model, Schema, Document } from 'mongoose';

export interface IAccount extends Document {
    email: string;
    password: string;
    username: string;
    country: string;
    countryCode: string;
    active: boolean;
    ipAddress?: string;
    userAgent?: string;
    cookies?: Record<string, string>;
    // createdAt: Date;
}

const accountSchema: Schema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    active: { type: Boolean, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    cookies: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
});

export default model<IAccount>('facebooks_accounts', accountSchema);