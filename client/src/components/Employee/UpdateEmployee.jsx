import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateEmployee = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    city: "",
    State: "",
    Country: "",
    password: "",
    dob: "",
    gender: "",
    bankAccount: "",
    taxId: "",
    salary: "",
    postGraduation: "",
    graduation: "",
    IFSC: "",
    mobilenumber: "",
    AadharID: "",
    PanCard: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${apiUrl}/employee/${id}`)
      .then((result) => {
        const data = result.data.Result[0];
        const formattedDOB = data.dob
          ? new Date(data.dob)
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")
          : "";
        setEmployee({
          name: data.name,
          email: data.email,
          password: "",
          city: data.city || "",
          State: data.State || "",
          Country: data.Country || "",
          dob: formattedDOB,
          salary: data.salary || "",
          gender: data.gender || "",
          bankAccount: data.bankAccount || "",
          taxId: data.taxId || "",
          postGraduation: data.postGraduation || "",
          graduation: data.graduation || "",
          IFSC: data.IFSC || "",
          mobilenumber: data.mobilenumber || "",
          AadharID: data.AadharID || "",
          PanCard: data.PanCard || "",
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const validateForm = () => {
    let errors = {};

    // Check if fields are empty
    if (!employee.name.trim()) errors.name = "Name is required";
    if (!employee.email.trim()) errors.email = "Email is required";
    // if (!employee.password) errors.password = "Password is required";
    if (!employee.city.trim()) errors.city = "City is required";
    if (!employee.State.trim()) errors.State = "State is required"; // Note the capital 'S'
    if (!employee.Country.trim()) errors.country = "Country is required"; // Note the capital 'C'
    if (!employee.dob.trim()) errors.dob = "Date of Birth is required";
    if (!employee.gender.trim()) errors.gender = "Gender is required";
    if (!String(employee.mobilenumber).trim())
      errors.mobilenumber = "Mobile Number is required";

    // Email pattern matching
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (employee.email && !emailPattern.test(employee.email)) {
      errors.email = "Invalid email format";
    }

    // Password validation
    // const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    // if (employee.password && !passwordPattern.test(employee.password)) {
    //   errors.password =
    //     "Password must have 6 characters, with at least one uppercase letter and one special character";
    // }

    // Mobile number validation (should be exactly 10 digits)

    const trimmedMobile = String(employee.mobilenumber).trim(); // Use camelCase
    if (!trimmedMobile) {
      errors.mobilenumber = "Mobile Number is required"; // Correct casing for mobileNumber
    } else if (trimmedMobile.length !== 10 || isNaN(trimmedMobile)) {
      errors.mobilenumber = "Mobile number must be 10 digits long and numeric";
    }

    // Salary validation (cannot be empty and must be a positive number)
    if (!employee.salary) {
      errors.salary = "Salary is required";
    } else if (isNaN(employee.salary) || employee.salary <= 0) {
      errors.salary = "Salary must be a positive number";
    }

    // Aadhar ID validation (must be 12 digits)
    const aadharPattern = /^\d{12}$/;
    const trimmedAadhar = String(employee.AadharID).trim();
    if (!trimmedAadhar) {
      errors.AadharID = "Aadhar ID is required";
    } else if (trimmedAadhar.length !== 12 || isNaN(trimmedAadhar)) {
      errors.AadharID = "Aadhar ID must be exactly 12 digits";
    }

    // Pan Card validation (must be exactly 10 characters)
    const panCardPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const trimmedPanCard = String(employee.PanCard).trim();
    if (!trimmedPanCard) {
      errors.PanCard = "Pan Card is required";
    } else if (trimmedPanCard.length !== 10) {
      errors.PanCard = "Pan Card must be exactly 10 characters";
    } else if (!panCardPattern.test(trimmedPanCard)) {
      errors.PanCard = "Pan Card must follow the format ABCDE1234F";
    }

    // Bank Account validation (should be between 9 to 18 digits)
    const trimmedBankAccount = String(employee.bankAccount).trim();
    if (!trimmedBankAccount) {
      errors.bankAccount = "Bank Account is required";
    } else if (
      trimmedBankAccount.length < 9 ||
      trimmedBankAccount.length > 18 ||
      isNaN(trimmedBankAccount)
    ) {
      errors.bankAccount =
        "Bank account number must be between 9 and 18 digits";
    }

    // Tax ID validation (cannot be empty)
    if (!employee.taxId.trim()) {
      errors.taxId = "Tax ID is required";
    }

    // IFSC code validation (should be 11 characters long, with specific format)
    const ifscPattern = /^[A-Za-z]{4}\d{7}$/;
    if (!employee.IFSC.trim()) {
      errors.IFSC = "IFSC code is required";
    } else if (!ifscPattern.test(employee.IFSC)) {
      errors.IFSC = "Invalid IFSC code. Format: 4 letters followed by 7 digits";
    }

    setErrors(errors);

    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedEmployee = { ...employee };
    if (!updatedEmployee.password.trim()) {
      delete updatedEmployee.password; // Remove the password field if it's empty
    }
    if (validateForm()) {
      axios
        .put(`${apiUrl}/edit_employee/${id}`, updatedEmployee)
        .then((result) => {
          if (result.data.Status) {
            toast.success("Employee updated successfully!");
            navigate(`/EmpDashboard/employee_detail/` + id);
          } else {
            toast.error(result.data.Message || "Failed to update employee");
          }
        })
        .catch((err) => {
          console.error("Update failed:", err);
          toast.error("An error occurred while updating the employee.");
        });
    } else {
      console.log("Form has errors", errors);
    }
  };

  return (
    <div className="my-4 bg-gray-200 rounded">
      <h2 className="text-black text-center text-2xl font-bold py-3  font-montserrat">
        Employee-Information
      </h2>
      <div className="flex flex-wrap justify-between">
        {/* <!-- Personal Information Form --> */}
        <div className="lg:w-1/2 p-2 md:w-2/6 mt-2 ">
          <div className="rounded-lg p-4 bg-white  shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="flex items-center bg-gray-800 text-white rounded-t-lg p-3">
              <i className="bi bi-person-fill text-2xl mx-2"></i>
              <h5 className="text-xl font-bold">Update Personal Information</h5>
            </div>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col mb-3">
                  <label htmlFor="inputName" className="block text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className={`form-input h-10 px-2 mt-1 block w-full ${
                      errors.name ? "border-red-500" : "bg-gray-100"
                    } text-gray-700`}
                    id="inputName"
                    value={employee.name}
                    placeholder="Enter your name"
                    readOnly
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="flex flex-col mb-3">
                  <label htmlFor="inputEmail" className="block text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-input h-10 px-2 mt-1 block w-full ${
                      errors.email ? "border-red-500" : "bg-gray-100"
                    }`}
                    id="inputEmail"
                    value={employee.email}
                    placeholder="Enter your email"
                    readOnly
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="flex flex-col mb-3">
                  <label
                    htmlFor="inputPassword"
                    className="block text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-input border h-10 px-2 mt-1 block w-full ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    id="inputPassword"
                    value={employee.password}
                    placeholder="Set your own password"
                    onChange={(e) =>
                      setEmployee({ ...employee, password: e.target.value })
                    }
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col mb-3">
                  <label
                    htmlFor="inputCity"
                    className="block text-gray-700 font-medium"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    className={`form-input h-10 px-2 mt-1 block w-full ${
                      errors.city ? "border-red-500" : "bg-gray-100"
                    } text-gray-700`}
                    id="inputCity"
                    value={employee.city}
                    placeholder="Enter your City"
                    onChange={(e) =>
                      setEmployee({ ...employee, city: e.target.value })
                    }
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div className="flex flex-col mb-3">
                  <label
                    htmlFor="inputState"
                    className="block text-gray-700 font-medium"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    className={`form-input h-10 px-2 mt-1 block w-full ${
                      errors.State ? "border-red-500" : "bg-gray-100"
                    } text-gray-700`}
                    id="inputState"
                    value={employee.State}
                    placeholder="Enter your State"
                    onChange={(e) =>
                      setEmployee({ ...employee, State: e.target.value })
                    }
                  />
                  {errors.State && (
                    <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>
                <div className="flex flex-col mb-3">
                  <label
                    htmlFor="inputCountry"
                    className="block text-gray-700 font-medium"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    className={`form-input h-10 px-2 mt-1 block w-full ${
                      errors.country ? "border-red-500" : "bg-gray-100"
                    } text-gray-700`}
                    id="inputCountry"
                    value={employee.Country}
                    placeholder="Enter your Country"
                    onChange={(e) =>
                      setEmployee({ ...employee, Country: e.target.value })
                    }
                  />
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col mb-3">
                  <label
                    htmlFor="inputDOB"
                    className="block text-gray-700 font-medium"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={`form-input h-10 p-2 mt-1 block w-full ${
                      errors.dob ? "border-red-500" : "bg-gray-100"
                    } text-gray-700`}
                    id="inputDOB"
                    value={employee.dob}
                    onChange={(e) =>
                      setEmployee({ ...employee, dob: e.target.value })
                    }
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                  )}
                </div>
                <div className="flex flex-col mb-3">
                  <label htmlFor="inputGender" className="block text-gray-700">
                    Gender
                  </label>
                  <select
                    className={`border h-10 form-select mt-1 block w-full ${
                      errors.gender ? "border-red-500" : ""
                    }`}
                    id="inputGender"
                    value={employee.gender}
                    onChange={(e) =>
                      setEmployee({ ...employee, gender: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select Your Gender
                    </option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-Binary</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>

                <div className="flex flex-col mb-3">
                  <label
                    htmlFor="inputMobileNumber"
                    className="block text-gray-700"
                  >
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className={`border h-10 p-2 form-input mt-1 block w-full ${
                      errors.mobilenumber ? "border-red-500" : ""
                    }`}
                    id="inputMobileNumber"
                    value={employee.mobilenumber}
                    placeholder="Enter your mobile number"
                    onChange={(e) =>
                      setEmployee({
                        ...employee,
                        mobilenumber: e.target.value,
                      })
                    }
                  />
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* <!-- Financial and Education Information Form --> */}
        <div className="lg:w-1/2 md:w-3/5 p-2 mt-2">
          <div className="rounded-lg p-4 bg-white shadow-lg transform transition-transform duration-300 hover:scale-105">
            <div className="flex items-center bg-gray-800 text-white rounded-t-lg p-3">
              <i className="bi bi-currency-rupee text-2xl mx-2"></i>
              <h5 className="text-xl font-bold">
                Financial and Education Information
              </h5>
            </div>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col mb-3">
                  <label
                    htmlFor="inputSalary"
                    className="block text-gray-700 font-medium"
                  >
                    Salary
                  </label>
                  <input
                    type="number"
                    className={`form-input h-10 px-2 mt-1 block w-full ${
                      errors.salary ? "border-red-500" : "bg-gray-100"
                    } text-gray-700`}
                    id="inputSalary"
                    value={employee.salary}
                    placeholder="Enter your salary"
                    // readOnly
                    onChange={(e) =>
                      setEmployee({ ...employee, salary: e.target.value })
                    }
                  />
                  {errors.salary && (
                    <p className="text-red-500 text-xs mt-1">{errors.salary}</p>
                  )}
                </div>
                <div className="flex flex-col mb-3">
                  <label
                    htmlFor="inputAadharID"
                    className="block text-gray-700 font-medium"
                  >
                    Aadhar-ID
                  </label>
                  <input
                    type="text"
                    className={`form-input h-10 px-2 mt-1 block w-full ${
                      errors.AadharID ? "border-red-500" : "bg-gray-100"
                    } text-gray-700`}
                    id="AadharID"
                    value={employee.AadharID}
                    placeholder="Enter your Aadhar ID"
                    readOnly
                    onChange={(e) =>
                      setEmployee({ ...employee, AadharID: e.target.value })
                    }
                  />
                  {errors.AadharID && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.AadharID}
                    </p>
                  )}
                </div>

                <div className="flex flex-col mb-3">
                  <label
                    htmlFor="inputPanCard"
                    className="block text-gray-700 font-medium"
                  >
                    Pan-Card
                  </label>
                  <input
                    type="text"
                    className={`form-input h-10 px-2 mt-1 block w-full ${
                      errors.PanCard ? "border-red-500" : "bg-gray-100"
                    } text-gray-700`}
                    id="PanCard"
                    value={employee.PanCard}
                    placeholder="Enter your PanCard"
                    readOnly
                    onChange={(e) =>
                      setEmployee({ ...employee, PanCard: e.target.value })
                    }
                  />
                  {errors.PanCard && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.PanCard}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col mb-3">
                  <label
                    htmlFor="inputBankAccount"
                    className="block text-gray-700"
                  >
                    Bank Account
                  </label>
                  <input
                    type="text"
                    className={`border h-10 p-2 form-input mt-1 block w-full ${
                      errors.bankAccount ? "border-red-500" : ""
                    }`}
                    id="inputBankAccount"
                    value={employee.bankAccount}
                    placeholder="Enter your bank account number"
                    onChange={(e) =>
                      setEmployee({ ...employee, bankAccount: e.target.value })
                    }
                  />
                  {errors.bankAccount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bankAccount}
                    </p>
                  )}
                </div>
                <div className=" flex flex-col mb-3">
                  <label htmlFor="inputTaxID" className="block text-gray-700">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    className={`border h-10 p-2 form-input mt-1 block w-full ${
                      errors.taxId ? "border-red-500" : ""
                    }`}
                    id="inputTaxID"
                    value={employee.taxId}
                    placeholder="Enter Tax ID"
                    onChange={(e) =>
                      setEmployee({ ...employee, taxId: e.target.value })
                    }
                  />
                  {errors.taxId && (
                    <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>
                  )}
                </div>
                <div className="flex flex-col mb-3">
                  <label htmlFor="inputIFSC" className="block text-gray-700">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    className={`border h-10 p-2 form-input mt-1 block w-full ${
                      errors.IFSC ? "border-red-500" : ""
                    }`}
                    id="inputIFSC"
                    value={employee.IFSC}
                    placeholder="Enter your bank IFSC code"
                    onChange={(e) =>
                      setEmployee({ ...employee, IFSC: e.target.value })
                    }
                  />
                  {errors.IFSC && (
                    <p className="text-red-500 text-sm mt-1">{errors.IFSC}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-3">
                  <label
                    htmlFor="inputGraduation"
                    className="block text-gray-700"
                  >
                    Graduation (optional)
                  </label>
                  <input
                    type="text"
                    className="border h-10 p-2 form-input mt-1 block w-full"
                    id="inputGraduation"
                    value={employee.Graduation}
                    onChange={(e) =>
                      setEmployee({ ...employee, Graduation: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="inputGraduation"
                    className="block text-gray-700"
                  >
                    Post-Graduation (optional)
                  </label>
                  <input
                    type="text"
                    className="border h-10 p-2 form-input mt-1 block w-full"
                    id="inputGraduation"
                    value={employee.postGraduation}
                    onChange={(e) =>
                      setEmployee({
                        ...employee,
                        postGraduation: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="flex justify-start lg:w-1/2 py-3 mt-4">
          <button
            type="submit"
            className="bg-gray-800 text-white py-2 px-4  mx-2 rounded-lg shadow-md hover:bg-black"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployee;
