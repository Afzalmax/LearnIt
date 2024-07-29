const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');  // Assuming the multer setup is in a file named multerConfig.js
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/create', authMiddleware, upload.single('image'), postController.createPost);
router.get('/getallpost',authMiddleware,postController.getAllPosts);
router.delete('/delete/:id',adminMiddleware,postController.deletePost);
router.put('/approve/:id', adminMiddleware, postController.approvePost);
router.get('/pendingposts', adminMiddleware, postController.getPendingPosts);
router.delete('/reject/:id', adminMiddleware, postController.rejectPost);
router.post('/adminpost',adminMiddleware,upload.single('image'),postController.adminCreatePost)
module.exports = router;