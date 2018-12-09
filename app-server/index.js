import Ml from "./ml";
const express = require('express')
const router = express.Router()

let app = express()

let ml = new Ml()

app.get('/api/', (req, res) => {
    ml.getPrediction().then((result) => {
        res.send(result.toString())
    }, (err) => {
        console.log(err)
    })
})

app.listen(3005)