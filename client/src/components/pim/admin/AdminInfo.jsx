import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ApiendPonits from "../../../api/APIEndPoints.json";
import Checkbox from "@mui/material/Checkbox";
import { FaPlus } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { IoSave, IoClose, IoFlashOff, IoCaretBack } from "react-icons/io5";
import defaultprofile from "../../../../src/assets/images/clientAvatar.png";
import { TiFlash } from "react-icons/ti";
import { Link } from "react-router-dom";
import Loading from "../../Loading";
import { FaCheck } from "react-icons/fa6";
import teamsIcon from "../../../assets/images/Teams.png";
import OutlookIcon from "../../../assets/images/Outlook.png";
import { motion } from "framer-motion";
import { BiSolidHappyHeartEyes } from "react-icons/bi";
import { FaFaceSadTear } from "react-icons/fa6";

const AdminInfo = () => {
  const { _id } = useParams(); // Get the employee ID from URL params
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [customTech, setCustomTech] = useState("");
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState("");
  const [designations, setDesignations] = useState([""]);
  const [departments, setDepartments] = useState([""]);
  const [reportingTo, setReportingTo] = useState("");

  const prfilealt = formData.name + " " + "Profile";

  const [profile, setProfile] = useState(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.getallsettings}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const allSettings = data.data[0];
        // console.log(allSettings);

        if (response.ok) {
          setDesignations(allSettings.designation); // Update settings state
          setDepartments(allSettings.department);
          setReportingTo(allSettings.reportingTo);
        } else {
          throw new Error("Failed to fetch settings");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchSettings();
  }, [token]);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.employeedetails}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEmployee(data.data);
          setFormData(data.data); // Initialize form data
        } else {
          throw new Error("Failed to fetch employee details");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [_id, token]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.viewProfile}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Employee_id: _id }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setProfile(data.data.profileUrl);
          // setHasProfile(true);
        } else {
          setProfile(defaultprofile);
          // setProfile(demoprofile);
          // setHasProfile(false);
        }
      } catch (err) {
        // setError(err.message);
        // setTimeout(() => setError(""), 4000);
      } finally {
        // setLoading(false);
      }
    };

    fetchProfile();
  }, [_id, token]);

  const predefinedTech = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "PHP",
    "Go",
    "Swift",
    "Kotlin",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      // Construct the payload with individual fields
      const payload = {
        _id: formData._id,
        empid: formData.empid,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        dob: formData.dob,
        gender: formData.gender,
        maritialstatus: formData.maritialstatus,
        bloodgroup: formData.bloodgroup,
        dateofjoining: formData.dateofjoining,
        lastwd: formData.lastwd,
        status: formData.status,
        auth: formData.auth,
        designation: formData.designation,
        department: formData.department,
        reportingto: formData.reportingto,
        teamleader: formData.teamleader,
        techexperties: formData.techexperties,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipcode: formData.zipcode,
        emergencypersonname: formData.emergencypersonname,
        relation: formData.relation,
        profession: formData.profession,
        emergencypersonaddress: formData.emergencypersonaddress,
        emergencypersonemail: formData.emergencypersonemail,
        emergencypersonphone: formData.emergencypersonphone,
        workexperience: formData.workexperience,
      };

      const response = await fetch(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.updateemployeebyadmin}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseBody = await response.json();
      // console.log("Response body:", responseBody);

      if (response.ok) {
        setEmployee(responseBody.data);
        setEditMode(false);
        setMessage("Employee Details Updated Successfully");
        setTimeout(() => {
          setMessage();
        }, 4000);
      } else {
        setError(responseBody);
        setTimeout(() => {
          setError();
        }, 4000);
        throw new Error(
          responseBody.msg || "Failed to update employee details"
        );
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!employee) return <div>No employee data</div>;

  const handleCheckboxChange = (tech) => {
    if (formData.techexperties.includes(tech)) {
      setFormData({
        ...formData,
        techexperties: formData.techexperties.filter((item) => item !== tech),
      });
    } else {
      setFormData({
        ...formData,
        techexperties: [...formData.techexperties, tech],
      });
    }
  };

  const handleCustomTechChange = (e) => {
    setCustomTech(e.target.value);
  };

  const handleAddCustomTech = () => {
    if (customTech && !formData.techexperties.includes(customTech)) {
      setFormData({
        ...formData,
        techexperties: [...formData.techexperties, customTech],
      });
      setCustomTech("");
    }
  };

  return (
    <div className=" dark:text-white mb-1 lg:mb-0 pb-20 md:pb-32 grid grid-cols-12 gap-2 h-full min-h-full">
      <div className="col-span-12 h-full  lg:col-span-4 flex flex-col gap-2  bg-white dark:bg-neutral-950 p-2 rounded-md">
        <div className="flex gap-2 items-start justify-between ">
          <Link
            to="/pim/employeelist"
            className=" hover:bg-blue-400/20 hover:px-1  duration-300 text-blue-500 rounded group flex items-center"
          >
            <IoCaretBack />
            <h3 className="text-sm">Back</h3>
          </Link>
          <div>
            {editMode ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-green-500/20 text-green-500 font-semibold px-2 py-1 rounded flex gap-1 items-center"
                >
                  <IoSave fontSize={15} />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className=" bg-red-500/20 text-red-500 font-semibold px-2 py-1 rounded flex gap-1 items-center"
                >
                  <IoClose fontSize={18} />
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500/20 text-blue-500 font-semibold px-2 py-1 rounded flex gap-1 items-center"
                >
                  <MdEdit fontSize={15} />
                  Edit User
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-end  justify-between">
          <div className=" bg-sky-100 dark:bg-neutral-900 p-2 rounded-md relative">
            <img
              src={profile}
              className="rounded-md w-40 h-auto"
              alt={prfilealt}
            />

            {editMode ? (
              <div className="absolute bottom-2.5 right-2.5 text-white">
                <select
                  className={`${
                    formData.status === 0
                      ? " text-red-500"
                      : formData.status === 1
                      ? "text-green-500"
                      : "bg-gray-200 dark:bg-neutral-700"
                  } w-20 font-semibold text-xs px-2 py-1 rounded-md bg-blue-100 dark:bg-neutral-800`}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: parseInt(e.target.value), // Update the status
                    }))
                  }
                >
                  <option value={1} className="text-green-700">
                    Active
                  </option>
                  <option value={0} className="text-red-700">
                    Inactive
                  </option>
                </select>
              </div>
            ) : (
              <div className="absolute bottom-2.5 right-2.5 text-white">
                {formData.status === 1 ? (
                  <span className="flex items-center gap-0.5 bg-green-300 text-green-700 font-semibold text-xs w-fit p-1 rounded-md">
                    <TiFlash fontSize={18} />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 bg-red-300 text-red-700 font-semibold text-xs w-fit p-1 rounded-md">
                    <IoFlashOff fontSize={15} />
                    Inactive
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-end justify-end gap-2 h-full">
            {editMode ? (
              <div className="order-2 md:order-1 bottom-2.5 right-2.5 text-white p-2 rounded-md bg-blue-100 dark:bg-neutral-900">
                <select
                  className={`${
                    formData.auth === 0
                      ? "text-orange-500"
                      : formData.auth === 2
                      ? "text-blue-500"
                      : formData.auth === 3
                      ? "text-purple-500"
                      : formData.auth === 1
                      ? "text-green-500"
                      : "bg-gray-200 dark:bg-neutral-700"
                  } w-28 font-semibold text-xs px-2 py-1 rounded-md bg-blue-100 dark:bg-neutral-900`}
                  value={formData.auth}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      auth: parseInt(e.target.value), // Update the auth
                    }))
                  }
                >
                  <option value={0} className="text-orange-700">
                    Employee
                  </option>
                  <option value={2} className="text-blue-700">
                    HR
                  </option>
                  <option value={3} className="text-purple-700">
                    Manager
                  </option>
                  <option value={1} className="text-green-700">
                    Admin
                  </option>
                </select>
              </div>
            ) : (
              <div className="order-2 md:order-1 py-2 px-3 rounded-md bg-blue-100 dark:bg-neutral-900 flex items-center gap-1">
                <div>As {employee.auth === 0 ? "an" : "a"}</div>
                <div className="font-bold">
                  {employee.auth === 0 ? (
                    <div className="text-orange-700">Employee</div>
                  ) : employee.auth === 2 ? (
                    <div className="text-blue-700">HR</div>
                  ) : employee.auth === 3 ? (
                    <div className="text-purple-700">Manager</div>
                  ) : employee.auth === 1 ? (
                    <div className="text-green-700">Admin</div>
                  ) : (
                    "Unknown"
                  )}
                </div>
              </div>
            )}

            <div className="order-1 md:order-2 flex items-center justify-end gap-2">
              <a
                href={`mailto:${employee.email}`}
                target="_blank"
                className="bg-blue-500/20 p-1.5 group rounded-md"
              >
                <img
                  src={OutlookIcon}
                  alt="OutlookIcon"
                  className="w-7 group-hover:scale-110 duration-100 rounded-full shadow-md"
                />
              </a>
              <a
                href={`MSTeams:/l/chat/0/0?users=${employee.email}`}
                target="_blank"
                className="bg-blue-500/20 p-1.5 group rounded-md"
              >
                <img
                  src={teamsIcon}
                  alt="teamsIcon"
                  className="w-7 group-hover:scale-110 duration-100 rounded-full shadow-md"
                />
              </a>
            </div>
          </div>
        </div>
        {/* info */}
        <div className=" bg-sky-100 dark:bg-neutral-900 p-2 rounded-md grid grid-cols-12 gap-2">
          <div className="grid grid-cols-12 col-span-12 items-center gap-2 justify-between">
            <label className="  col-span-4">Name</label>
            {editMode ? (
              <div className="col-span-8">
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border bg-sky-50 dark:bg-neutral-800 rounded-md"
                />
              </div>
            ) : (
              <div className="col-span-8">
                <h3 className="px-2 py-1 font-semibold">{employee.name}</h3>
              </div>
            )}
          </div>
          <div className="grid grid-cols-12 col-span-12 items-center gap-2 justify-between">
            <label className="  col-span-4">Employee ID</label>
            {editMode ? (
              <div className="col-span-8">
                <input
                  type="number"
                  name="empid"
                  value={formData.empid || ""}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border bg-sky-50 dark:bg-neutral-800 rounded-md"
                />
              </div>
            ) : (
              <div className="col-span-8">
                <h3 className="px-2 py-1 font-semibold">{formData.empid}</h3>
              </div>
            )}
            {/* <div className="col-span-8">
              <h3 className="px-2 py-1 font-semibold">{formData.empid}</h3>
            </div> */}
          </div>
          <div className="grid grid-cols-12 col-span-12 items-center gap-2 justify-between">
            <label className="  col-span-4">_ID</label>
            <div className="col-span-8">
              <h3 className="px-2 py-1 font-semibold">{formData._id}</h3>
            </div>
          </div>
          <div className="grid grid-cols-12 col-span-12 items-center gap-2 justify-between">
            <label className="  col-span-4">Email</label>
            {editMode ? (
              <div className="col-span-8">
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border bg-sky-50 dark:bg-neutral-800 rounded-md"
                />
              </div>
            ) : (
              <div className="col-span-8  overflow-x-scroll scrollbar-hide">
                <h3 className="px-2 py-1 font-semibold">{formData.email}</h3>
              </div>
            )}
          </div>
          <div className="grid grid-cols-12 col-span-12 items-center gap-2 justify-between">
            <label className="  col-span-4">Phone</label>
            {editMode ? (
              <div className="col-span-8">
                <input
                  type="number"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border bg-sky-50 dark:bg-neutral-800 rounded-md"
                />
              </div>
            ) : (
              <div className="col-span-8">
                <h3 className="px-2 py-1 font-semibold">{formData.phone}</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-12 h-full overflow-y-scroll scrollbrhdn lg:col-span-8 flex flex-col gap-2 md:overflow-y-scroll    scrollbrhdn bg-white dark:bg-neutral-950 p-2 rounded-md">
        {/* personal info */}
        <div className=" bg-sky-100 dark:bg-neutral-900 p-2 rounded-md flex flex-col gap-2">
          <h2 className="text-base font-bold">Personal Details</h2>
          <div className="bg-sky-50 dark:bg-neutral-950 p-2 rounded-md grid grid-cols-12 gap-2">
            <div className="grid grid-cols-12 items-center gap-2 col-span-12 md:col-span-6 justify-between">
              <label className=" col-span-4 ">DOB</label>
              {editMode ? (
                <div className="col-span-8">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleInputChange}
                    className="bg-sky-100 w-full px-2 py-1 border  dark:bg-neutral-800 rounded-md"
                  />
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {new Date(employee.dob).toLocaleDateString("en-GB")}
                  </h3>
                </div>
              )}
            </div>
            <div className="grid grid-cols-12 items-center gap-2 col-span-12 md:col-span-6 justify-between">
              <label className="  col-span-4">Gender</label>
              {editMode ? (
                <div className="col-span-8">
                  {/* <input
                    type="text"
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                    className="bg-sky-100 w-full px-2 py-1 border  dark:bg-neutral-800 rounded-md"
                  /> */}
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-sky-100 w-full px-2 py-1 text-sm dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">{employee.gender}</h3>
                </div>
              )}
            </div>
            <div className="grid grid-cols-12 items-center gap-2 col-span-12 md:col-span-6 justify-between">
              <label className="  col-span-4">Maritial status</label>
              {editMode ? (
                <div className="col-span-8">
                  <select
                    name="maritialstatus"
                    value={formData.maritialstatus || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-sky-100 w-full px-2 py-1 text-sm dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select Maritial Status
                    </option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Registered Partnership">
                      Registered Partnership
                    </option>
                  </select>
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.maritialstatus}
                  </h3>
                </div>
              )}
            </div>
            <div className="grid grid-cols-12 items-center gap-2 col-span-12 md:col-span-6 justify-between">
              <label className=" col-span-4 ">Blood Group</label>
              {editMode ? (
                <div className="col-span-8">
                  <select
                    name="bloodgroup"
                    value={formData.bloodgroup || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-sky-100 w-full px-2 py-1 text-sm dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select Blood Group
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.bloodgroup}
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Employment Information */}
        <div className=" bg-sky-100 dark:bg-neutral-900 p-2 rounded-md flex flex-col gap-2">
          <h2 className="text-base font-bold">Employment Information</h2>
          <div className="bg-sky-50 dark:bg-neutral-950 p-2 rounded-md grid grid-cols-12 gap-2">
            <div className="grid grid-cols-12 items-center gap-2 col-span-12 md:col-span-6 justify-between">
              <label className="  col-span-4">Designation</label>
              {editMode ? (
                <div className="col-span-8">
                  <select
                    name="designation"
                    value={formData.designation || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-sky-100 w-full px-2 py-1 text-sm dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select Designation
                    </option>
                    {designations.length > 0 ? (
                      designations.map((designation, index) => (
                        <option key={index} value={designation}>
                          {designation}
                        </option>
                      ))
                    ) : (
                      <option disabled>No found any designation</option>
                    )}
                  </select>
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.designation}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 items-center gap-2 col-span-12 md:col-span-6 justify-between">
              <label className="  col-span-4">Department</label>
              {editMode ? (
                <div className="col-span-8">
                  <select
                    name="department"
                    value={formData.department || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-sky-100 w-full px-2 py-1 text-sm dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    {departments.length > 0 ? (
                      departments.map((department, index) => (
                        <option key={index} value={department}>
                          {department}
                        </option>
                      ))
                    ) : (
                      <option disabled>No found any department</option>
                    )}
                  </select>
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.department}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 items-center gap-2 col-span-12 md:col-span-6 justify-between">
              <label className=" col-span-4 ">Date of Joining</label>
              {editMode ? (
                <div className="col-span-8">
                  <input
                    type="date"
                    name="dateofjoining"
                    value={formData.dateofjoining || ""}
                    onChange={handleInputChange}
                    className="bg-sky-100 w-full px-2 py-1 border  dark:bg-neutral-800 rounded-md"
                  />
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.dateofjoining}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 items-center gap-2 col-span-12 md:col-span-6 justify-between">
              <label className=" col-span-4 ">Last Working datesa</label>
              {editMode ? (
                <div className="col-span-8">
                  {employee.lastwd ? (
                    <input
                      type="date"
                      name="lastwd"
                      value={formData.lastwd || ""}
                      onChange={handleInputChange}
                      className="bg-sky-100 w-full px-2 py-1 border  dark:bg-neutral-800 rounded-md"
                    />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">{employee.lastwd}</h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 items-center gap-2 col-span-12 md:col-span-6 justify-between">
              <label className="  col-span-4">Reporting To</label>
              {editMode ? (
                <div className="col-span-8">
                  <select
                    name="reportingto"
                    value={formData.reportingto || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-sky-100 w-full px-2 py-1 text-sm dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select Reporting Person
                    </option>
                    {reportingTo.length > 0 ? (
                      reportingTo.map((reportingto, index) => (
                        <option key={index} value={reportingto}>
                          {reportingto}
                        </option>
                      ))
                    ) : (
                      <option disabled>No found any person</option>
                    )}
                  </select>
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.reportingto}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 items-center gap-2 col-span-12 md:col-span-6 justify-between">
              <label className=" col-span-4 ">Manager</label>
              {editMode ? (
                <div className="col-span-8">
                  <select
                    name="teamleader"
                    value={formData.teamleader || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-sky-100 w-full px-2 py-1 text-sm dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select Manger
                    </option>
                    {reportingTo.length > 0 ? (
                      reportingTo.map((reportingto, index) => (
                        <option key={index} value={reportingto}>
                          {reportingto}
                        </option>
                      ))
                    ) : (
                      <option disabled>No found any person</option>
                    )}
                  </select>
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.teamleader}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-10 md:grid-cols-7 items-center gap-2 col-span-12 ">
              <label className="col-span-3 md:col-span-1">Tech Experties</label>
              {editMode ? (
                <div className="col-span-7 md:col-span-6 ml-5 flex flex-col gap-2">
                  <div className="flex flex-row flex-wrap gap-2  ">
                    {predefinedTech.map((tech) => (
                      <label key={tech} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={formData.techexperties.includes(tech)}
                          onChange={() => handleCheckboxChange(tech)}
                          className="hidden"
                        />
                        <span className="custom-checkbox">
                          {formData.techexperties.includes(tech) && (
                            <FaCheck className="text-white w-3.5 h-3.5 font-extrabold" />
                          )}
                        </span>
                        <span>{tech}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-sky-100 dark:bg-neutral-800 rounded-md px-1.5">
                    <input
                      type="text"
                      value={customTech}
                      onChange={handleCustomTechChange}
                      className="border py-2 w-full bg-sky-100 dark:bg-neutral-800 rounded-md "
                    />
                    <button className="cursor-pointer bg-sky-neutral-950 p-1 rounded-md">
                      <FaPlus
                        type="button"
                        onClick={handleAddCustomTech}
                        fontSize={17}
                      />
                    </button>
                  </div>
                  <ul className="mt-2 flex gap-2 flex-wrap">
                    {formData.techexperties.map((tech, index) => (
                      <li
                        key={index}
                        className="flex gap-1.5 justify-between items-center bg-green-200 dark:bg-green-200/15 text-green-600 rounded-md font-bold py-1 px-1.5  "
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleCheckboxChange(tech)}
                          className=""
                        >
                          <IoClose
                            className="bg-green-400/15 font-bold rounded-md  "
                            fontSize={20}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ul className="flex flex-row items-center gap-2 flex-wrap col-span-7 md:col-span-6 ml-3 sm:ml-5">
                  {formData.techexperties.map((tech, index) => (
                    <li
                      key={index}
                      className=" dark:bg-neutral-900 bg-sky-200 font-bold rounded-md px-2 py-1"
                    >
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        {/* Contact Information */}
        <div className=" bg-sky-100 dark:bg-neutral-900 p-2 rounded-md flex flex-col gap-2">
          <h2 className="text-base font-bold">Contact Information</h2>
          <div className="bg-sky-50 dark:bg-neutral-950 p-2 rounded-md grid grid-cols-12 gap-2">
            <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between">
              <label className="  col-span-4">Address</label>
              {editMode ? (
                <div className="col-span-8 ">
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className="bg-sky-100 w-full px-2 py-1 border  dark:bg-neutral-800 rounded-md "
                  />
                </div>
              ) : (
                <div className="col-span-8 overflow-x-scroll scrollbar-hide">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.address}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between">
              <label className=" col-span-4 ">City</label>
              {editMode ? (
                <div className="col-span-8">
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleInputChange}
                    className="bg-sky-100 w-full px-2 py-1 border  dark:bg-neutral-800 rounded-md"
                  />
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">{employee.city}</h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between">
              <label className=" col-span-4 ">State</label>
              {editMode ? (
                <div className="col-span-8">
                  <select
                    name="state"
                    value={formData.state || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-sky-100 w-full px-2 py-1 text-sm dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select a state
                    </option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">{employee.state}</h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between">
              <label className=" col-span-4 ">Country</label>
              {editMode ? (
                <div className="col-span-8">
                  <select
                    name="country"
                    value={formData.country || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-sky-100 w-full px-2 py-1 text-sm dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select a country
                    </option>
                    <option value="India">India</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Australia">Australia</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Canada">Canada</option>
                    <option value="China">China</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Russia">Russia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                  </select>
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.country}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between">
              <label className=" col-span-4 ">Zipcode</label>
              {editMode ? (
                <div className="col-span-8">
                  <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode || ""}
                    onChange={handleInputChange}
                    className="bg-sky-100 w-full px-2 py-1 border  dark:bg-neutral-800 rounded-md"
                  />
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.zipcode}
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Emergency Contacts */}
        <div className=" bg-sky-100 dark:bg-neutral-900 p-2 rounded-md flex flex-col gap-2">
          <h2 className="text-base font-bold">Emergency Contacts</h2>
          <div className="bg-sky-50 dark:bg-neutral-950 p-2 rounded-md grid grid-cols-12 gap-2">
            <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between">
              <label className=" col-span-4 ">Person Name</label>
              {editMode ? (
                <div className="col-span-8">
                  <input
                    type="text"
                    name="emergencypersonname"
                    value={formData.emergencypersonname || ""}
                    onChange={handleInputChange}
                    className="bg-sky-100 w-full px-2 py-1 border  dark:bg-neutral-800 rounded-md"
                  />
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.emergencypersonname}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between">
              <label className=" col-span-4 ">Relation</label>
              {editMode ? (
                <div className="col-span-8">
                  <select
                    name="relation"
                    value={formData.relation || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-sky-100 w-full px-2 py-1 text-sm dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select Relation
                    </option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.relation}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between">
              <label className=" col-span-4 ">Profession</label>
              {editMode ? (
                <div className="col-span-8">
                  <select
                    name="profession"
                    value={formData.profession || ""}
                    onChange={handleInputChange}
                    required
                    className="bg-sky-100 w-full px-2 py-1 text-sm dark:bg-neutral-800 rounded-md"
                  >
                    <option value="" disabled>
                      Select Profession
                    </option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Designer">Designer</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.profession}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between">
              <label className=" col-span-4 ">Person Address</label>
              {editMode ? (
                <div className="col-span-8">
                  <input
                    type="text"
                    name="emergencypersonaddress"
                    value={formData.emergencypersonaddress || ""}
                    onChange={handleInputChange}
                    className="bg-sky-100 w-full px-2 py-1 border  dark:bg-neutral-800 rounded-md"
                  />
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.emergencypersonaddress}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between">
              <label className=" col-span-4 ">Person Email</label>
              {editMode ? (
                <div className="col-span-8">
                  <input
                    type="text"
                    name="emergencypersonemail"
                    value={formData.emergencypersonemail || ""}
                    onChange={handleInputChange}
                    className="bg-sky-100 w-full px-2 py-1 border  dark:bg-neutral-800 rounded-md"
                  />
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.emergencypersonemail}
                  </h3>
                </div>
              )}
            </div>

            <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between">
              <label className=" col-span-4 ">Person Phone</label>
              {editMode ? (
                <div className="col-span-8">
                  <input
                    type="text"
                    name="emergencypersonphone"
                    value={formData.emergencypersonphone || ""}
                    onChange={handleInputChange}
                    className="bg-sky-100 w-full px-2 py-1 border  dark:bg-neutral-800 rounded-md"
                  />
                </div>
              ) : (
                <div className="col-span-8">
                  <h3 className="px-2 py-1 font-semibold">
                    {employee.emergencypersonphone}
                  </h3>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Work Experience */}
        <div>
          {formData.workexperience && formData.workexperience.length > 0 && (
            <div className="flex flex-col gap-2  bg-sky-100 dark:bg-neutral-900  p-2 rounded-md">
              <h3 className=" font-semibold">Work Experience</h3>
              {formData.workexperience.map((exp, index) => (
                <div className="" key={index}>
                  <h4 className="bg-sky-50 dark:bg-neutral-950 p-2 rounded-t-md col-span-12 font-semibold w-fit flex gap-2 items-center text-sm">
                    <span className="bg-sky-200 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                      {index + 1}
                    </span>{" "}
                    Experience
                  </h4>
                  <div
                    key={index}
                    className=" bg-sky-50 dark:bg-neutral-950 p-2 rounded-b-md grid grid-cols-12 gap-2"
                  >
                    <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between ">
                      <label className=" col-span-4 ">Job Title</label>
                      {/* {editMode ? (
                  <div className="">
                    <input
                      type="text"
                      name={`workexperience[${index}].jobtitle`}
                      value={exp.jobtitle || ""}
                      onChange={handleInputChange}
                      className="bg-sky-100 w-full p-2 border bg-sky-neutral-800 rounded-md"
                    />
                  </div>
                ) : ( */}
                      <div className="col-span-8">
                        <h3 className="px-2 py-1 font-semibold">
                          {exp.jobtitle}
                        </h3>
                      </div>
                      {/* )} */}
                    </div>

                    <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between ">
                      <label className=" col-span-4 ">Company Name</label>
                      <div className="col-span-8">
                        <h3 className="px-2 py-1 font-semibold">
                          {exp.companyname}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between ">
                      <label className=" col-span-4 ">Start Date</label>
                      {/* {editMode ? (
                  <div className="">
                    <input
                      type="date"
                      name={`workexperience[${index}].startdate`}
                      value={exp.startdate || ""}
                      onChange={handleInputChange}
                      className="bg-sky-100 w-full p-2 border bg-sky-neutral-800 rounded-md"
                    />
                  </div>
                ) : ( */}
                      <div className="col-span-8">
                        <h3 className="px-2 py-1 font-semibold">
                          {exp.startdate}
                        </h3>
                      </div>
                      {/* )} */}
                    </div>

                    <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between ">
                      <label className=" col-span-4 ">End Date</label>
                      <div className="col-span-8">
                        <h3 className="px-2 py-1 font-semibold">
                          {exp.enddate}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between ">
                      <label className="  col-span-4">LinkedIn URL</label>
                      <div className="col-span-8">
                        <h3 className="px-2 py-1 font-semibold">
                          {exp.companylinkedinurl}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between ">
                      <label className=" col-span-4 ">Employment Type</label>
                      <div className="col-span-8">
                        <h3 className="px-2 py-1 font-semibold">
                          {exp.employeementtype}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 col-span-12 md:col-span-6 items-center gap-2 justify-between ">
                      <label className=" col-span-4 ">Description</label>
                      <div className="col-span-8">
                        <h3 className="px-2 py-1 font-semibold">
                          {exp.description}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className=" absolute md:top-4 top-10 md:w-[70%] w-[92%]  flex items-center justify-center z-50">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 15 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute   text-red-500 border border-red-500/10 bg-red-500/10 py-2 px-4 w-fit rounded-lg text-center flex items-center gap-2"
          >
            <FaFaceSadTear fontSize={20} />
            {error}
          </motion.div>
        )}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 15 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute  text-green-500 border border-green-500/10 bg-green-500/10 py-2 px-4 w-fit rounded-lg text-center flex items-center gap-2"
          >
            <BiSolidHappyHeartEyes fontSize={20} />
            {message}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminInfo;
