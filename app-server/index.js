import Ml from "./ml";
const express = require('express')
const router = express.Router()

let app = express()

let ml = new Ml()

app.get('/api/predict', (req, res) => {
    ml.getPrediction().then((result) => {
        res.send(result.toString())
    }, (err) => {
        console.log(err)
    })
})

app.get('/api/train', (req, res) => {
    ml.startTraining()
    res.send('training')
})

app.listen(3005)