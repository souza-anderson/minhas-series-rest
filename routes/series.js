const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()
const Serie = require('../models/serie')

const jwtSecret = 'abc123abc123abc123'

router.use((req, res, next) => {
    const token = req.headers['x-access-token'] || req.body.token || req.query.token

    if (token) {
        const payload = jwt.verify(token, jwtSecret)

        if (payload.roles.indexOf('restrito') >= 0) {
            next()
        } else {
            res.send({ success: false })
        }
    } else {
        res.send({ success: false })
    }
})

router.get('/', async (req, res) => {
    const series = await Serie.find({})
    res.send(series)
})

router.post('/', async (req, res) => {
    const serie = new Serie(req.body)
    try {
        await serie.save()
        res.send(serie)
    } catch(e) {
        res.send({
            success: false,
            errors: Object.keys(e.errors)
        })
    }
})

router.put('/:id', async (req, res) => {
    const serie = await Serie.findOne({ _id: req.params.id })
    serie.name = req.body.name
    serie.status = req.body.status
    try {
        await serie.save()
        res.send(serie)
    } catch (e) {
        res.send({
            success: false,
            errors: Object.keys(e.errors)
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Serie.deleteOne({ _id: req.params.id })
        res.send({
            success: true
        })
    } catch (e) {
        res.send({
            success: false,
            errors: Object.keys(e.errors)
        })
    }

})

router.get('/:id', async (req, res) => {   
    const serie = await Serie.findOne({ _id: req.params.id })
    res.send(serie)
})

module.exports = router