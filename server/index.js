const express = require('express')
const path = require('path')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))

app.use(express.static(path.join(__dirname, '../public')))

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'))
})

app.listen(3000, () => {
  console.log('Listening on port 3000.')
})
