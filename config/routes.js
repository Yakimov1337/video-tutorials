const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const courseController = require('../controllers/courseController');
const userController = require('../controllers/userController.js');



module.exports = (app) => {
    app.use('/', homeController),
    app.use('/auth', authController),
    app.use('/course', courseController)
    app.use('/user', userController)
};