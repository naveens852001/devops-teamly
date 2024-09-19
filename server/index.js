const express = require("express");
require("dotenv").config();
const PORT=process.env.PORT||8000;
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io"); 






// Database connection
const dbURI = process.env.MONGODB_URL;
mongoose
  .connect(dbURI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("Public"));
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));



app.use(
  cors({
    origin: "http://localhost:5173", // Allow only this origin
    credentials: true, // Allow credentials if needed
  })
);

const employeeSocketMap = new Map();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("message", (data) => {
    console.log(data);  
    io.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove the disconnected socket from the map
    for (const [employeeId, socketId] of employeeSocketMap.entries()) {
      if (socketId === socket.id) {
        employeeSocketMap.delete(employeeId);
        console.log(`Removed employee ${employeeId} from socket map`);
        break;
      }
    }
  });
});



// Routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/empRoutes"));
app.use("/", require("./routes/paymentRoutes")); // Handle checkout routes under '/checkout'
app.get("/getkey",(req,res)=>res.status(200).json({key:process.env.RAZORPAY_API_KEY}))

// JWT verification middleware
const verifyuser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) return res.json({ Status: false, Error: "Wrong Token" });
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    res.json({ Status: false, Error: "Not Authenticated" });
  }
};




app.get("/verify", verifyuser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});

// Start server
server.listen(PORT || 8000, () => {
  console.log(`Listening at port ${process.env.PORT || 8000}`);
});

