const mongoose = require('mongoose');
const {db_link} = require('../secret');

// Mongo DB

mongoose.connect(db_link)
.then((db)=>{
    // console.log(db);
    console.log("Review Database Connected Successfully");
})
.catch((err)=>{
    console.log(err);
})

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true,'review is required']
    },
    rating:{
        type:Number,
        min:1,
        max:10,
        required:[true,'rating is required']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'userModel',
        required:[true,'review must belong to a user']
    },
    plan:{
        type:mongoose.Schema.ObjectId,
        ref:'planModel',
        required:[true,'review must belong to a plan']
    }
});

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path:'user',
        select:'email name profileImage'
    }).populate('plan');
    next();
})

// Model
const reviewModel = mongoose.model('reviewModel',reviewSchema);

module.exports = reviewModel;