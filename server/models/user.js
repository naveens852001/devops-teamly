const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  salary: Number,
  category: String,
  position: String,
  image: String,
  dob: Date,
  gender: String,
  bankAccount: Number,
  mobileNumber: { type: Number, }, 
  bankAccount: { type: Number, },
  AadharID:{type:Number, match: /^\d{12}$/},
  PanCard:{type:String},
  IFSC: { type: String},
  taxId: Number,
  postGraduation: String,
  graduation: String,
  mobileNumber:Number,
  

});

const newEmployeeSchema = new mongoose.Schema({
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
    ref: 'newEmployee',
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



const userModel = mongoose.model("User", userSchema)
const newEmployeeModel = mongoose.model("newEmployee", newEmployeeSchema)
const LeaveModel = mongoose.model("newLeave", LeaveSchema)
const HisotryModel = mongoose.model("newHistory", HistorySchema)
const eventModel = mongoose.model("newEvent", eventSchema)
const Position = mongoose.model('Position', positionSchema);
const TrainingModule = mongoose.model('TrainingModule', trainingModuleSchema);
const empModule = mongoose.model('empModule', employeeModuleSchema);

module.exports = { userModel, newEmployeeModel, LeaveModel, HisotryModel, eventModel, Position, TrainingModule, empModule };
