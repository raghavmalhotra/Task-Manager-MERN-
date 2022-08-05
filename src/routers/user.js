const express = require('express')
const auth = require('../middlewares/auth')
const router = express.Router()
const User = require('../models/user')

// creating a user
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    const token = await user.generateAuthToken()
    await user.save()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

// loging a user in
router.post('/users/login', async (req, res) => {
  try {
    // a custom made function
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

// loging a user out (current session)

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// logging out from all sessions ()

router.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.status(200).send()
  } catch (e) {
    res.status(500).send()
  }
})

// getting logged in users profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// updating a user

router.patch('/users/me', auth, async (req, res) => {
  // making sure that user can only update the fields that are allowed
  const updates = Object.keys(req.body)
  const allowedUpdateFields = ['name', 'email', 'password', 'age']

  const isValidUpdate = updates.every((update) =>
    allowedUpdateFields.includes(update)
  )

  if (!isValidUpdate) {
    return res.status(400).send({ error: 'invalid update' })
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]))
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})

// deleting a user

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})

module.exports = router
