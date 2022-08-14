const { MongoClient, ObjectID } = require('mongodb')

const dbName = 'task-manager'
const url = process.env.MONGODB_URI

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log(err)
  }
  // console.log('Connected to MongoDB')
  const db = client.db(dbName)

  db.collection('task')
    .deleteOne({
      description: 'get a hair cut',
    })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
})
