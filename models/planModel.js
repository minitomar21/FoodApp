const mongoose = require('mongoose');
const {db_link} = require('../secret');
// Mongo DB

mongoose.connect(db_link)
.then((db)=>{
    // console.log(db);
    console.log("Plan Database Connected Successfully");
})
.catch((err)=>{
    console.log(err);
})


// planSchema
const planSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxlength:[20,'plan name should not exceed more than 20 characters']
    },
    duration:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:[true,'price not entered']
    },
    ratingsAverage:{
        type:Number
    },
    discount:{
        type:Number,
        validate:[function(){
            return this.discount<100;
        },'dicound should not exceed price']
    }
});


//Model
const planModel = mongoose.model('planModel',planSchema);


// // demo object via IFEE
// (async function createPlan(){
    // let planObj = {
    //     name:'SuperFood',
    //     duration:30,
    //     price:1000,
    //     ratingsAverage:5,
    //     discount:20
    // }

//     let data = await planModel.create(planObj);
//     console.log(data);

//     // const doc = await planModel(planObj);
//     // await doc.Save();
// })();


module.exports = planModel;