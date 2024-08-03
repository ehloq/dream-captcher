import User from './user.model.js';
const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return null;
        }
        return user;
    }
    catch (error) {
        return null;
    }
};
export { getUserById };
