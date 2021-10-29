const { Schema, model } = require('mongoose');

const schema = new Schema ({
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String, required: true},
    imageUrl: { type: String, required: true, match: [/^https?:\/\//, 'Image must be a valid url!'] },
    isPublic: { type: Boolean,  default: false},
    createdAt: { type: Date, default: Date.now },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],

})

module.exports = model('Course',schema);
