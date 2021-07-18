const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const User = require('./models/user')
const series = require('./routes/series')
const users = require('./routes/users')

const jwtSecret = 'abc123abc123abc123'

const mongo = process.env.MONGO || 'mongodb://localhost/minhas-series-rest'
const port = process.env.PORT || 3000
const app = express()

app.use(cors({
    origin: (origin, callback) => {
        if (origin === 'http://server2:8080') {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}))

app.use(bodyParser.json())
app.use('/series', series)
app.use('/users', users)

app.post('/auth', async (req, res) => {
    const user = req.body
    const userDb = await User.findOne({ username: user.username })

    if (userDb) {
        if (userDb.password === user.password) {
            const payload = {
                id: userDb._id,
                username: userDb.username,
                roles: userDb.roles
            }
            const token = jwt.sign(payload, jwtSecret)

            res.send({
                success: true,
                token: token
            })
        } else {
            res.send({ success: false, message: 'Wrong credentials' })
        }
    } else {
        res.send({ success: false, message: 'Wrong credentials' })
    }
})

const createInitialUsers = async () => {
    const total = await User.countDocuments({})

    if (total === 0) {
        const user = new User({
            username: 'anderson',
            password: '123456',
            roles: ['admin', 'restrito']
        })
        await user.save()

        const user2 = new User({
            username: 'restrito',
            password: '123456',
            roles: ['restrito']
        })
        await user2.save()
    }
}
mongoose
    .connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        createInitialUsers()
        app.listen(port, () => console.log('Server is running...'))
    })
    .catch(e => {
        console.log(e)
    })