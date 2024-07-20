const router = require('express').Router();
const userController = require('../controllers/userController');

const authMiddleware = require('../middleware/Authmiddleware');

router.post("/register",userController.createUser);
router.post("/login",userController.loginUser);
router.post("/profile",authMiddleware,userController.getProfile);
router.post('/getuser',authMiddleware,userController.getUser);
module.exports =  router ;