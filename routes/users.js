const { Router } = require("express")
const User = require("../models/user")
const { ensureIsSignedIn, ensureIsAdminOrSelf } = require("../middlewares/auth")

module.exports = Router()
  .get("/:username", (req, res) => {
    res.send(req.requestedUser)
  })
  .post("/", async (req, res) => {
    User.filterPost(req.body)

    const user = await User.query().insert(req.body)

    req.login(user, err => {
      if (err) throw err
      res.status(201).send(req.user)
    })
  })
  .patch(
    "/:username",
    ensureIsSignedIn,
    ensureIsAdminOrSelf,
    async (req, res) => {
      if (!req.user.isAdmin) User.filterPatch(req.body)

      const user = await req.requestedUser.$query().patch(req.body)

      res.send(user)
    }
  )
  .delete(
    "/:username",
    ensureIsSignedIn,
    ensureIsAdminOrSelf,
    async (req, res) => {
      await req.requestedUser.$query().delete()

      res.sendStatus(204)
    }
  )
