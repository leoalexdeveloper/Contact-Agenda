require('dotenv').config()
const path = require('path')

const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, './public')))

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, './src/views'))

const helmet = require('helmet')
app.use(helmet())

const mongoose = require('mongoose')
mongoose.connect(process.env.mongoDb)
  .then(connection => {
    console.log('MongoDb are running')
    app.emit('DatabaseIsUp')
  })
  .catch(e => console.log(e))

const MongoStore = require('connect-mongo')
const session = require('express-session')

const sessionOptions = session({
  secret: 'foo',
  store: MongoStore.create({ mongoUrl: process.env.mongoDb }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true
  }
})
app.use(sessionOptions)

const flash = require('connect-flash')
app.use(flash())

const csrf = require('csurf')
app.use(csrf())

const { msgs, csrfError, generateCsrfToken } = require('./src/middlewares/globalMiddlewares')
app.use(msgs)
app.use(csrfError)
app.use(generateCsrfToken)

const routes = require('./routes')
app.use(routes)

app.on('DatabaseIsUp', () => {
  app.listen(8000, () => {
    console.log('Server are running')
  })
})
