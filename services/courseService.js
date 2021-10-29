const Course = require('../models/User');

async function getAll() {
    return await Course.find({}).lean();
}

module.exports = {
    getAll
}