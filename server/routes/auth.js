const express= require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET}=require('../keys')

const requireLogin = require('../middleware/requireLogin')

router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello user")
})





router.post('/signup',(req,res)=>{
    const {name,email,password}= req.body;
    console.log(req.body.name)
if(!email || !name || !password)
{
    //422 server has understood the request but cannot process
  return  res.status(422).json({error:"please fill all the fields"})
}

User.findOne({email:email})
.then((savedUser)=>{
    if(savedUser){
        return res.status(422).json({error:"user already exists with that email"})
    }
     
    //before sending the data to the database encrypt the password

    bcrypt.hash(password,12)
    .then(hashedpassword=>{
        const user = new User({
            email:email,
            password:hashedpassword,
            name:name
        })
    
        user.save()
        .then(user=>{
            res.json({message:"saves succesfully"})
        })
        .catch(err=>{
            console.log(err)
        })
    })
 
})
.catch(err=>{
    console.log(err)
})
//res.json({message:"successfully registered"})



})

router.post('/signin',(req,res)=>{
    const{email,password}=req.body
    if(!email || !password){
        return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(SavedUser=>{
        if(!SavedUser){
            return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,SavedUser.password)
        .then(doMatch=>{
            if(doMatch){
               // res.json({message:"succesfully signed in"})

               const token = jwt.sign({_id:SavedUser._id},JWT_SECRET)
               const {_id,name,email} = SavedUser
               res.json({token,user:{_id,name,email}})

            }else{
                return res.status(422).json({error:"Invalid Email or Password"})
            }
            
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})



module.exports = router