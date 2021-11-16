const router = require('express').Router();
const userService = require('../services/userService');

router.get('/', async (req, res) => {
    if (req.user) {
        const course = await userService.getEnrolledCourses(req.user._id);
        const enrolledCourses = course.enrolledCourses;

        res.render('user/profile', { enrolledCourses });

    } else {
        res.render('user/profile');

    }
});


module.exports = router;