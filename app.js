'use strict'

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('./src/io')(http)


app.use(express.static('dist'))

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

http.listen(3300, () => console.log('listening on *:3000'))
