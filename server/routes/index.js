const router = require('express').Router();
const postRoutes = require('./postRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
