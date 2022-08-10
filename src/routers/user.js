const express = require('express')
const auth = require('../middlewares/auth')
const router = express.Router()
const User = require('../models/user')
const multer = require('multer')

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

// uploading a profile picture
// multer is a middleware that is used to handle file uploads

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  },
})

router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send({ success: true })
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message })
  }
)

// deleting a profile picture
router.delete(
  '/users/me/avatar',
  auth,
  async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send({ message: 'avatar deleted' })
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message })
  }
)
// getting a profile picture
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send()
  }
})

module.exports = router
