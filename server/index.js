import express from 'express'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import 'express-async-errors'
import errHandler from './middleware/errHandler'

import userRouter from './router/user'
import articleRouter from './router/article'
import profileRouter from './router/profile'
import uploadRouter from './router/upload'

const app = express()

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

  app.use(express.json())
  app.use(userRouter)
  app.use(profileRouter)
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
