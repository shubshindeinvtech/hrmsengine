import React, { useState, useEffect, useRef, useContext } from "react";
import {
  DASHBOARD_SIDEBAR_LINKS,
  getFilteredLinks,
} from "../../lib/consts/navigation";
import logolightmode from "../../assets/images/invezza-logo.png";
import logoDarkmode from "../../assets/images/invezza-logo-darkmode.png";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { HiMenuAlt1 } from "react-icons/hi";
import { motion } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext"; // Add AuthContext import
import { TbHelpSquareRoundedFilled } from "react-icons/tb";
import { HiCloudDownload } from "react-icons/hi";
import { FaDownload } from "react-icons/fa6";

const LinkClasses =
  "flex hover:bg-sky-50 dark:hover:bg-neutral-800 hover:duration-500 p-3 mt-1.5 rounded-md euclid";

export default function Sidebar({ theme }) {
  const { pathname } = useLocation();
  const { userData } = useContext(AuthContext); // Use AuthContext to get user data
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false); // Close sidebar when clicking outside
      }
    }

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleItemClick = (item) => {
    if (isMobile) {
      setClickedItem(clickedItem === item ? null : item);
    }
  };

  const handleMouseEnter = (item) => {
    if (!isMobile) {
      setClickedItem(item);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setClickedItem(null);
    }
  };

  const handleToggleAndItemClick = (item) => {
    toggleSidebar();
    handleItemClick(item);
  };

  const handleClick = () => {
    handleToggleAndItemClick();
    if (window.matchMedia && window.matchMedia("(max-width: 768px)").matches) {
      setRotate(!rotate); // Set rotate state only on mobile screen
    }
  };

  const [rotate, setRotate] = React.useState(true);

  const filteredLinks = getFilteredLinks(userData?.employeeData?.auth); // Filter links based on user auth

  return (
    <div
      className={`z-50 ${
        isSidebarOpen
          ? "backdrop-blur-md md:backdrop-blur-0 fixed md:relative inset-0"
          : ""
      }`}
    >
      <button
        className="md:hidden fixed top-2 left-2 p-3 dark:text-white bg-white dark:bg-neutral-950 rounded-md"
        onClick={() => {
          toggleSidebar();
          setRotate(!rotate);
        }}
      >
        <HiMenuAlt1 className="text-2xl " />
      </button>
      <div
        ref={sidebarRef}
        className={`md:flex md:flex-col w-52  h-[98vh] md:h-screen ml-2 mt-2 md:m-0 md:rounded-none rounded-md absolute md:relative p-2 bg-white dark:bg-neutral-950 z-50 shadow-2xl md:shadow-none md:dark:border-none dark:border-2 dark:border-neutral-700 ${
          isSidebarOpen ? "" : "hidden"
        }`}
      >
        <div className="flex flex-row justify-between items-center bg-none md:bg-sky-100 md:dark:bg-neutral-900 rounded-md">
          {theme === "dark" ? (
            <img
              src={logoDarkmode}
              className="pr-16 md:px-5 md:py-2"
              alt="logo"
            />
          ) : (
            <img
              src={logolightmode}
              className="pr-16 md:px-5 md:py-2"
              alt="logo"
            />
          )}
          <div className="text-2xl absolute flex md:hidden right-5 mt-3 bg-sky-50 dark:bg-neutral-800 dark:text-white p-2 hover:bg-sky-100 dark:hover:bg-neutral-700 rounded-md">
            <TbLayoutSidebarLeftCollapseFilled
              className=""
              onClick={() => {
                toggleSidebar();
                setRotate(!rotate);
              }}
            />
          </div>
        </div>

        <div className="flex-1 mt-10 mb-2">
          {filteredLinks.map((item) => (
            <React.Fragment key={item.key}>
              <div
                className="relative gred5"
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="hidden md:block">
                  <SidebarLink
                    item={item}
                    pathname={pathname}
                    // onClick={handleToggleAndItemClick}
                    onClick={() => {
                      handleToggleAndItemClick();
                      setRotate(!rotate);
                    }}
                  />
                </div>
                <div className="md:hidden">
                  <SidebarLink
                    item={item}
                    pathname={pathname}
                    onClick={handleClick}
                    // onClick={() => {
                    //   handleToggleAndItemClick();
                    //   setRotate(rotate);
                    // }}
                  />
                </div>
                {clickedItem === item && item.subItems && (
                  <div className="md:absolute left-44 md:pl-6 top-0 md:w-60 ">
                    <div className="bg-white dark:bg-neutral-950 shadow-md rounded-md p-1 border border-neutral-600">
                      {item.subItems.map((subItem) => (
                        <SidebarLink
                          key={subItem.key}
                          item={subItem}
                          pathname={pathname}
                          onClick={toggleSidebar}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
        <a
          className="bg-blue-500/20 text-blue-600 p-2 rounded-lg w-fit group cursor-pointer relative overflow-hidden"
          href="/docs/HRMS_Portal_User_Guide.pdf"
          download="HRMS_Portal_User_Guide.pdf"
        >
          <div className="flex items-center gap-1">
            {/* Help Icon (Moves Down on Hover) */}
            <span className="flex transform transition-transform duration-300 ease-in-out group-hover:translate-y-5 group-hover:opacity-0 opacity-100">
              <TbHelpSquareRoundedFilled fontSize={22} />
            </span>

            {/* Download Icon (Comes from Top on Hover) */}
            <span className="absolute top-0 flex transform -translate-y-5 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-2.5 group-hover:opacity-100">
              <HiCloudDownload fontSize={22} />
            </span>

            <span className="transition-all duration-300">Help</span>
          </div>
        </a>
      </div>
    </div>
  );
}

function SidebarLink({ item, pathname, onClick }) {
  // Check if pathname exactly matches item.path or if it includes item.path followed by a '/'
  const isActive =
    pathname === item.path || pathname.startsWith(item.path + "/");

  return (
    <Link
      to={item.path}
      className={classNames(
        isActive
          ? "euclid-bold bg-sky-50 dark:bg-neutral-900 after:w-1.5 after:bg-[#3C5EFE] after:rounded-full"
          : "flex items-center",
        LinkClasses
      )}
      onClick={onClick}
    >
      <span
        className={`text-xl my-auto ${
          isActive ? "text-[#3C5EFE]" : "text-slate-600 dark:text-blue-200"
        }`}
      >
        {item.icon}
      </span>

      <span className="ml-3 w-[90%] dark:text-white">{item.label}</span>
    </Link>
  );
}
