const Review = require('../models/Review');
const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middlewares/auth');

const { getReview } = require('../middlewares/review');


router.route('/').get(getReview);