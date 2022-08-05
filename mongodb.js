const { MongoClient, ObjectID } = require('mongodb')

const dbName = 'task-manager'
const url = 'mongodb://127.0.0.1:27017'

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log(err)
  }
  // console.log('Connected to MongoDB')
  const db = client.db(dbName)

  //    db.collection('users').findOne({age: 25}, (err, result) => {
  //        if (err) {
  //            return console.log(err)
  //            }
  //            c onsole.log(result)
  //            }
  //          )

  // db.collection("task").findOne({_id : ObjectID("62c1334e642fc728d03c4896") },(err,result) =>{
  //     if(err){
  //         return console.log("killed the fkin program since i found an error mah frnd!!");
  //     }
  //     console.log(result);
  // })

  // db.collection("task").find({completed : false}).toArray((err,result) =>{
  //     if(err){
  //         return console.log("error");
  //     }

  //     console.log(result);
  // })

  //   db.collection('users').updateOne({
  //         age : 25
  //     },
  //     {
  //         $set: {
  //             name: 'pawan'
  //         }
  //     }).then(result =>{
  //         console.log(result);
  //     }).catch(err =>{
  //         console.log(err);
  //     })

  // db.collection('task').updateMany({
  //     completed: false
  // },
  // {
  //     $set: {
  //         completed: true
  //     }
  // }).then(result =>{
  //     console.log(result);
  // }).catch(err =>{
  //     console.log(err);
  // })

  // db.collection('users').deleteMany({
  //     age: 27
  // }).then(res =>{
  //     console.log(res);
  // }).catch(err =>{
  //     console.log(err);
  // })

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
