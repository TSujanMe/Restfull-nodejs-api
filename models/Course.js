const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please ass course title  "]
    },
    description: {
        type: String,
        required: [true, "Please add a description "]
    },
    weeks: {
        type: String,
        required: [true, "Please add a number of weeks  "]
    },
    tuition: {
        type: Number,
        required: [true, "Please add a Tution Costs   "]
    },
    minimumSkill: {
        type: String,
        required: [true, "Please add a Minimun Skills    "],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
});


// whrn we call static it directly on model like 
// Model.GOFInd() this is the static 


// meethods is goona  be impleted on wwhatever we get from the model like 
// const courses  = Model.find();
// courses.goFind()






// static  method to get average of the course tuition 
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: "$tuition" }
            }
        }
    ])

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        })
    } catch (err) {
        console.log(err)
    }

}






// call getAverageCost after save  

CourseSchema.post("save", function () {
    this.constructor.getAverageCost(this.bootcamp)
});


// call getAverageCost before save 
CourseSchema.pre("remove", function () {
    this.constructor.getAverageCost(this.bootcamp)

});


module.exports = mongoose.model("course", CourseSchema)

