const express = require('express');
const { getAllcourse, getcourseById, createcourse, updatecourse, deletecourse } =  require('../controllers/courseController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllcourse);
router.get('/:id', authenticateToken, getcourseById);
router.post('/', authenticateToken, createcourse);
router.put('/:id', authenticateToken, updatecourse);
router.delete('/:id', authenticateToken, deletecourse);

module.exports = router;