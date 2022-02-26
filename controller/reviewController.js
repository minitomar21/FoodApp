const reviewModel = require("../models/reviewModel")
const planModel = require("../models/planModel")

module.exports.getAllReviews = async function getAllReviews(req,res){
    try {
        const reviews = await reviewModel.find();
        if(reviews){
            return res.json({
                message:'reviews retrieved',
                data:reviews
            })
        }else{
            return res.json({
                message:'reviews not found'
            })
        }
    } catch (error) {
        res.json({
            message:error.message
        })
    }
}

module.exports.top3reviews = async function top3reviews(req,res){
    try {
        const reviews = await reviewModel.find().sort({rating:-1}).limit(3);
        if(reviews){
            return res.json({
                message:'top 3 reviews retrieved',
                data:reviews
            })
        }else{
            return res.json({
                message:'top 3 reviews not found'
            })
        }
    } catch (error) {
        res.json({
            message:error.message
        })
    }
}

module.exports.getPlanReviews = async function getPlanReviews(req,res){
    try {
        const id = req.params.id;
        const reviews = await reviewModel.find();
        const planReviews = reviews.filter(review=> review.plan._id==id)
        if(planReviews){
            return res.json({
                message:'plan reviews retrieved',
                data:planReviews
            })
        }else{
            return res.json({
                message:'reviews not found'
            })
        }
    } catch (error) {
        res.json({
            message:error.message
        })
    }
}

module.exports.createReview = async function createReview(req,res){
    try {
        const id = req.params.plan;
        const plan = await planModel.findById(id);
        if(plan){
            let review = await reviewModel.create(req.body);
            plan.ratingsAverage = (plan.ratingsAverage+req.body.rating)/2;
            await plan.save()
            return res.json({
                message:'review created',
                data:review
            })
        }else{
            return res.json({
                message:'plan not found'
            })
        }
    } catch (error) {
        res.json({
            message:error.message
        })
    }
}

module.exports.updateReview = async function updateReview(req,res){
    try {
        const planId = req.params.id;
        // review id from frontend
        const id = req.body.id;
        const dataToBeUpdated = req.body;
        const review = await reviewModel.findById(id);
        if(review){
            for(key in dataToBeUpdated){
                if(key=='id') continue;
                review[key] = dataToBeUpdated[key];
            }
            // save the updated plan
            await review.save();
            return res.json({
                message:'review updated',
                data:review
            })
        }else{
            return res.json({
                message:'review not found'
            })
        }
    } catch (error) {
        res.json({
            message:error.message
        })
    }
}

module.exports.deleteReview = async function deleteReview(req,res){
    try {
        const planId = req.params.id;
        // review id from frontend
        const id = req.body.id;
        const review = await reviewModel.findByIdAndDelete(id);
        if(review){
            return res.json({
                message:'review deleted',
                data:review
            })
        }else{
            return res.json({
                message:'error occured while deleting the review'
            })
        }
    } catch (error) {
        res.json({
            message:error.message
        })
    }
}