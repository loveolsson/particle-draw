var express = require('express')
var app = express()

app.use(express.static('html'));
app.use('/bower_components', express.static('bower_components'))

app.listen(8080)
