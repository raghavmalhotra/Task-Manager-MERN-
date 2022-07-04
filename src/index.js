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
app.post('/users', (req, res) => {

    
    const user = new User(req.body);
    

    user.save().then(() => {
        res.status(201).send(user);
    }
    ).catch((err) => {
        res.status(400).send(err);
    }   )


}
)


//creating a task

app.post('/tasks',(req,res) =>{

    const task = new Task(req.body)
    task.save().then(() =>{
        res.status(201).send(task)
    }).catch(err =>{
        res.status(400).send(err);
    })
})

// getting all users
app.get('/users', (req,res) =>{
    User.find({}).then(users =>{
        res.send(users)
    }).catch(err =>{
        res.status(400).send(err)
    })
})


// getting a user by id
app.get('/users/:id',(req,res) =>{
    const id = req.params.id;
    //console.log(id);
    User.findById(id).then(user =>{
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }).catch(err =>{
        res.status(400).send(err);
    })
})


// getting a task by id
app.get('/tasks/:id',(req,res) =>{
    const id = req.params.id;

    Task.findById(id).then(task =>{
        
        !task ?  res.status(404).send() : res.status(200).send(task)
    }).catch(err => {
        res.status(400).send(err)
    })
})

// getting all the freakin tasks in the wide flat world

app.get('/tasks', (req,res) =>{
    Task.find({}).then(tasks =>{
        res.status(200).send(tasks)
    }).catch(err => {
        res.status(400).send(err)
    })
})


app.listen(port, () => {
    console.log(`listening on port ${port}`);
}
);

