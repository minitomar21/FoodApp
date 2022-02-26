const express = require('express');
const bookingRouter = express.Router();
const { protectRoute } = require("../controller/authController");
const { createSession } = require('../controller/bookingController');


bookingRouter.post('/createSession',protectRoute,createSession)
bookingRouter.get('/createSession',function(req,res){
    res.sendFile("C:/Users/Mini/Documents/BackendWithExpress (1)/BackendWithExpress/video-40/booking.html");
})

module.exports = bookingRouter;