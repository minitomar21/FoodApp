const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {sendMail} = require("../utility/nodemailer")
const {JWT_KEY} = require('../secret');

module.exports.signup = async function signup(req,res){
   try {
        let dataObj = req.body;
        let user = await userModel.create(dataObj);
        sendMail("signup",user);
        if(user){
            return res.json({
                message:"user signed up",
                data:user
            });
        }else{
            return res.json({
                message:"error while signing up"
            })
        }
   } catch (error) {
    res.json({
        message:error.message
    })
   }
}

module.exports.login = async function login(req,res){
    try{
        let data = req.body;
        if(data.email){
            let user = await userModel.findOne({email:data.email});
            if(user){
                if(user.password==data.password){
                    // setting the cookie for further use
                    let payload = user['_id'];
                    let token = jwt.sign({payload:payload},JWT_KEY)
                    res.cookie('isLoggedIn',token,{httpOnly:true});
                    return res.json({
                        message:"User has logged in",
                        userDetails:data
                    });
                }else{
                    return res.json({
                        message:'wrong credentials'
                    })
                }

            }else{
                return res.json({
                    message:'User not found'
                })
            }
        }else{
            return res.json({
                message:"Empty field"
            })
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

module.exports.isAuthorised = function isAuthorised(roles){
    return function(req,res,next){
        if(roles.includes(req.role)==true){
            next();
        }else{
            res.status(401).json({
                message:'operation not allowed'
            })
        }
    }
}

module.exports.protectRoute = async function protectRoute(req,res,next){
    try {
        let token;
        if(req.cookies.isLoggedIn){
            token = req.cookies.isLoggedIn;
            console.log(token);
            const {payload} = jwt.verify(token,JWT_KEY);
            if(payload){
                console.log(payload);
                const user = await userModel.findById(payload);
                req.role = user.role;
                req.id = user.id;
                next();
            }else{
                return res.json({
                    message:'user not verified'
                })
            }
        }else{
            //browser
            const client = req.get('User-Agent');
            if(client.includes("Mozilla")==true){
                return res.redirect('/login');
            }
            //postman
            return res.json({
                message:'please login'
            });
        }
    } catch (error) {
        res.json({
            message:error.message
        })
    }
}

module.exports.forgetpassword = async function forgetpassword(req,res){
    let {email} = req.body;
    try {
        let user = await userModel.findOne({email:email})
        if(user){
            // createResestToken is used to create new token
            const resetToken = user.createResestToken;
            let resetPasswordLink = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
            // send email to the user via nodemailer
            let obj = {
                resetPasswordLink:resetPasswordLink,
                email:email
            }
            sendMail("resetpassword",obj);
            return res.json({
                message:'password updated mail sent successfully'
            })
        }else{
            return res.json({
                message:"please signup"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports.resetpassword = async function resetpassword(req,res){
  try {
    const token = req.params.token;
    let {password,confirmPassword} = req.body;
    const user = await userModel.findOne({resetToken:token})
    if(user){
         // resetPasswordHandler will update user in db
        user.resetPasswordHandler(password,confirmPassword);
        await user.save();
        res.json({
            message:"password changed successfully please login again"
        })
    }else{
        res.json({
            message:"user not found"
        })
    }
  } catch (error) {
    res.json({
        message:error.message
    })
  }
}

module.exports.logout = async function logout(req,res){
    res.cookie('isLoggedIn',' ',{maxAge:1})
    res.json({
        message:'user logged out succesfully'
    })
}
