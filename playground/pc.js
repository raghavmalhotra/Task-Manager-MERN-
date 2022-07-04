// promise chaining

require('../src/db/mongoose')
const User = require ('../src/models/user')


const updateAgeAndCount = async (id, newAge) =>{
    const foundUser = await User.findByIdAndUpdate(id, {age:newAge})
    const docCount = await User.countDocuments({age: 56})
    return docCount;
    }


    updateAgeAndCount("62c1fd308fc79185c9e126ea", 56)
        .then(res => console.log(res))

// User.findByIdAndUpdate("62c1fd308fc79185c9e126ea", {age:26}).then (user =>{
//     console.log(user)
//     return User.countDocuments({age: 26})
// }).then(result =>{
//     console.log(result)
// }).catch(err => {
//     console.log(err)
// })