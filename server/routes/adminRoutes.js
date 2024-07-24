const express = require('express');
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post("/register", adminController.createAdmin);
router.post("/login", adminController.loginAdmin);
router.post("/logout", adminMiddleware, adminController.logoutAdmin);




module.exports = router;
