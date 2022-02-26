var path = require('path');
global.appRoot = path.resolve(__dirname);

const express = require("express");
const app = express();
var cors = require('cors');
app.use(cors()) ;
//app.use(express.static('fp fr\build'));

const cookieParser=require('cookie-parser');
//middleware func-> post, front-> json
app.use(express.json()); //global middleware 
const port=process.env.PORT || 5000;
app.listen(port,function(){
    console.log(`server listening on port ${port}`); 
});
app.use(cookieParser());


const userRouter = require('./routers/userRouter');
const planRouter = require('./routers/planRouter');
const reviewRouter = require('./routers/reviewRouter');
const bookingRouter = require('./routers/bookingRouter');

app.use('/user',userRouter);
app.use('/plans',planRouter);
app.use('/reviews',reviewRouter);
app.use('/booking',bookingRouter);



