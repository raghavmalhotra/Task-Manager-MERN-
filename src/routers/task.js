const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middlewares/auth')

//creating a task

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// getting all  tasks

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createdAt:desc

router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}
  if (req.query.completed) {
    console.log(req.query.completed)
    match.completed = req.query.completed === 'true'
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')

    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    })
    //console.log(req.user.tasks)
    //const tasks = await Task.find({ owner: req.user._id })

    res.status(200).send(req.user.tasks)
  } catch (err) {
    res.status(400).send(err)
  }
})

// getting a task by id
router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    !task ? res.status(404).send('task not found') : res.status(200).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// updating a task

router.patch('/tasks/:id', auth, async (req, res) => {
  const userSentUpdateFields = Object.keys(req.body)
  const allowedUpdateFields = ['description', 'completed']

  const isValidField = userSentUpdateFields.every((update) =>
    allowedUpdateFields.includes(update)
  )

  if (!isValidField) {
    res.status(400).send({ error: 'this field is not allowed to be updated' })
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // })
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }
    userSentUpdateFields.forEach((update) => (task[update] = req.body[update]))
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// deleting a task

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    })
    if (!task) {
      return res.status(404).send()
    }
    res.status(200).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

module.exports = router
