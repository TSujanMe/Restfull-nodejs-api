const express = require('express');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload')
require('./config/db')();
const errorHandler = require('./middlewares/error');
// LOAD env files 
dotenv.config({ path: './config/config.env' })
const path = require('path')




// route files 
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

// middlewares packages //
const morgan = require('morgan');
const cookieParser = require('cookie-parser')

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use(cookieParser())


// DEV logging middlewars 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.use(fileUpload())


// set static folder
 
app.use(express.static(path.join(__dirname,'public')))

// mount routers 
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);


// error handler middleware always must be at last middleware 
app.use(errorHandler)







// logout route  from cookie 
//  exports.logout = asyncHandler(async(req,res,next)=>{
//     res.cookie('token',"none",{
//         expires: new Date(Date.now( )+10 *1000),
//         httpOnly:true
//     })
//  }


// security measus 


// data sanitixation  

// app.use(mongosanitize())

// set seciroty headers
// app.use(helmet())

// prevent xsss attack 
// app.use(xxs())
 
// const limiter =  rateLimit({
//     windowMs:10*40*1000. // 10 min 
//     max:1,
// })


// app.use(limiter)


// prevent htttp params pollution 
// app.use(hpp())


const server = app.listen(PORT, () => {
    console.log('listening to the port on 5000 ')
});


// handle unhandle promise rejection  


process.on('unhandledRejection', (err, promise) => {
    console.log("Error", err.message)
    // close the server and exit  
    server.close(() => {
        process.exit(1)
    })
})