const express = require('express');
const multer = require('multer');
const {getUser,updateUser,deleteUser,getAllUsers, updateProfileImage} = require('../controller/userController');
const {signup,login,isAuthorised,protectRoute,logout,forgetpassword,resetpassword} = require('../controller/authController');
const userRouter = express.Router();

// user's option
userRouter
.route('/:id')
.patch(updateUser)
.delete(deleteUser)

// signup
userRouter
.route('/signup')
.post(signup)

// login
userRouter
.route('/login')
.post(login)


//logout
userRouter
.route('/logout')
.get(logout)

userRouter
.route('/forgetpassword')
.post(forgetpassword)

userRouter
.route('/resetpassword/:token')
.post(resetpassword)

// multer for fileupload

// upload -> storage,filter
const multerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'C:/Users/Mini/Documents/BackendWithExpress (1)/BackendWithExpress/video-40/images')
    },
    filename:function(req,file,cb){
        cb(null,`user-${Date.now()}.jpeg`)
    }
});

const filter = function(req,file,cb){
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb(new Error("Not an Image! Please upload an image"),false)
    }
}

const upload = multer({
    Storage: multerStorage,
    fileFilter: filter
});

//profile page
userRouter.post("/ProfileImage",upload.single('photo'),updateProfileImage);

userRouter.get('/ProfileImage',(req,res)=>{
    res.sendFile("C:/Users/Mini/Documents/BackendWithExpress (1)/BackendWithExpress/video-40/multer.html");
});

//profile page
userRouter.use(protectRoute)
userRouter
.route('/userProfile')
.get(getUser)


// admin specific
userRouter.use(isAuthorised(['admin']));
userRouter
.route('/')
.get(getAllUsers)

module.exports = userRouter;