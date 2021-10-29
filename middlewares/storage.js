// const todo = require('../services/todo');



module.exports = () => (req, res,next) => {
    req.storage = {

    };
    next();
};