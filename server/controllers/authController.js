const jwt = require("jsonwebtoken");
const crypto = require('crypto-js');
const nodemailer = require('nodemailer');
require('dotenv').config();
const bcrypt = require('bcrypt');

// const { Server } = require("socket.io");

const { userModel, newEmployeeModel, LeaveModel, eventModel, Position, TrainingModule, empModule } = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                error: "Please Enter Your Credential To Continue",
            });
        }
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.json({
                error: "User not found",
            });
        }

        const match = await comparePassword(password, user.password);
        if (match) {
            const token = jwt.sign(
                { email: user.email, id: user._id, role: "admin" },
                process.env.SECRET_KEY,
                { expiresIn: "1d" }
            );
            // io.emit('register', userId);
            res.cookie("token", token).json({ Status: true, Result: user, id: user._id });
        } else {
            res.json({ error: "Please Check Your Password" });
        }
    } catch (error) {
        console.log(error);
    }
};

const getProfile = (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
            if (err) throw err;
            res.json(userInfo);
        });
    } else {
        res.json(null);
    }
};


const getAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.find({ _id: id });
        if (!user) {
            return res.json({
                Error: "No Admin Found",
                Status: false
            });
        }
        // console.log(user)
        res.json({ Status: true, Result: user })
    }
    catch {
        return res.json((error) => {
            console.log(error)
        })
    }
}
const getAllAdmins = async (req, res) => {
    try {
        // Fetch all users
        const admins = await userModel.find({});

        if (admins.length === 0) {
            return res.json({
                Error: "No Admins Found",
                Status: false
            });
        }

        res.json({ Status: true, Result: admins });
    } catch (error) {
        console.error('Error fetching all admins:', error); // Log the error for debugging
        return res.status(500).json({
            Error: "Failed to fetch admins",
            Status: false
        });
    }
}




const editAdmin = async (req, res) => {
    try {
        const { password, ...updateFields } = req.body;
        const employee = await userModel.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ Status: false, Message: "Admin not found" });
        }

        // Check if password needs to be updated
        if (password && password.trim() !== "") {
            const isMatch = await comparePassword(password, employee.password);
            if (!isMatch) {
                updateFields.password = await hashPassword(password);
            }
        }

        await userModel.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        res.json({ Status: true, Message: "Employee updated successfully" });

    } catch (error) {
        console.error("Failed to update employee:", error.message);
        res.status(500).json({ Status: false, Message: "Failed to update employee", Error: error.message });
    }
}

const registerAdmin = async (req, res) => {
    try {
        const { name,
            email,
            password,
            salary,
            address,
            category,
            position,
            dateofbirth,
            gender,
            martialStatus,
            bankAccount,
            taxId,
            postGraduation,
            graduation,
            schooling,
            doj } =
            req.body;
        //check if detail's was entered
        if (
            !name ||
            !email ||
            !password ||
            !address

        ) {
            return res.json({
                Error: `Input Argument is required`,
            });
        }
        if (password.length < 6) {
            return res.json({
                Error: "Password required should be of atleast 6 character long",
            });
        }
        const exist = await userModel.findOne({ email: email });
        if (exist) {
            return res.json({
                Error: "E-Mail Already Occupied",
            });
        }
        const hashedPassword = await hashPassword(password);
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            address,
            position,
            image: req.file ?
                req.file.filename : '',
            dateofbirth,
            gender,
            martialStatus,
            bankAccount,
            taxId,
            postGraduation,
            graduation,
            schooling,
            doj
        });
        return res.json({ Status: true });
    } catch (error) {
        console.log(error);
    }
};

const addEmployee = async (req, res) => {
    try {
        const { name,
            email,
            password,
            salary,
            address,
            category,
            position,
            dateofbirth,
            gender,
            martialStatus,
            bankAccount,
            taxId,
            postGraduation,
            graduation,
            schooling,
            doj } =
            req.body;
        //check if detail's was entered
        if (
            !name ||
            !email ||
            !password ||
            !salary ||
            !address ||
            !category
        ) {
            return res.json({
                Error: `Input Argument is required`,
            });
        }
        if (password.length < 6) {
            return res.json({
                Error: "Password required should be of atleast 6 character long",
            });
        }
        const exist = await newEmployeeModel.findOne({ email: email });
        if (exist) {
            return res.json({
                Error: "E-Mail Already Occupied",
            });
        }
        const hashedPassword = await hashPassword(password);
        const user = await newEmployeeModel.create({
            name,
            email,
            password: hashedPassword,
            salary,
            address,
            category,
            position,
            image: req.file ?
                req.file.filename : '',
            dateofbirth,
            gender,
            martialStatus,
            bankAccount,
            taxId,
            postGraduation,
            graduation,
            schooling,
            doj
        });
        return res.json({ Status: true });
    } catch (error) {
        console.log(error);
    }
};


const getEmployee = async (req, res) => {
    try {
        const user = await newEmployeeModel.find({});
        if (!user) {
            return res.json({
                Error: "No Employee Found",
                Status: false
            });
        }
        res.json({ Status: true, Result: user })
    }
    catch {
        return res.json(error)
    }
}

const specificEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await newEmployeeModel.find({ _id: id });
        if (!user) {
            return res.json({
                Error: "No Employee Found",
                Status: false
            });
        }
        console.log(user)
        res.json({ Status: true, Result: user })
    }
    catch {
        return res.json((error) => {
            console.log(error)
        })
    }
}

const editEmployee = async (req, res) => {
    try {
        const { password, ...updateFields } = req.body;
        const employee = await newEmployeeModel.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ Status: false, Message: "Employee not found" });
        }

        // Check if password needs to be updated
        if (password && password.trim() !== "") {
            const isMatch = await comparePassword(password, employee.password);
            if (!isMatch) {
                updateFields.password = await hashPassword(password);
            }
        }

        await newEmployeeModel.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        res.json({ Status: true, Message: "Employee updated successfully" });

    } catch (error) {
        console.error("Failed to update employee:", error.message);
        res.status(500).json({ Status: false, Message: "Failed to update employee", Error: error.message });
    }
}

const deleteEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await newEmployeeModel.deleteOne({ _id: id })
        return res.json({ Status: true, Result: user })
    } catch {
        console.log(error)
    }
}
const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.deleteOne({ _id: id })
        return res.json({ Status: true, Result: user })
    } catch {
        console.log(error)
    }

}
const adminCount = async (req, res) => {
    const user = await userModel.countDocuments()
    return res.json({ Status: true, Result: user })
}
const empCount = async (req, res) => {
    const user = await newEmployeeModel.countDocuments()
    return res.json({ Status: true, Result: user })
}
const salCount = async (req, res) => {
    const user = await newEmployeeModel.find();
    var total = 0;
    user.forEach((e) => {
        total = total + e.salary
    })
    return res.json({ Status: true, Result: total })

}

const adminRecords = async (req, res) => {
    const user = await userModel.find();
    return res.json({ Status: true, Result: user })
}

const logout = async (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: true })
}

const leavereq = async (req, res) => {
    const user = await LeaveModel.find({})
    return res.json({ Result: user })
}

const leaveStatus = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const user = await LeaveModel.updateOne({ _id: id }, {
        status: status
    })
    return res.json({ status: true })
}

const allpendingRequest = async (req, res) => {
    const user = await LeaveModel.find()
    return res.json({ Status: true, Result: user })
}

const pendingRequest = async (req, res) => {
    const id = req.params.id;
    const user = await LeaveModel.find({ empid: id })
    return res.json({ Status: true, Result: user })
}

const payroll = async (req, res) => {
    const user = await newEmployeeModel.find({})
    return res.json({ Status: true, Result: user });
}

const event = async (req, res) => {
    const { title, date, additional } = req.body
    const user = await eventModel.create({
        title, date, additional
    })
    res.json({ Status: true, Result: user })
}

const getEvent = async (req, res) => {
    try {
        const events = await eventModel.find({});
        return res.json({ Status: true, Result: events });
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.json({ Status: false, Message: 'Error fetching events' });
    }
}

const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await eventModel.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ Status: false, Message: "Event not found" });
        }
        return res.json({ Status: true });
    } catch (error) {
        console.log("Error deleting event:", error);
        return res.status(500).json({ Status: false, Message: "Error deleting event" });
    }
};

const positions = async (req, res) => {
    const positions = await Position.find();
    res.json(positions);
}

const addPosition = async (req, res) => {
    const { name, number } = req.body;
    const newPosition = new Position({ name, number });
    await newPosition.save();
    res.json(newPosition);
}

const deletePosition = async (req, res) => {
    await Position.findByIdAndDelete(req.params.id);
    res.json({ message: "Position deleted" });
}

const trainingMaterial = async (req, res) => {
    const modules = await TrainingModule.find();
    res.json(modules);
}

const AddtrainingMaterial = async (req, res) => {
    const { name, file, department } = req.body;
    const module = new TrainingModule({ name, file, department });
    await module.save();
    res.send(module);
}
const deleteMaterial = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the TrainingModule to delete
        const deletedTrainingModule = await TrainingModule.findByIdAndDelete(id);
        if (!deletedTrainingModule) {
            return res.status(404).json({ error: "TrainingModule not found" });
        }
        // Delete related EmployeeModules
        await empModule.deleteMany({ moduleId: deletedTrainingModule._id });
        // Return success response
        res.status(200).json({ message: "TrainingModule deleted successfully" });
    } catch (error) {
        console.error("Error deleting TrainingModule:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const upcomingleaves = async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        // Fetch leaves within the next 30 days and past 30 days
        const leaves = await LeaveModel.find({
            $or: [
                {
                    fromdate: { $gte: today, $lte: thirtyDaysFromNow } // Upcoming leaves
                },
                {
                    todate: { $gte: thirtyDaysAgo, $lte: today } // Past leaves
                }
            ]
        }).sort({ fromdate: 1 }).exec();

        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave data', error });
    }
};

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
  });

const forgotpassword= async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Send reset email
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            to: email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });

        res.json({ message: 'Password reset link sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Endpoint to reset the password
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password has been successfully reset' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    addEmployee,
    getAdmin,
    getAllAdmins,
    editAdmin,
    loginUser,
    getProfile,
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
    allpendingRequest,
    payroll,
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
};


