const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 10000;
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io"); 






// Database connection
const MONGODB_URL= process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();




// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,"Public")));
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));



// Serve index.html for all other routes

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const allowedOrigins = [
  'https://hrms.devopsfarm.in',  // Production URL
  'http://localhost:5173'        // Vite development URL
];

 app.use(
  cors({
    origin: function (origin, callback) {
      // Debug logging to understand which origin is being rejected
      console.log('Request Origin:', origin);
      
      // Check if the request origin is in the allowed origins list or if no origin (for non-browser requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,  // Allow credentials
  })
);


const employeeSocketMap = new Map();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: `https://hrms.devopsfarm.in`,
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
  console.log('Received Token:', token);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        console.error('Token Verification Error:', error); // Debug log
        return res.json({ Status: false, Error: "Wrong Token" });
      }
      
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    console.log('No Token Found'); 
    res.json({ Status: false, Error: "Not Authenticated" });
  }
};




app.get("/verify", verifyuser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});





// Start server
server.listen(PORT || 10000, () => {
  console.log(`Listening at port ${process.env.PORT || 10000}`);
});

