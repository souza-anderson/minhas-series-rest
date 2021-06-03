const express = require('express')
const router = express.Router()
const Serie = require('../models/serie')

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