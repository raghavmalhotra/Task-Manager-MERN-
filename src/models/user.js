const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// creating a schema for the user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
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
      if (!validator.isEmail(value)) {
        throw new Error('invalid email')
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(value) {
      if (value.includes('password')) {
        throw new Error('password cannot be password. I mean come on!')
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar: {
    type: Buffer,
  },
})

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
})

// creating a method for the user (instance methods) for logging in a user
userSchema.methods.generateAuthToken = async function () {
  const user = this // this is the user that is logged in
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET) // this is the secret
  user.tokens = user.tokens.concat({ token }) // concat is used to add a new element to an array
  await user.save() // saving the user
  return token // returning the token
}

// creating a model for the user
// wont send password and tokens to the client

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar
  return userObject
}

// it is used to greate a custom function (model function5)
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('email does not exist')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return new Error('password does not match')
  }
  return user
}

// middleware to hash the password before saving

userSchema.pre('save', async function (next) {
  const user = this
  // only hash the password if it has been modified (or is new)
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.pre('remove', async function (next) {
  const user = this
  //console.log(user, user._id)
  await Task.deleteMany({ Owner: user._id })

  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
