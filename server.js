const config = require('./config')
require('./config/passport')
require('express-async-errors')

const passport = require('passport')
const express = require('express')
const app = express()
require('express-ws')(app)

if (config.get('proxy'))
  app
    .set('trust proxy', config.get('proxy:trust'))
    .use(require('express-sslify').HTTPS(config.get('proxy:enforceHTTPS')))

app
  .use(require('express-request-id')(config.get('requestId')))
  .use(require('./middlewares/request-logger'))
  .use(require('helmet')())
  .use(require('cors')({ origin: true }))
  .use(require('./middlewares/session'))
  .use(require('./middlewares/ratelimiter'))
  .use(express.json())
  .use(require('express-query-boolean')())
  .use(passport.initialize())
  .use(passport.session())
  .use(require('./routes'))
  // eslint-disable-next-line no-unused-vars
  .use((req, res, next) => res.sendStatus(404))
  .use(require('./middlewares/error-handler'))

// jest runs multiple instances of the server, so it results in port conflict
if (config.get('node:env') != 'test')
  app
    .listen(config.get('port'), function(err) {
      if (err) throw err
      const log = require('./lib/logger')
      log.info('Server listening on port', this.address().port)
    })
    .setTimeout(config.get('timeout'))

module.exports = app
