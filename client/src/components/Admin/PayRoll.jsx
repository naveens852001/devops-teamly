import React, { useState, useEffect } from "react";
import axios from "axios";

const PayrollDisplay = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:10000";

  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/payroll`)
      .then((result) => {
        if (result.data.Status) {
          const payrollData = result.data.Result.map((employee) => {
            const grossSalary = employee.salary;
            const deductions = calculateDeductions(grossSalary);
            const netPay = grossSalary - deductions;
            const paymentDate = getLastDayOfMonth();

            return {
              ...employee,
              grossSalary,
              deductions,
              netPay,
              paymentDate,
            };
          });
          setPayrolls(payrollData);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const calculateDeductions = (grossSalary) => {
    // Assuming Basic Salary is 50% of Gross Salary
    const basicSalary = grossSalary * 0.5;

    // Placeholder income tax rate (actual calculation is based on slabs)
    const incomeTax = grossSalary * 0.1;

    // Provident Fund (PF) is typically 12% of Basic Salary
    const providentFund = basicSalary * 0.12;

    // Professional Tax, which varies by state, is a fixed amount
    const professionalTax = 200;

    // Health Insurance as a fixed deduction
    const healthInsurance = 500;

    return incomeTax + providentFund + professionalTax + healthInsurance;
  };

  const getLastDayOfMonth = () => {
    const date = new Date();
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay.toLocaleDateString();
  };
  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   alert("Payroll submitted successfully!");
  // };

  const checkoutHandler = async (employeeId, amount,employeeDetails) => {
    try {
      // Fetch the Razorpay key and create order
      const {
        data: { key },
      } = await axios.get(`${apiUrl}/getkey`);
      const {
        data: { order },
      } = await axios.post(`${apiUrl}/checkout`, {
        employeeId: employeeId,
        amount: amount,
      });

      // Prepare Razorpay options with prefilled bank account number
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        names: "Teamly",
        description: "Test Transaction",
        image: employeeDetails.image,
        order_id: order.id,
        callback_url: `${apiUrl}/paymentverification`,
        name: employeeDetails.name, // Employee's name
        email: employeeDetails.email, // Employee's email
        contact: employeeDetails.contact, // Employee's contact number
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#056139",
        },
      };

      // Initialize Razorpay payment window
      const razor = new window.Razorpay(options);

      // Open Razorpay payment window
      razor.open();
    } catch (error) {
      console.error("Error in checkoutHandler:", error);
      // Handle errors here, maybe show a message to the admin
    }
  };

  return (
    <div className="mt-5 pt-4 px-3">
  <div className="bg-white card shadow-sm p-4 mb-4 rounded-lg border-gray-200">
    <h2 className="text-center text-4xl font-montserrat">Payroll List</h2>
    <hr className="border-t-2 border-gray-200 my-4" />

    {/* Container for the table */}
    <div className="overflow-x-auto">
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="overflow-y-auto max-h-[600px]"> {/* Adjust max-height as needed */}
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4">Employee ID</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Position</th>
                <th className="py-2 px-4">Gross Salary</th>
                <th className="py-2 px-4">Net Pay</th>
                <th className="py-2 px-4">Deductions</th>
                <th className="py-2 px-4">Payment Date</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((payroll) => (
                <tr key={payroll._id} className="hover:bg-gray-100">
                  <td className="py-2 px-3 border">{payroll._id}</td>
                  <td className="py-2 px-3 border">{payroll.name}</td>
                  <td className="py-2 px-3 border">{payroll.email}</td>
                  <td className="py-2 px-3 border">{payroll.position}</td>
                  <td className="py-2 px-3 border">₹{payroll.grossSalary.toFixed(2)}</td>
                  <td className="py-2 px-3 border">₹{payroll.netPay.toFixed(2)}</td>
                  <td className="py-2 px-3 border">₹{payroll.deductions.toFixed(2)}</td>
                  <td className="py-2 px-3 border">{payroll.paymentDate}</td>
                  <td className="py-2 px-3 border">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                      onClick={() => {
                        const employeeDetails = {
                          name: payroll.name,
                          email: payroll.email,
                          contact: payroll.contact,
                        };

                        checkoutHandler(
                          payroll._id,
                          payroll.netPay,
                          employeeDetails
                        );
                      }}
                    >
                      Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block sm:hidden">
        <div className="overflow-y-auto max-h-[600px]"> {/* Adjust max-height as needed */}
          {payrolls.map((payroll) => (
            <div key={payroll._id} className="bg-gray-100 mb-4 p-4 rounded-lg shadow-md">
              <div className="flex flex-col space-y-2 ">
                <div className="font-bold text-gray-800">Employee ID:</div>
                <div>{payroll._id}</div>

                <div className="font-bold text-gray-800">Name:</div>
                <div>{payroll.name}</div>

                <div className="font-bold text-gray-800">Email:</div>
                <div>{payroll.email}</div>

                <div className="font-bold text-gray-800">Position:</div>
                <div>{payroll.position}</div>

                <div className="font-bold text-gray-800">Gross Salary:</div>
                <div>₹{payroll.grossSalary.toFixed(2)}</div>

                <div className="font-bold text-gray-800">Net Pay:</div>
                <div>₹{payroll.netPay.toFixed(2)}</div>

                <div className="font-bold text-gray-800">Deductions:</div>
                <div>₹{payroll.deductions.toFixed(2)}</div>

                <div className="font-bold text-gray-800">Payment Date:</div>
                <div>{payroll.paymentDate}</div>

                <div className="flex space-x-2 mt-4">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
                    onClick={() => {
                      const employeeDetails = {
                        name: payroll.name,
                        email: payroll.email,
                        contact: payroll.contact,
                      };

                      checkoutHandler(
                        payroll._id,
                        payroll.netPay,
                        employeeDetails
                      );
                    }}
                  >
                    Pay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>


  );
};

export default PayrollDisplay;
