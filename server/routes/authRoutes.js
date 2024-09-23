const express = require("express");
const router = express.Router();
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const {
    loginUser,
    addEmployee,
    getAllAdmins,
    getEmployee,
    deleteEmployee,
    specificEmployee,
    editEmployee,
    adminCount,
    salCount,
    empCount,
    adminRecords,
    deleteAdmin,
    logout,
    leavereq,
    leaveStatus,
    pendingRequest,
    editAdmin,
    getAdmin,
    payroll,
    allpendingRequest,
    event,
    getEvent,
    deleteEvent,
    registerAdmin,
    positions,
    addPosition,
    deletePosition,
    trainingMaterial,
    AddtrainingMaterial,
    deleteMaterial,
    upcomingleaves,
    forgotpassword,
    resetPassword
} = require("../controllers/authController");
const { TrainingMaterial } = require("../models/user");

//Middleware
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:10000',      
    'https://hrms.devopsfarm.in'
  ];

  router.use(cors({
    credentials: true, 
    origin: function (origin, callback) {
     
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));

//Routes
router.post("/login", loginUser);
router.post("/register", registerAdmin);
router.get('/admins', getAllAdmins);
router.get("/logout", logout);
router.get("/employee", getEmployee);
router.get("/employee/:id", specificEmployee);

router.get("/admin/:id", getAdmin);
router.put("/edit_admin/:id", editAdmin);

const storage = multer.diskStorage({
    destination:  (req, file, cb) => {
     return   cb(null, "../client/public/images");
    },
    filename: (req, file, cb) => {
      return  cb(
            null,
            `${Date.now()}-${file.originalname}`
        );
    },
});

const upload = multer({ storage});

router.get('/departments', (req, res) => {
    res.send(['IT', 'Software', 'Law', 'Finance']); // Example departments
  });

router.post("/add_employee", upload.single("image"),addEmployee);
router.put("/edit_employee/:id", editEmployee);

router.delete("/delete_employee/:id", deleteEmployee);
router.delete("/delete_admin/:id", deleteAdmin);
router.get("/leave_requests", leavereq);
router.post("/leave_requests/:id", leaveStatus);
router.get("/payroll", payroll);
router.post("/event", event);
router.get("/events", getEvent);
router.delete("/event_delete/:id", deleteEvent);

router.get("/pending_leave_requests", allpendingRequest);
router.get("/pending_leave_requests/:id", pendingRequest);

router.get("/admin_records", adminRecords);
router.get("/admin_count", adminCount);
router.get("/employee_count", empCount);
router.get("/salary_count", salCount);

router.get('/positions', positions);
router.post('/positions', addPosition);
router.delete('/positions/:id',deletePosition);
router.get('/trainingModules',trainingMaterial);
router.post('/trainingModules', AddtrainingMaterial);
router.delete('/trainingModules/:id', deleteMaterial);
router.get('/upcoming-leave', upcomingleaves);
router.post('/forgot-password',forgotpassword);
router.post('/reset-password',resetPassword);
module.exports = router;
