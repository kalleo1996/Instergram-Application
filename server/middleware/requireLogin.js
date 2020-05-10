
const jwt = require('jsonwebtoken')
const{JWT_SECRET}=require('../keys')
const mongoose = require('mongoose')
const User =mongoose.model("User")

module.exports=(req,res,next)=>{
    const {authorization} = req.headers //token is attached to header
    //authorization == Bearer icbcbbeuyrbvhfe //this is how we receive the token
    if(!authorization){
       return res.status(401).json({error:"you must logged in to the account"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must logged in to the account"})
        }

        const {_id}= payload
        User.findById(_id).then(userdata=>{
            req.user=userdata
            next()
        })
        

    })


}