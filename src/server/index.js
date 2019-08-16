const express = require('express')
const cors = require('cors')
// const { Nuxt, Builder } = require('nuxt')
const app = express()
const api = require('./api.js')

// Import and Set Nuxt.js options
// const nuxtConfig = require('../../nuxt.config.js')
// nuxtConfig.dev = process.env.NODE_ENV !== 'production'

// Init Nuxt.js
// const nuxt = new Nuxt(nuxtConfig)

// const { host, port } = nuxt.options.server

// Build only in dev mode
// if (nuxtConfig.dev) {
//   const builder = new Builder(nuxt)
//   builder.build()
// } else {
//   nuxt.ready()
// }

// Give nuxt middleware to express
// app.use(nuxt.render)

// cors
app.use(cors())

// api router
app.use(api)

// Listen the server
const host = '0.0.0.0'
const port = '4100'

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`)
})
