const { Router } = require('express')

module.exports = Router()
  // istanbul ignore next
  .get('/', (req, res) => res.sendStatus(200))
  .use(require('./sessions'))
  .use(require('./users'))
