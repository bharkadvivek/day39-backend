const UserModel = require("../models/user");
const nodemailer = require('nodemailer');

module.exports.signup = (req, res) => {
  console.log(req.body);

  //email should not exist already

  const newUser = new UserModel({
    email: req.body.email,
    password: req.body.password,
  });

  newUser
    .save()
    .then(() => {
      res.send({ code: 200, message: "Signup success" })
    })
    .catch((err) => {
      res.send({ code: 500, message: "Signup error" })
    })
};

module.exports.signin = (req, res) => {
  console.log(req.body.email);

  UserModel
    .findOne({ email: req.body.email })
    .then(result => {
      console.log(result, "11")
      if (result.password !== req.body.password) {
        res.send({ code: 404, message: "password wrong" })
      } else {
        res.send({
            email:result.email,
          code: 200,
          message: "User found",
          token: "hfgdhg",
        })
      }
    })
    .catch(err => {
      res.send({ code: 500, message: "user not found" });
    });
  //email should not exist already

  // const newUser = new userModel({
  //     email: req.body.email,
  //     password: req.body.password
  // });

  // newUser.save().then(() => {
  //     res.send({ code: 200, message: "Signin success"})
  // })
  // .catch((error) => {
  //     res.send({ code: 500, message: "Signin error"})
  // })
};


module.exports.sendotp =async (req, res) => {
    console.log(req.body)

    const _otp =Math.floor(100000 + Math.random() * 900000)
    let user = await UserModel.findOne({ email: req.body.email})
    if (!user){
        res.send({ code: 500, message: 'user not found'})
    }
        let testAccount = await  nodemailer.createTestAccount()

        let transporter = nodemailer.createTransport({
            
            host:"smtp.ethereal.email",
            port: 587,
            secure:false,
            auth:{
                user:testAccount.user,
                pass:testAccount.pass
            }
            
        })

        let info = await transporter.sendMail({
            from: 'bharkdavivek@gmail.com',
            to: req.body.email,
            subject:'OTP',
            text: String(_otp),
            html: `<html>
            <body>
            Hello and Welcome
            </>
            </html>`,
        })

        if (info.messageId){
            console.log(info, 84)
            UserModel.updateOne({email: req.body.email}, {otp:_otp})
            .then(result =>{
                res.send({ code: 200, message: 'otp send'})

            })
            .catch(err=>{
                res.send({ code: 500, message: 'Server error'})

            })
        }else{
            res.send({ code: 500, message: 'Server error'})

        }
    }



        

//     }).catch(error =>{
//         res.send({ code: 500, message: 'user not found'})
//     })



module.exports.submitotp =(req, res) => {
    console.log(req.body)

    UserModel.findOne({ otp: req.body.otp}).then(result =>{
        UserModel.updateOne({email: result.email}, { password: req.body.password})
        .then(result =>{
            res.send({ code: 200, message: 'password updated'})
        })
        .catch(error =>{
        res.send({ code: 500, message: 'server error'})
    })
}).catch(err =>{
    res.send({ code: 500, message: 'Otp is wrong'})
})
}