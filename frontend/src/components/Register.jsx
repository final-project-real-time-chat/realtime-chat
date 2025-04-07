import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import robot from "../assets/robot.png";
import { ButtonNavigate } from "./_Button";
import {
  EmailIcon,
  EyeClosedIcon,
  EyeOpenedIcon,
  PasswordIcon,
  UserIcon,
} from "./_AllSVGs";

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  let browserLanguage = navigator.language.split("-")[0];

  if (browserLanguage === "de") {
    browserLanguage = "de";
  } else {
    browserLanguage = "en";
  }

  console.log(browserLanguage);

  async function handleRegister(e) {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase().trim();
    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    toast.loading("Waiting...");

    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
        language: browserLanguage,
      }),
    });

    toast.dismiss();

    if (response.ok) {
      await response.json();
      toast.success("Registered successfully.");
      setTimeout(() => navigate("/register/verify"), 2000);
    } else if (response.status === 409) {
      toast.error("Registration Failed. Username or Email already taken");
    } else {
      toast.error("Registration Failed. Internal Server Error");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 dark:bg-[#1D232A] dark:bg-none bg-gradient-to-r  from-amber-200 to-blue-300">
      <header className="flex items-center justify-between w-full max-w-md bg-gray-700 text-white p-4 rounded-lg shadow-lg ">
        <h1 className="text-xl font-bold tracking-wide">Hello, Word!</h1>
        <img className="h-12" src={robot} alt="robot" />
      </header>
      <Toaster />
      <form
        onSubmit={handleRegister}
        className="mt-[2%] mx-auto w-full max-w-md bg-white/25 shadow-lg shadow-blue-900/30 backdrop-blur-md rounded-xl border border-white/20 p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-white text-black">
          Register
        </h1>

        <label
          htmlFor="email"
          className="block dark:text-gray-300 text-gray-600 font-semibold"
        >
          Email
        </label>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <EmailIcon />
          </div>

          <input
            type="email"
            name="email"
            id="email"
            placeholder="john-doe@mail.com"
            className="bg-white/10 dark:text-white text-gray-600 border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
            autoFocus
          />
        </div>

        <label
          htmlFor="username"
          className="block dark:text-gray-300 text-gray-600 font-semibold"
        >
          Username
        </label>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <UserIcon />
          </div>

          <input
            type="text"
            name="username"
            id="username"
            placeholder="John-Doe"
            minLength={2}
            className="bg-white/10 dark:text-white text-gray-600 border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
          />
        </div>

        <label
          htmlFor="password"
          className="block dark:text-gray-300 text-gray-600 font-semibold"
        >
          Password
        </label>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <PasswordIcon />
          </div>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="e.g. $&@ a-z  A-Z  0-9"
            minLength={6}
            className="bg-white/10 dark:text-white text-gray-600 border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
          />

          <div
            className="absolute inset-y-0 end-0 flex items-center pe-3.5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOpenedIcon /> : <EyeClosedIcon />}
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          <input type="checkbox" required />
          <p>
            I have read the{" "}
            <a href="/gdpr" target="_blank" className="text-blue-500 underline">
              GDPR
            </a>
          </p>
        </div>
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-600 transition duration-300"
        >
          Register
        </button>
      </form>

      <div className="flex items-center gap-2 mt-4">
        <p className="dark:text-white text-gray-600 text-sm">
          Already registered?
        </p>
        <ButtonNavigate onClick={() => navigate("/")}>
          Click here
        </ButtonNavigate>
      </div>
    </div>
  );
};
