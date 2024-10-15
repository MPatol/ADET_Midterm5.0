const express = require('express');
const { getAlldept, getdeptById, createdept, updatedept, deletedept } =  require('../controllers/deptController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAlldept);
router.get('/:id', authenticateToken, getdeptById);
router.post('/', authenticateToken, createdept);
router.put('/:id', authenticateToken, updatedept);
router.delete('/:id', authenticateToken, deletedept);

module.exports = router;