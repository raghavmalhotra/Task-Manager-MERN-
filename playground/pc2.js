// promise chaining
const mongoose = require('../src/db/mongoose')
const Task = require ('../src/models/task')

const delAndCount = async (id) =>{
    const task = await Task.findByIdAndDelete(id)
    const docCount = await Task.countDocuments({completed:false})
    return docCount
}


delAndCount("62c1fd308fc79185c9e126eb")
    .then(count => console.log(count))
    .catch(err => console.log(err))

// Task.findByIdAndDelete("62c20533c69dd60214ca1b4a")
//     .then(tasks => {
//         //console.log(tasks)
//         return Task.countDocuments({completed:false})
//     })
//     .then(res => {
//         console.log(res)
//     })
//     .catch(err => {
//         console.log(err)
//     })