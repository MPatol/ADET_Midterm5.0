const express = require('express');
const { getAllstudent, getstudentById, createstudent, updatestudent, deletestudent } =  require('../controllers/studentController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllstudent);
router.get('/:id', authenticateToken, getstudentById);
router.post('/', authenticateToken, createstudent);
router.put('/:id', authenticateToken, updatestudent);
router.delete('/:id', authenticateToken, deletestudent);

module.exports = router;