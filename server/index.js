import express from 'express'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import 'express-async-errors'
import session from 'express-session'
import bodyParser from 'body-parser'
import redisStore from 'connect-redis'
import errHandler from './middleware/errHandler'
import auth from './middleware/auth'

import userRouter from './router/user'
import folderRouter from './router/folder'
import articleRouter from './router/article'
import profileRouter from './router/profile'
import uploadRouter from './router/upload'

import passport from 'passport'
import redisClient from './redis/client'

const app = express()
const RedisStore = redisStore(session)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(session({
    store: new RedisStore({
      client: redisClient
    }),
    secret: 'sdfoskdopfksd;fk',
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(auth())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use(userRouter)
  app.use(profileRouter)
  app.use(folderRouter)
  app.use(articleRouter)
  app.use(uploadRouter)
  app.use(errHandler)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
