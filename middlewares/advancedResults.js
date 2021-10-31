const advancedResults = (Model, populate) => async(req, res, next) => {
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
    query = Model.find(JSON.parse(queryStr))


    // select fields  
    if(req.query.select) {
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
const total = await Model.countDocuments()
query = query.skip(startIndex).limit(limit);
if (populate) {
    query = query.populate(populate)
}


// execute in query 
const results = await query

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

    res.advancedReslts = {
        success: true,
        count: results.length,
        pagination,

        data: results
    }
}
next()

}

module.exports = advancedResults;