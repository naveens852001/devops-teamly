const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  salary: Number,
  category: String,
  position: String,
  image: String,
  dob: Date,
  gender: String,

  mobileNumber: { type: Number, }, 
  bankAccount: { type: Number, },
  AadharID:{type:Number, match: /^\d{12}$/},
  PanCard:{type:String},
  IFSC: { type: String},
  taxId: Number,
  postGraduation: String,
  graduation: String,
  
  

});

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  salary: Number,
  state:String,
  Country:String,
  category: String,
  position: String,
  image: String,
  dob: Date,
  gender: String,
  mobilnumber: { type: Number,  }, 
  bankAccount: { type: Number,  },
  AadharID:{type:Number, match: /^\d{12}$/},
  PanCard:{type:String,},
  IFSC: { type: String,},
  taxId: Number,
  postGraduation: String,
  Graduation: String,
  

});

const LeaveSchema = new mongoose.Schema({
  empid: String,
  email: String,
  name: String,
  fromdate: Date,
  todate: Date,
  reason: String,
  status: {
    type: String,
    default: "Pending",
  },
});

const HistorySchema = new mongoose.Schema({
  companyName: String,
  jobTitle: String,
  startDate: String,
  endDate: String,
  jobDescription: String,
  userId: String,
});

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  additional: String,
});

const positionSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const trainingModuleSchema = new mongoose.Schema({
  name: String,
  file: String,
  department: String,
});

const employeeModuleSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AllEmployees',
    required: true
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingModule',
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});



const AdminModel = mongoose.model("Admin", adminSchema)
const AllEmployeeModel = mongoose.model("AllEmployees", EmployeeSchema)
const LeaveModel = mongoose.model("newLeave", LeaveSchema)
const HisotryModel = mongoose.model("newHistory", HistorySchema)
const eventModel = mongoose.model("newEvent", eventSchema)
const Position = mongoose.model('Position', positionSchema);
const TrainingModule = mongoose.model('TrainingModule', trainingModuleSchema);
const empModule = mongoose.model('empModule', employeeModuleSchema);

module.exports = { AdminModel, AllEmployeeModel, LeaveModel, HisotryModel, eventModel, Position, TrainingModule, empModule };
