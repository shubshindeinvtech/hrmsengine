import { useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import userprofile from "../../assets/images/clientAvatar.png";

const MultiSelectDropdown = ({ options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (id) => {
    const newSelected = selectedValues.includes(id)
      ? selectedValues.filter((item) => item !== id)
      : [...selectedValues, id];
    onChange(newSelected);
  };

  return (
    <div className="relative w-full">
      {/* Dropdown button */}
      <div
        className="flex items-center justify-between rounded-md p-2 cursor-pointer bg-white dark:bg-neutral-800"
        onClick={toggleDropdown}
      >
        <div className="flex flex-wrap gap-2">
          {selectedValues.length > 0 ? (
            selectedValues.map((id) => {
              const employee = options.find((emp) => emp._id === id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-1 bg-blue-100 dark:bg-neutral-700 px-2 py-1 rounded-md"
                >
                  <img
                    src={employee?.profileUrl || userprofile}
                    alt={employee?.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="text-xs">
                    {employee?.name.split(" ")[0]}
                  </span>
                </div>
              );
            })
          ) : (
            <span className="text-gray-400">Select Assignees</span>
          )}
        </div>
        <FaChevronDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 w-full mt-2 p-2 flex flex-col gap-1 bg-white dark:bg-neutral-800 rounded-md shadow-lg z-50 max-h-52 overflow-y-scroll scrollbrhdn"
        >
          {options.map((employee) => (
            <div
              key={employee._id}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-md ${
                selectedValues.includes(employee._id)
                  ? "bg-blue-200 dark:bg-neutral-700"
                  : ""
              }`}
              onClick={() => handleSelect(employee._id)}
            >
              <img
                src={employee.profileUrl || userprofile}
                alt={employee.name}
                className="w-6 h-6 rounded-md"
              />
              <span className="text-sm">{employee.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
