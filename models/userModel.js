const mongoose = require('mongoose');
const emailValidator = require('email-validator');
const {db_link} = require('../secret');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Mongo DB


mongoose.connect(db_link)
.then((db)=>{
    // console.log(db);
    console.log("User Database Connected Successfully");
})
.catch((err)=>{
    console.log(err);
})

// Schema
const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        validate:function(){
            return emailValidator.validate(this.email);
        }
    },
    password:{
        type:String,
        require:true,
        minLength:8
    },
    confirmPassword:{
        type:String,
        require:true,
        minLength:8,
        validate:function(){
            return this.confirmPassword==this.password;
        }
    },
    role:{
        type:String,
        enum:['admin','user','restaurantowner','deliveryboy'],
        default:'user'
    },
    profileImage:{
        type:String,
        default:'img/users/default.jpeg' 
    },
    resetToken:String
})


// MongoDB hooks (can be used for both save and remove)
// userSchema.pre('save',function(){
//     console.log('before saving in db',this);
// });

// userSchema.post('save',(doc)=>{
//     console.log('after saving in db',doc);
// });

// removing confirm password field
userSchema.pre('save',function(){
    this.confirmPassword = undefined;    
    console.log('removing confirm password field before saving',this);
});



// userSchema.pre('save',async function(){
//     let salt = await bcrypt.genSalt();    
//     console.log('hashing the password before saving');
//     let hashedString = await bcrypt.hash(this.password,salt);
//     this.password = hashedString;
// });


// attaching methods to schema

userSchema.methods.createResetToken=function(){
    // creating unique token using crypto
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler=function(password,confirmPassword){
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.resetToken = undefined;
}


// Model
const userModel = mongoose.model('userModel',userSchema);

module.exports = userModel;