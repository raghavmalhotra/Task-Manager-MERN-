const express = require('express')
require('./db/mongoose')

// loading routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const User = require('./models/user')
const app = express()
const port = process.env.PORT || 3000

// express.json is used to parse the body of the request
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
  const Task = require('./models/task')
  const User = require('./models/user')
})

const main = async () => {
  const user = await User.findById('62ec28021606162881684338')
  await user.populate('tasks')
  console.log(user.tasks)
}

main().catch((err) => {
  console.log(err)
})

//   }
