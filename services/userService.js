const User = require('../models/User');

async function createUser(username, hashedPassword) {

    const user = new User({
        username,
        hashedPassword
    });

    await user.save();

    return user;
}


async function getUserByUsername(username) {
    const pattern = new RegExp(`^${username}$`, 'i');
    const user = await User.findOne({ username: { $regex: pattern} });
    return user;
}

async function getEnrolledCourses(userId){
    const courses = User.findById(userId);
    return courses.populate('enrolledCourses').lean();
}

module.exports = {
    createUser,
    getUserByUsername,
    getEnrolledCourses
};