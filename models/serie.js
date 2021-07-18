const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    comment: String
})

const SerieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enumValues: ['to-watch', 'watching', 'watched']
    },
    comments: [CommentSchema]
})

const Serie = mongoose.model('Serie', SerieSchema)

module.exports = Serie