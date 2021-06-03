const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const series = require('./routes/series')

const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'
const port = process.env.PORT || 3000
const app = express()

app.use(bodyParser({ extended: true }))
app.use('/series', series)

mongoose
    .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => [
        app.listen(port, () => console.log('Listening...'))
    ])
    .catch(e => {
        console.log(e)
    })