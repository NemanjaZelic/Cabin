const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { protect, authorize } = require('../middleware/auth');
router.get('/cabin/:cabinId', commentController.getCommentsByCabin);
router.post('/', protect, authorize('turista'), commentController.createComment);
module.exports = router;
