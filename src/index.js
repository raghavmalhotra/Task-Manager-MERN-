const express = require('express');
require('./db/mongoose')

// loading the models (mongoose)
const User = require('./models/user')
const Task = require('./models/task')

const app = express();
const port = process.env.PORT || 3000;

// parses the body to json
app.use(express.json());



// -------------------------     Route Handeling     -------------------

// creating a user
app.post('/users', async (req, res) => {
    const user = new User(req.body);

    try{
        await user.save()
        res.status(201).send(user)

    }catch (e){
        res.status(400).send(e)
    }
  
    // user.save().then(() => {
    //     res.status(201).send(user);
    // }
    // ).catch((err) => {
    //     res.status(400).send(err);
    // }   )

}
)


//creating a task

app.post('/tasks',async (req,res) =>{

    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})



// getting all users
app.get('/users', async (req,res) =>{

    try{
       const users =  await User.find({})
       res.status(200).send(users)
    }catch(e){
        res.status(500).send(err)
    }
 })


// getting a user by id
app.get('/users/:id',async(req,res) =>{

    try{
        const user = await User.findById(req.params.id)

        !user ? res.status(404).send("user not found") : res.status(200).send(user)
    }catch(err){
        res.status(400).send(err);
    }
})


// getting a task by id
app.get('/tasks/:id',async (req,res) =>{
    try{
        const task = await Task.findById(req.params.id);
        !task ?  res.status(404).send("task not found") : res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

// getting all the freakin tasks in the wide flat world

app.get('/tasks', async (req,res) =>{

    try{
        const tasks = await Task.find({})
        res.status(200).send(tasks)

    }catch (err){
        res.status(400).send(err)
    }

})


app.listen(port, () => {
    console.log(`listening on port ${port}`);
}
);

