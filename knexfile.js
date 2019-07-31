// we only need to load environment when we use knex cli,
// which means NODE_ENV isn't loaded by nodemon, jest, or pm2/heroku
const cliMode = !process.env.NODE_ENV
if (cliMode) require("dotenv-defaults").config()

const { types } = require("pg")
const dayjs = require("dayjs")
types.setTypeParser(20, parseInt) // cast SELECT COUNT(*) to integer
types.setTypeParser(1082, obj => dayjs(obj).format("YYYY-MM-DD"))

const { knexSnakeCaseMappers } = require("objection")

module.exports = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  debug: cliMode,
  ...knexSnakeCaseMappers()
}