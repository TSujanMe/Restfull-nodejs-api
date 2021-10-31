const jwt  = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');
const User = require('../models/User');


exports.protect =asyncHandler(async(req,res,next)=>{
let token;
if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
    token = req.headers.authorization.split(" ")[1];

}
// this is how we get token from the cookies 

//else if (req.cookies.token){
    // token  = req.cookies.token
//}

// make sure token exists / 


if (!token){
    return next(new ErrorResponse(" Not authorized to access this route please loggged in   ",401));
}

try{
    // verify token  
    const decoded = jwt.verify(token,'SECRET');
    console.log(decoded)
    req.user =  await User.findById(decoded.id)
   
    next()

}catch(err){
    return next(new ErrorResponse(" Not authorized to access this route please loggged in   ",401));

}

});



// grant accces to specefic roles  


exports.authorize = ( ...roles)=>{
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)){
        return next(new ErrorResponse(" use rrole is not auhorized to do this action     ",401));
        }
        next()
    }
}

