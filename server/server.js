const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());
const path = require("path");
connectDB();
const routes = require("./routes");

app.use("/uploads",express.static(path.join(__dirname, "uploads")));

app.use("/api",routes);
app.use("/",(req,res)=>{
res.send("SERVER RUNNING ")
})
app.use(express.json());

app.listen(port, () => console.log(`Server running on port ${port}`));