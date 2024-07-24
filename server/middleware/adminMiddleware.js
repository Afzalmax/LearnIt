const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const admin = await Admin.findOne({ _id: decoded.id });
        if (!admin) {
            return res.status(401).json({ message: "Invalid token" });
        }

        if (!admin.isAdmin) {  // Assuming `isAdmin` is a field in your Admin model
            return res.status(403).json({ message: "Access forbidden: Admins only" });
        }

        req.user = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = adminMiddleware;
