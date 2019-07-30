const session = require("express-session")
const RedisStore = require("connect-redis")(session)
const client = require("../services/redis")
const nanoid = require("nanoid/non-secure")

module.exports = session({
  store: new RedisStore({ client, logErrors: true }),
  secret: process.env.SESSION_SECRET,
  cookie: {
    sameSite: "lax", // CSRF protection
    httpOnly: true,
    maxAge: process.env.SESSION_MAXAGE_SECONDS * 1000
  },
  resave: false, // redis-session has touch implementation
  saveUninitialized: false, // GDPR compliance
  // this is to allow search by user id
  // see: https://github.com/jaredhanson/passport/blob/master/lib/sessionmanager.js#L21
  genid: req => `${req._passport.session.user.id}:${nanoid(10)}`
})
