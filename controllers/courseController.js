const router = require('express').Router();
const { isUser } = require('../middlewares/guards');

router.get('/create', isUser(), async (req, res) => {
    res.render('course/create');
});

router.post('/create', isUser(), async (req, res) => {
    // console.log(req.body); CHECK WHAT U GET IN CONSOLE (if smth is worng mostly likely it is view related)
    try {
        const courseData = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            isPublic: Boolean(req.body.isPublic),

        }

        await req.storage.createCourse(courseData);

        res.redirect('/');
    } catch (err) {
        // console.log(Object.values(err.errors).map(e => e.properties.message));
        let errors;
        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.properties.message);

        } else {
            errors = [err.message];
        }
        console.log(err.message);
        const ctx = {
            errors: [errors],
            courseData: {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                isPublic: Boolean(req.body.public),
            }

        };
        res.render('course/create', ctx);
    }
});

router.get('/details/:id', async (req, res) => {
    try {
        const course = await req.storage.getCourseById(req.params.id);
        if (req.user) {
            course.hasUser = Boolean(req.user);
            course.isAuthor = req.user && req.user._id == course.users;
            course.isEnrolled = req.user && course.users.find(x => x == req.user._id);
        }



        res.render('course/details', { course });
    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.get('/enroll/:id', isUser(), async (req, res) => {
    try {
        const course = await req.storage.getCourseById(req.params.id);
        if (req.user._id == course.owner) {
            throw new Error('Cannot book your own hotel!');
        }
        req.storage.enrollCourse(req.params.id, req.user._id)
            .then((user, course) => {
                res.redirect('/course/details/' + req.params.id);
            });

    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const course = await req.storage.getCourseById(req.params.id);
        if (req.user._id != course.users) {
            throw new Error('Cannot edit course you haven\'t created!');
        }
        res.render('course/edit', { course });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});


router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const course = await req.storage.getCourseById(req.params.id);
        if (req.user._id != course.users) {
            throw new Error('Cannot edit course you haven\'t created!');
        }

        await req.storage.editCourse(req.params.id, req.body);
        res.redirect('/');
    } catch (err) {
        let errors;
        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.properties.message);

        } else {
            errors = [err.message];
        }
        console.log(errors);
        const ctx = {
            errors: errors,
            course: {
                _id: req.params.id,
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                isPublic: req.body.isPublic,
            }
        }
        res.render('course/edit', ctx);
    }
});

router.get('/delete/:hotelId', async (req, res) => {
    await req.storage.deleteCourse(req.params.hotelId);
    res.redirect('/');
});

module.exports = router;
