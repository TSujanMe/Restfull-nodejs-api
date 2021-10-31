const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const geocoder = require('../utils/geocoder');
const path = require('path');



// @desc           GET all bootcamps  
// @route          GET   api/v1/bootcamps 
// @acccess        public  
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    // coyy req.query 
    const reqQuery = { ...req.query }

    // create query string  
    const removeFields = ['select', 'sort', 'page', 'limit']
    // loop over remove fields and delete them from reqQuery 
    removeFields.forEach(param => delete reqQuery[param]);
    let queryStr = JSON.stringify(reqQuery)

    // create operators  ( $gt , $gte etc ...)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // findin the resources 
    query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");




    // select fields  
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }

    // sort  
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }


    // pagination  

    const page = parseInt(req.query.page, 10) || 1

    const limit = parseInt(req.params.limit, 10) || 100

    const startIndex = (page - 1) * limit
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments()
    query = query.skip(startIndex).limit(limit)


    // execute in query 
    const bootcamp = await query

    // pagincation results 
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(201).send({
        success: true,
        count: bootcamp.length,
        pagination,
        data: bootcamp
    })
});




// @desc           GET single  bootcamps  
// @route          GET   api/v1/bootcamps /:id
// @acccess        public  
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById({ _id: req.params.id });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with given id -> ${req.params.id} `, 404))
    }
    res.status(201).send({
        success: true,
        data: bootcamp
    });

});




// @desc           CREATE new bootcamps   
// @route          POST   api/v1/bootcamps 
// @acccess        PRIVATE  

exports.createBootcamps = asyncHandler(async (req, res, next) => {
    // add user  to req.body 

    req.body.user = req.user.id;

    // / check for published boookcamps 
    const publishedBootcamps = await Bootcamp.findOne({ user: req.user.id })
    // if the user isnot an admin they can only ooe bootcamp  
    if (publishedBootcamps && req.user.role !== 'admin') {
        return next(new ErrorResponse(`the user with id ${req.user.id} has already published a bootcamps `))
    }

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    })
});



// @desc           PUT   bootcamps 
// @route          PUT    api/v1/bootcamps:/id
// @acccess        PRIVATE   

exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }
    // make usr is bootcamp owner  

    if (bootcamp.user.toString() !==req.user.id && req.user.role !=='admin'){
        return next(
            new ErrorResponse(`user ${req.params.id} is not authorize to update `, 404)
        );
    }
    bootcamp = await bootcamp.findByIdAndUpdate(req.params.id , req.body, { new: true, runValidators: true })

    res.status(201).json({
        success: true,
        data: bootcamp
    })


});





// @desc           DELETE    specefic  bootcamp by given id 
// @route          DELETE    api/v1/bootcamps:/id
// @acccess        PRIVATE 

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }


    if (bootcamp.user.toString() !==req.user.id && req.user.role !=='admin'){
        return next(
            new ErrorResponse(`user ${req.params.id} is not authorize to delete `, 404)
        );
    }


    // in the bootcamp moidel we used that pre remove middlware and this onl;y works whne i removes but nort works in findByIdAndDelete etc ... so we are using this link that 
    bootcamp.remove()
    res.status(201).json({
        success: true,
        data: {}
    })

});



// @desc           DELETE     delete all the bootcamps  bootcamp  
// @route          DELETE    api/v1/bootcamps
// @acccess        PRIVATE 

exports.deleteBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.deleteMany();
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        )
    };
    res.status(201).json({
        success: true,
        data: {}
    })

});

// @desc           GET      get bootcamps within the radious   
// @route          GET     api/v1/bootcamps/radious/:zipcode/:distance
// @acccess        PRIVATE 

exports.getBootcampsInRadious = asyncHandler(async (req, res, next) => {

    const { zipcode, distance } = req.params;

    // get latitude and longitude from geocder  
    const loc = await geocoder.geocode(zipcode)
    console.log(loc)
    const lat = loc[0].latitude;   //lat refers to the latutude 
    const lng = loc[0].latitude;  // refers to the longitude 


    // calc reduis using radious  
    // divide distace by radious of earth 
    // earth raduis = 3963 miles / 4,378km 

    const radious = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radious] } }
    });


    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })

});


// @desc           upload photo for bootcamp   
// @route          PUT   api/v1/bootcamps /:id/photo
// @acccess        private   
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with given id -> ${req.params.id} `, 404))
    }
    if (!req.files) {
        return next(new ErrorResponse(`PLeqase upload  file  `, 404))
    }
    const file = req.files.file
    // console.log(req.files)
    if (bootcamp.user.toString() !==req.user.id && req.user.role !=='admin'){
        return next(
            new ErrorResponse(`user ${req.params.id} is not authorize to delete `, 404)
        );
    }

    //  make sure that image is photo 
    if (!file.mimeType.startsWith('image')) {
        return next(new ErrorResponse(`PLease upload a valid image file   `, 404))

    }

    const maxfileupload = 1000000
    const fileuploadpath = './public/images'

    // // chech file size  

    if (file.size > maxfileupload) {
        return next(new ErrorResponse("file TOo Larrge ", 400))
    }


    // // create a custom filename  
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`


    file.mv(`${fileuploadpath}/${file.name}`, async err => {
        if (err) {
            return next(new ErrorResponse("Problem with file upload  ", 400))
            console.log(err)
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
        res.status(200).json({
            success: true,
            data: file.name
        })
    })
});

