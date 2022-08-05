const express = require('express')
require('./db/mongoose')

// loading routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// express.json is used to parse the body of the request
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

// const jwt = require('jsonwebtoken')
// const myFunction = async () => {
//   const token = jwt.sign({ _id: 'abc123' }, 'hithisisrandomsentence')
//   return token
// }

// myFunction()
//   .then((result) => {
//     console.log(result)
//   })
//   .catch((err) => {
//     console.log(err)
//   })
