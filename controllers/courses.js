const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

const Bootcamp = require('../models/Bootcamp');



// @desc           GET all bootcamps  
// @route          GET   api/v1/courses 
// @route          GET   api/v1/bootcamps /:bootcampId/courses
// @acccess        public  

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId })
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: "name , description "
        })
    }
    const courses = await query;
    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
});


// @desc           GET single course  
// @route          GET   api/v1/courses/:id
// @acccess        public  

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description"
    });

    if (!course) {
        return next(new ErrorResponse(`No course with that id of ${req.params.id} `), 404)

    }

    res.status(200).json({
        success: true,
        data: course
    })

});


// @desc         add  course   
// @route          POST   api/v1/bootcamps/:bootcampId/courses
// @acccess        PRIVATE  

exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;


    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp with id  with that id of ${req.params.bootcampId} `), 404)

    }

    // make sure that this is course owner 

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`user ${req.user.id} is not authorize to add a course  `, 404)
        );
    }


    const course = await Course.create(req.body)

    res.status(200).json({
        success: true,
        data: course
    })

});

// @desc         update   course   
// @route          PUT   api/v1/bootcamps/:bootcampId/courses/
// @acccess        PRIVATE  

exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No Bootcamp with id  with that id of ${req.params.bootcampId} `), 404)

    }

    // make sure that user is couyrse owner 
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`user ${req.user.id} is not authorize to update `, 404)
        );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: course
    })

});
// @desc         delete   course   
// @route          DELETE   api/v1/bootcamps/:bootcampId/courses/
// @acccess        public  

exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No Bootcamp with id  with that id of ${req.params.bootcampId} `), 404)

    }
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`user ${req.params.id} is not authorize to delete `, 404)
        );
    }

    course.remove()


    res.status(200).json({
        success: true,
        data: "Date Deleted Succesfully "
    })

});
