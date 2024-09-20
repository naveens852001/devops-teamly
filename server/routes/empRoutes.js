const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const {
    emplogin,
    empdetail,
    leaveReq,
    leavereqEmp,
    leaveWithdrawEmp,
    empHistory,
    getempHistory,
    getAllEmployees,
    empHistoryDelete,
    empModuleStatus,
    getempModule,
    incompleteModule,
    Empforgotpassword,
    EmpresetPassword
    
} = require("../controllers/empController");
const { empModule } = require("../models/user");

const allowedOrigins = [
    'http://localhost:10000',      // Localhost for development
    'https://hrms.devopsfarm.in'  // Production URL
  ];
  
  // Set up CORS configuration
  router.use(cors({
    credentials: true, // Allow credentials if needed (for cookies, etc.)
    origin: function (origin, callback) {
      // Allow requests with no origin, such as mobile apps or curl requests
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));
router.post("/employee/employee_login", emplogin);
router.get("/employee/detail/:id",empdetail);
router.post("/employee/leave_request",leaveReq);
router.get("/employee/leavereqEmp/:id", leavereqEmp);
router.delete("/employee/leaveWithdrawEmp/:id", leaveWithdrawEmp);
router.post("/employee/leave_request",leaveReq);
router.post("/employee/employment/:id",empHistory);
router.get("/employee/employment_history/:id",getempHistory);
router.get('/employees', getAllEmployees);
router.delete("/employee/empHistoryDelete/:id",empHistoryDelete);
router.post("/employee/completedModules", empModuleStatus);
router.get("/employee/:employeeId/completedModules", getempModule);
router.get('/employee/:employeeId/incompleteModules',incompleteModule);
router.post('/emp-forgot-password', Empforgotpassword);
router.post('/emp-reset-password', EmpresetPassword);

router.get("/emp_Logout",async (req,res)=>{
    try {
        console.log("Logout request received"); // Debug log
        res.clearCookie('token'); // Clear the authentication cookie
        console.log("Cookie cleared"); // Debug log
        return res.json({ Status: true, Message: "Logout successful" });
    } catch (error) {
        console.log("Logout error:", error); // Debug log
        return res.json({ Status: false, Error: error.message });
    }
});

module.exports = router;