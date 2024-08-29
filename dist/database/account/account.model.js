import { model, Schema } from 'mongoose';
const accountSchema = new Schema({
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
export default model('facebooks_accounts', accountSchema);
