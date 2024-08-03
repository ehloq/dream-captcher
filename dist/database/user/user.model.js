import { model, Schema } from 'mongoose';
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: Number, required: true },
    resetToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    active: { type: Boolean, required: true },
    isBloked: { type: Boolean, required: true },
    subscription: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    config: {
        direct: { type: Boolean, required: true },
        counter: { type: String, required: true },
        redirect: { type: String, required: true },
        typeHack: { type: String, required: true },
        globalCounter: { type: String, required: true },
        backRedirect: { type: String, required: true },
    },
});
export default model('User', userSchema);
