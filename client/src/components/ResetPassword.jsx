import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Loginimg from "../../src/assets/images/login.svg";
import logo from "../../src/assets/images/invezza-logo.png";
import logodark from "../../src/assets/images/invezza-logo-darkmode.png";
import Loading from "./extra/loading";
import ErrorMsg from "./extra/ErrorMsg";
import { IoMailUnread } from "react-icons/io5";
import { FaLongArrowAltLeft } from "react-icons/fa";
import ApiendPonits from "../api/APIEndPoints.json";
import { FaFaceSadTear } from "react-icons/fa6";
import { BiSolidHappyHeartEyes } from "react-icons/bi";
import { motion } from "framer-motion";

const ResetPassword = ({ theme }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${ApiendPonits.baseUrl}${ApiendPonits.endpoints.forgotpassword}`,
        {
          email,
        }
      );

      console.log(response.data);

      if (response.data.success) {
        setPopup(true);
        setTimeout(() => {
          setPopup(false);
          navigate("/login");
        }, 3000); // Popup will be shown for 3 seconds
      } else {
        setError(response.data.msg || "Registration failed");
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
      setLoading(false);
      setError(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        setError(error.response.data.msg || "Login failed. Please try again.");
        setTimeout(() => {
          setError(false);
        }, 3000);
      } else {
        setError("An unexpected error occurred. Please try again.");
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-2 dark:bg-black h-screen dark:text-white"
    >
      <div className="dark:bg-neutral-800 bg-sky-100 flex flex-col md:flex-row gap-28 md:gap-5 justify-center items-center h-full px-5 rounded-md">
        <div className="w-full md:w-1/2 flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col gap-5 items-center">
            <img
              src={theme === "dark" ? logodark : logo}
              className="md:w-2/3"
              alt="logo"
            />
            <h2 className="text-lg text-black dark:text-white">
              Welcome To Invezza HRMS Portal
            </h2>
          </div>
          <div className="dark:bg-neutral-900 bg-white shadow-xl p-3 rounded-md flex flex-col gap-5 w-full md:w-2/3">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label>Email</label>
                <input
                  className="p-2 rounded-md dark:bg-neutral-700 bg-sky-100"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className=" absolute top-0 md:w-[75%] w-[92%]  flex items-center justify-center z-50">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 15 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-4 text-red-500 border border-red-500/10 bg-red-500/10 py-2 px-4 w-fit rounded-lg text-center flex items-center gap-2"
                  >
                    <FaFaceSadTear fontSize={20} />
                    {error}
                  </motion.div>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-600 rounded-md text-white md:text-base font-bold hover:bg-blue-700 w-full flex flex-col gap-2 items-center justify-center"
                disabled={loading}
              >
                <h4 className="py-2">Send Link</h4>
                {loading && <Loading />}
              </button>
              <div className="flex flex-col md:flex-row justify-between  duration-500 hover:dark:bg-neutral-700 hover:px-2 hover:bg-blue-100 w-fit py-1 rounded-md">
                <Link to="/login" className=" font-bold">
                  <h5 className="flex items-center gap-2 w-fit  text-blue-500">
                    <FaLongArrowAltLeft fontSize={20} /> Log In
                  </h5>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 hidden lg:flex justify-center">
          <img src={Loginimg} alt="Clientlogo" className="md:w-2/3" />
        </div>
      </div>
      {popup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity as needed
            backdropFilter: "blur(3px)", // Apply the blur effect
            zIndex: 9998,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="bg-white dark:bg-neutral-950 p-3 rounded-md dark:text-white flex flex-col items-center gap-2">
            <IoMailUnread className="text-green-500" fontSize={30} />
            <h3 className="text-center">
              <strong className="text-lg">Check Your Mail Box</strong> <br />
              Password reset link has been send to your mail
            </h3>
          </div>
        </div>
      )}
    </form>
  );
};

export default ResetPassword;
