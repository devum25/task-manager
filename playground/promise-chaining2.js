require('../src/db/mongoose.js')
const Task = require('../src/models/task.js')

Task.findByIdAndRemove('605afa6ef2fda730b4b1a935').then((task)=>{
    console.log(task)
    return Task.countDocuments({completed:true})
}).then((task)=>{
    console.log(task)
}).catch((e)=>{
    console.log(e)
})