const Task = require('../models/task.js')
const express = require('express');
const auth = require('../../middleware/auth.js');
const User = require('../models/user.js');
const router = new express.Router();





router.get('/tasks',auth, async (req, res) => {

     const match = {}

     if(req.params.completed){
         match = req.params.completed === 'true'
     }

    try {
       const user =  await req.user.populate({
           path:'tasks',
           match
       }).execPopulate()
        res.status(200).send(user.tasks)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


router.get('/tasks/:id',auth, async (req, res) => {

    try {

       const task = Task.findOne({_id:req.params.id,owner:req.user._id})
       if(!task) throw new Error()
        res.status(200).send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.post('/tasks',auth, async (req, res) => {
    const task = new Task({
          ...req.body,
          owner: req.user._id
    })


    try {
        await task.save()
        res.status(201).send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }

    //  task.save().then(()=>{
    //      res.status(201).send(task);
    //  }).catch((e)=>{
    //      res.status(400).send(e);
    //  })
})


router.patch('/tasks/:id', async (req, res) => {
 
   const updates = Object.keys(req.body)
   const allowedUpdates = ['description','completed']
   const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

   if(!isValidOperation) return res.status(400).send({error:'Invalid operation!'})

    try {
        const task = Task.findOne({_id:req.params.id,owner:req.user.id})
      //  const task = Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!task) return res.status(404).send({ error: 'Task not found!' })

        updates.forEach((update)=>task[update]=req.body[update])

        await task.save()

        res.status(200).send(task)


    }
    catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router