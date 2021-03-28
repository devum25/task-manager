require('../src/db/mongoose.js')
const User = require('../src/models/user.js')

// User.findByIdAndUpdate('605709bdea59974d4c9518c3',{age:34}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:34})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })



// Async Await Syntax

const updateAgeAndGetCount = async (id,age)=>{

    const user = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return count

}

updateAgeAndGetCount('605709bdea59974d4c9518c3',21).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})