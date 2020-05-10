const express = require('express')
const app= express()
const mongoose = require('mongoose')
const PORT = 5000
const {MONGOURI}=require('./keys')



mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected',()=>{
    console.log("Mongoose connected yeah")
})

mongoose.connection.on('error',(err)=>{
    console.log("error connecting",err)
})
//P7YJ9nI10Y583bli




require('./models/user')
require('./models/post')
//mongoose.model("User")

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))


app.listen(PORT,()=>{
    console.log("server is running on ",PORT)
})