const router = require('express').Router();
const { getBootcamps, getBootcampsInRadious, bootcampPhotoUpload, getBootcamp, deleteBootcamps, createBootcamps, updateBootcamp, deleteBootcamp } = require('../controllers/bootcamps');

const { protect,authorize } = require('../middlewares/auth')



// include the other resourrces router

const courseRouter = require('./courses');


// re-route into other resources routers/

router.use('/:bootcampId/courses', courseRouter)


router.route('/:id/photo').put(protect, bootcampPhotoUpload)

// we have a short process 
// both have same route 

router.route('/radious/:zipcode/:distance').get(getBootcampsInRadious)


router.route('/').get(getBootcamps).post(protect,authorize('publisher',"admin"), createBootcamps)

router.route('/:id').get(getBootcamp)
.put(protect,authorize('publisher',"admin"),updateBootcamp)
.delete(protect,authorize('publisher',"admin"), deleteBootcamp);


module.exports = router;