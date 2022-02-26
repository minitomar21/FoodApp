const userModel = require('../models/userModel');

module.exports.getUser = async function getUser(req,res){
    try {
        let id = req.id;
        let user = await userModel.findById(id);
        if(user){
            return res.json(user);
        }else{
            return res.json({
                message:'user not found'
            });
        }
    } catch (error) {
        res.json({
            message:error.message
        })
    }
    
}

module.exports.updateUser = async function updateUser(req,res){ 
    try {
        // update data in user object
        let id = req.params.id;
        let user = await userModel.findById(id);
        let dataToBeUpdated = req.body;
        if(user){
            for(let key in dataToBeUpdated){
                user[key] = dataToBeUpdated[key]
            }
            const updatedData = await user.save();
        
            res.json({
                message:"data updated successfully",
                user:user
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

module.exports.deleteUser = async function deleteUser(req,res){
    try {
        let id = req.params.id;
        let user = await userModel.findByIdAndDelete(id)
        
        if(!user){
            return res.json({
                message:"user not found"
            })
        }
        res.json({
            message:"data has been deleted",
            user:user
        })
    } catch (error) {
        res.json({
            message:error.message
        })
    }
}

module.exports.getAllUsers = async function getAllUsers(req,res){
    try {
        let users = await userModel.find();
        if(users){
            res.json({
                message:"users retrieved",
                data:users
            });
        }else{
            res.json({
                message:"DataBase empty"
            });
        }
    } catch (error) {
        res.json({
            message:error.message
        })
    }
    
}

module.exports.updateProfileImage = function updateProfileImage(req,res){
    res.json({
        message:'file upload successfully'
    })
}

