const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const cors = require("cors");
const multer = require("multer")
const path = require("path")

dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL , {useNewUrlParser: true , useUnifiedTopology: true});
    console.log("Connected to MongoDB !!!!!!");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

app.use("/images", express.static(path.join(__dirname , "public/images")));

//middleware
app.use(cors({
  origin: "*"
}))
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination:(req , file , cb)=>{
    cb(null,"public/images");
  },
  filename:(req , file , cb)=>{
    //const nm = String(req.body.name);
    const time = Date.now();
    //time+file.originalname
    //console.log("reqlllllllllllllllllllllllllllllllllllllllllllllllllllll");
    console.log(req.body.name);
    //console.log(req.body.toString());
    cb(null , req.body.name);
  }
})

const upload = multer({storage});
app.post("/api/upload" , upload.single("file") , (req , res) => {
  //console.log("reqlllllllllllllllllllllllllllllllllllllllllllllllllllll");
  //console.log(req);
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.log(error)
  }
})


app.use("/api/auth" , authRoute);
app.use("/api/users" , userRoute);
app.use("/api/posts" , postRoute);
app.use("/api/conversations" , conversationRoute);
app.use("/api/messages" , messageRoute);


app.listen(8800, () => {
  connect();
  console.log("Backend Server Started!!");
});
