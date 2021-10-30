const Course = require('../models/Course');
const User = require('../models/User');


async function getAll() {
    return await Course.find({}).lean();
}

async function createCourse(courseData) {
    const course = new Course(courseData);
    await course.save();

    return course;
}

async function getCourseById(id) {
    const course = await Course.findById(id).lean();

    return course;
}

async function enrollCourse(courseId, userId) {
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (user._id == course.owner) {
        throw new Error('Cannot enroll your own course!');
    }

    user.enrolledCourses.push(courseId);
    course.users.push(user);
    
 
    return Promise.all([user.save(), course.save()]);
}

async function editCourse(id, courseData) {
    const course = await Course.findById(id);

    course.title = courseData.title;
    course.description = courseData.description;
    course.imageUrl = courseData.imageUrl;;
    course.isPublic = Boolean(courseData.isPublic)

    return course.save();

}

async function deleteCourse(courseId) {
    await Course.findByIdAndDelete(courseId);
}

module.exports = {
    getAll,
    createCourse,
    getCourseById,
    enrollCourse,
    editCourse,
    deleteCourse
}