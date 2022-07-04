const mongoose = require('mongoose');
const validator = require('validator');
// mongoose.connect('mongodb://localhost:27017/task-manager-api')



const User = mongoose.model('User',{
    name: {
        type: String,
        required: true,
        trim: true

    },
    age: {
        type: Number,
        default: 0,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim:true,
        minLength: 7,
        validate (value){
            if(value.includes('password')){
                throw new Error("password cannot be password. I mean come on!")
            }
        }
    }
})

module.exports = User;