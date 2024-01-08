const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require ('cors')
const userController=require('./controllers/user')

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect('mongodb://127.0.0.1:27017/test').then((success)=>
        console.log("connected to database"))
    .catch((err)=>{
        console.log("connection error")
    

});


app.post('/signup', userController.signup)
app.post('/signin', userController.signin)
app.post('/submit-otp', userController.submitotp)
app.post('/send-otp', userController.sendotp)

app.listen(5000, () => {
  console.log(`Backend Running At port 5000`)
})