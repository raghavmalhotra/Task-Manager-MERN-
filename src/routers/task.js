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

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.status(200).send(tasks)
  } catch (err) {
    res.status(400).send(err)
  }
})

// getting a task by id
router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    !task ? res.status(404).send('task not found') : res.status(200).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// updating a task

router.patch('/tasks/:id', async (req, res) => {
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

    const task = await Task.findById(req.params.id)

    userSentUpdateFields.forEach((update) => (task[update] = req.body[update]))
    await task.save()
    !task ? res.status(404).send() : res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// deleting a task

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    !task
      ? res
          .status(404)
          .send({ error: 'the task with that id doesnt even exist' })
      : res.status(200).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

module.exports = router
