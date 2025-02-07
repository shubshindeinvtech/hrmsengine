import React, { useState } from "react";
import DepartmentSettings from "./DepartmentSettings";
import DesignationSettings from "./DesignationSettings";
import CountrySettings from "./CountrySettings";
import ReportingManagerSettings from "./ReportingManagerSettings";
import TimeSheetSettings from "./TimeSheetSettings";
import Demo from "./Demo";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("TimeSheet");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="h-full pb-20">
      <div className="bg-gray-50 dark:bg-neutral-950 p-2 rounded-md shadow-lg text-black dark:text-white h-full max-h-full flex flex-col gap-2 w-full">
        {/* Tabs Section */}
        <div className="flex gap-1.5 bg-blue-100 dark:bg-neutral-900 p-1.5 rounded-lg max-w-96 sm:max-w-full scrollbar-hide overflow-x-scroll sm:overflow-clip h-fit absolute md:relative">
          <button
            className={`px-3 py-1 rounded-md  duration-500 ${
              activeTab === "TimeSheet"
                ? "bg-[#5336FD] text-white font-bold"
                : "hover:bg-sky-50 dark:hover:bg-neutral-800"
            }`}
            onClick={() => handleTabClick("TimeSheet")}
          >
            TimeSheet
          </button>
          <button
            className={`px-3 py-1 rounded-md  duration-500 ${
              activeTab === "Department"
                ? "bg-[#5336FD] text-white font-bold"
                : "hover:bg-sky-50 dark:hover:bg-neutral-800"
            }`}
            onClick={() => handleTabClick("Department")}
          >
            Departments
          </button>
          <button
            className={`px-3 py-1 rounded-md  duration-500 ${
              activeTab === "Designation"
                ? "bg-[#5336FD] text-white font-bold"
                : "hover:bg-sky-50 dark:hover:bg-neutral-800"
            }`}
            onClick={() => handleTabClick("Designation")}
          >
            Designations
          </button>
          <button
            className={`px-3 py-1 rounded-md  duration-500 ${
              activeTab === "Country"
                ? "bg-[#5336FD] text-white font-bold"
                : "hover:bg-sky-50 dark:hover:bg-neutral-800"
            }`}
            onClick={() => handleTabClick("Country")}
          >
            Countries
          </button>
          <button
            className={`px-3 py-1 rounded-md  duration-500 ${
              activeTab === "ReportingManager"
                ? "bg-[#5336FD] text-white font-bold"
                : "hover:bg-sky-50 dark:hover:bg-neutral-800"
            }`}
            onClick={() => handleTabClick("ReportingManager")}
          >
            Managers
          </button>
          {/* <button
            className={`px-3 py-1 rounded-md  duration-500 ${
              activeTab === "Demo"
                ? "bg-[#5336FD] text-white font-bold"
                : "hover:bg-sky-50 dark:hover:bg-neutral-800"
            }`}
            onClick={() => handleTabClick("Demo")}
          >
            Demo
          </button> */}
        </div>

        {/* Content Section */}
        <div className="h-full pb-12 mt-12 md:mt-0">
          {activeTab === "TimeSheet" && <TimeSheetSettings />}
          {activeTab === "Department" && <DepartmentSettings />}
          {activeTab === "Designation" && <DesignationSettings />}
          {activeTab === "Country" && <CountrySettings />}
          {activeTab === "ReportingManager" && <ReportingManagerSettings />}
          {activeTab === "Demo" && <Demo />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
