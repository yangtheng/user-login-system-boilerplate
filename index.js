require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')

const dbName = process.env.DATABASE_NAME

const url = process.env.MLAB_URI || `mongodb://localhost:27017/${dbName}`

mongoose.Promise = global.Promise
mongoose.connect(url, {
  useNewUrlParser: true
}).then(
  function () {
    console.log(`connected successfully to ${url}`)
  },
  function (err) {
    console.log(err)
  }
)

const app = express()

let whitelist = ['http://localhost:3000']

var corsOptionsDelegate = function (req, callback) {
  let corsOptions
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate))

app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

app.use(bodyParser.json())

const usersRoute = require('./routes/userRoute')

app.get('/', (req, res) => {
  res.send('Invalid Endpoint')
})

app.use('/users', usersRoute)

const port = process.env.PORT || 3001
app.listen(port, function () {
  console.log(`express is running on ${port}`)
})
