const express = require("express")
require('./db/mongoose.js')
const User = require('./models/user.js')
const Task = require('./models/task.js')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')


const app = express()

const port = process.env.PORT 
console.log(process.env.SENDGRID_API_KEY)


app.use(express.json())

app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is running on port: ' + port);
})




