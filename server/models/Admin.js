const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true  
    },      
    password: {         
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true  // Assuming all admin users are true by default
    }
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
