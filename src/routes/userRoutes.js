const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(requireAuth);

router.get('/dashboard-data', userController.getDashboardData);
router.post('/enroll', userController.enrollCourse);

module.exports = router;
