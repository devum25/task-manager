const jwt = require('jsonwebtoken')
const User = require('../src/models/user')


const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer','')
        const decoded = jwt.verify(token.trim(),'walmarttokengeneration')
        const user = await User.findOne({_id:decoded._id.toString(),'tokens.token':token.trim()})

       if(!user)
           throw new Error()
           
           req.token = token.trim()
           req.user = user

           next()
    }
    catch(e){
        res.status(401).send({error:'Please authenticate!'})
    }


}


module.exports = auth

