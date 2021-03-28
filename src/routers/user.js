const User = require('../models/user.js')
const express = require('express');
const auth = require('../../middleware/auth.js');
const multer = require('multer')
const router = new express.Router();

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
          if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
               return cb(new Error('Please upload an image'))
          }
          cb(undefined,true)
    }
})

router.get('/users/me',auth,async (req, res) => {

    try {
        res.status(200).send(req.user)
    }
    catch (e) {
        res.status(500).send(e)
    }

    // User.find({}).then((users)=>{

    //     res.status(200).send(users);

    // }).catch((e)=>{
    //     res.status(500).send(e);
    // })
})


router.get('/users/:id', async (req, res) => {

    const _id = req.params.id;

    try {
        const user = await User.findById(_id)
        if (!user) res.status(404).send('User not found')

        res.status(200).send(user)

    }
    catch (e) {
        res.status(400).send(e)
    }


    // User.findById(_id).then((user)=>{
    //          if(!user) return res.status(404).send()

    //          res.status(200).send(user)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save()
      const token = await user.getUserAuthToken()
        res.status(201).send({user,token})
    }
    catch (e) {
        res.status(400).send(e)
    }

    // user.save().then(()=>{
    //       res.status(201).send(user);
    // }).catch((err)=>{
    //        res.status(400);
    //        res.send(err);
    // })


})


router.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid operation!' })

    try {
        const user = User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!user) return res.status(404).send({ error: 'User not found!' })

        res.status(200).send(user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


router.post('/users/login',async (req,res)=>{
    try{
        console.log(req.body.email,req.body.password)
    const user = await User.findUserByCredentials(req.body.email,req.body.password);
    console.log(user)
    const token = await user.getUserAuthToken()

    console.log(user)

    res.send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try{
          req.user.tokens = req.user.tokens.filter((token)=>{
              return token.token !== req.token
          })

          await req.user.save()
          res.send()
    }
    catch(e){
         res.status(500).send(e)
    }


})


router.post('/users/logoutall',auth,async(req,res)=>{
    try{
         req.user.tokens = [];

         await req.user.save()

         res.send()

    }
    catch(e){
        res.status(500).send(e)
    }


})

router.delete('/users/me',auth,async (req,res)=>{
    try{
       
        
         const user = await  req.user.remove()

         res.send(user)

    }
    catch(e)
    {
        res.status(500).send(e)
    }
})

//Endpoint to upload image
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})


router.get('/user/:id/avatar',auth,async (req,res)=>{
    try{
    const user = await User.findById(req.params.id.toString())

    if(!user || !user.avatar){
        return res.status(404).send()
    }

    res.set('Content-Type','image/jpg')
    res.send(user.avatar)
}
catch(e){
    res.status(404).send(e)
}
})

module.exports = router