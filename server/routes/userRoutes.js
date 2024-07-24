const router = require('express').Router();
const userController = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');

router.post("/register",userController.createUser);
router.post("/login",userController.loginUser);
router.get("/profile",authMiddleware,userController.getProfile);

module.exports =  router ;