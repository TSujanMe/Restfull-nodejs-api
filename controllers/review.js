const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc           GET all bootcamps  
// @route          GET   api/v1/courses 
// @route          GET   api/v1/bootcamps /:bootcampId/review
// @acccess        public  

exports.getReview = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        const review  =await  Review.find({ bootcamp: req.params.bootcampId })
    }
    res.status(200).json({
        success: true,
        count: courses.length,
        data: review
    })
});
