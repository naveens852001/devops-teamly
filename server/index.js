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
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://hrms.devopsfarm.in',  // Production URL
      'http://localhost:5173'        // Vite development URL
    ];
    console.log('Request Origin:', origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow credentials (cookies)
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// JWT verification middleware
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.json({ Status: false, Error: "Wrong Token" });
      }
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    res.json({ Status: false, Error: "Not Authenticated" });
  }
};

// WebSocket setup
const employeeSocketMap = new Map();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://hrms.devopsfarm.in', 'http://localhost:5173'],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("message", (data) => {
    io.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    for (const [employeeId, socketId] of employeeSocketMap.entries()) {
      if (socketId === socket.id) {
        employeeSocketMap.delete(employeeId);
        break;
      }
    }
  });
});

// Routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/empRoutes"));
app.use("/", require("./routes/paymentRoutes"));

app.get("/getkey", (req, res) => res.status(200).json({ key: process.env.RAZORPAY_API_KEY }));

app.get("/verify", verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});


// Serve static files from the React app (dist folder)
const distPath = path.join(__dirname, "../client/dist");
app.use(express.static(distPath));

// Debugging to check if `index.html` is available
app.get("*", (req, res) => {
  const indexFilePath = path.join(distPath, "index.html")
  fs.access(indexFilePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("index.html not found:", indexFilePath);
      return res.status(404).send("index.html not found");
    } else {
      console.log("index.html found, sending file:", indexFilePath);
      res.sendFile(indexFilePath);
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
