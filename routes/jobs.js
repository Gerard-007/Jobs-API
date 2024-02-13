const express = require('express');
const router = express.Router()

const {
    jobList,
    jobDetail,
    jobCreate,
    jobUpdate,
    jobDelete
} = require('../controllers/jobs')

router.route('/').get(jobList).post(jobCreate)
router.route('/:id').get(jobDetail).patch(jobUpdate).delete(jobDelete)

module.exports = router