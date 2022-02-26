const planModel = require('../models/planModel');

module.exports.getAllPlans = async function getAllPlans(req,res){
    try {
        let plans = await planModel.find();
        if(plans){
            return res.json({
                message:'all plans retrieved',
                data:plans
            })
        }else{
            return res.json({
                message:'plans not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports.getPlan = async function getPlan(req,res){
    try {
        let id = req.params.id;
        let plan = await planModel.findById(id);
        if(plan){
            return res.json({
                message:'plan retrieved',
                data:plan
            })
        }else{
            return res.json({
                message:'plan not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports.createPlan = async function createPlan(req,res){
    try {
        let planData = req.body;
        let createPlanData = await planModel.create(planData);
        if(createPlanData){
            return res.json({
                message:'plan created successfully',
                data:createPlanData
            })
        }else{
            return res.json({
                message:'error occured while creating plan'
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports.deletePlan = async function deletePlan(req,res){
    try {
        let id = req.params.id;
        let deletedplan = await planModel.findByIdAndDelete(id);
        if(deletedplan){
            return res.json({
                message:'plan deleted successfully',
                data:deletedplan
            })
        }else{
            return res.json({
                message:'plan not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports.updatePlan = async function updatePlan(req,res){
    try {
        let id = req.params.id;
        let dataToBeUpdated = req.body;
        let plan = await planModel.findById(id);
        if(plan){
            for(key in dataToBeUpdated){
                plan[key] = dataToBeUpdated[key];
            }
            // save the updated plan
            await plan.save();
            return res.json({
                message:'plan updated successfully',
                data:plan
            })
        }else{
            return res.json({
                message:'plan not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports.top3Plans = async function top3Plans(req,res){
    try {
        const top3 = await planModel.find().sort({ratingsAverage:-1}).limit(3);
        return res.json({
            message:'top3 plans',
            data:top3
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}