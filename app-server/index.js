const express = require('express')
const router = express.Router()

let app = express()

app.get('/api/', (req, res) => {
    res.writeHead(200, '', {
        'Content-Type': 'application/json'
    })
    res.end()
})

app.listen(3005)