import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import robot from "../assets/robot.png";
import { useState } from "react";

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase();
    const username = e.target.username.value;
    const password = e.target.password.value;

    toast.loading("Waiting...");

    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
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
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 16"
            >
              <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
            </svg>
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
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
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
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path d="M336 192h-16v-64C320 57.406 262.594 0 192 0S64 57.406 64 128v64H48c-26.453 0-48 21.523-48 48v224c0 26.477 21.547 48 48 48h288c26.453 0 48-21.523 48-48V240c0-26.477-21.547-48-48-48zm-229.332-64c0-47.063 38.27-85.332 85.332-85.332s85.332 38.27 85.332 85.332v64H106.668zm0 0" />
            </svg>
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
            {showPassword ? (
              <svg
                className="w-6 h-6 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 -960 960 960"
              >
                <path d="M480.08-326.67q72.25 0 122.75-50.58 50.5-50.57 50.5-122.83 0-72.25-50.58-122.75-50.57-50.5-122.83-50.5-72.25 0-122.75 50.58-50.5 50.57-50.5 122.83 0 72.25 50.58 122.75 50.57 50.5 122.83 50.5Zm-.02-80.33q-38.73 0-65.89-27.11Q387-461.22 387-499.94q0-38.73 27.11-65.89Q441.22-593 479.94-593q38.73 0 65.89 27.11Q573-538.78 573-500.06q0 38.73-27.11 65.89Q518.78-407 480.06-407ZM480-174.33q-155.33 0-280.5-90.5Q74.33-355.33 14.33-500q60-144.67 185.17-235.17 125.17-90.5 280.5-90.5 155.33 0 280.5 90.5Q885.67-644.67 945.67-500q-60 144.67-185.17 235.17-125.17 90.5-280.5 90.5ZM480-500Zm-.02 233.33q117.6 0 215.98-63.66Q794.33-394 846.33-500q-52-106-150.35-169.67-98.35-63.66-215.96-63.66-117.6 0-215.98 63.66Q165.67-606 113-500q52.67 106 151.02 169.67 98.35 63.66 215.96 63.66Z" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 -960 960 960"
              >
                <path d="m639.33-436.33-85-84.34q14.67-33-10.83-53.33t-49.5-7l-77.67-78.33q14.67-7 31.34-10.5 16.66-3.5 32.33-3.5 72.33 0 122.83 50.5T653.33-500q0 14.33-3.5 33t-10.5 30.67Zm150 151.33-62.66-63.33q39.66-32.34 69.66-70.67t51-81q-52-106.67-148.16-170-96.17-63.33-212.5-63.33-37.67 0-71.84 5.66-34.16 5.67-53.5 13.34L288-787.67q37-16.33 91-27.16 54-10.84 104.33-10.84 150.34 0 275.84 86.17 125.5 86.17 186.5 239.5-24.34 64.33-65.84 119.5t-90.5 95.5ZM798-51.33l-152.67-151Q611-189 568.5-181.67q-42.5 7.34-88.5 7.34-153.33 0-279.17-86.84Q75-348 14.33-500 33-551 68.67-602q35.66-51 81.33-96.33l-117.33-116 55.66-57 763 763.33L798-51.33ZM215-635q-33 28.67-59.17 63.33Q129.67-537 113-500q51.33 107.67 149.33 170.5 98 62.83 223 62.83 21.67 0 45.5-2.33 23.84-2.33 41.17-8.67L517.33-333q-7.33 3.33-17.66 4.83-10.34 1.5-19.67 1.5-71.67 0-122.5-50.16Q306.67-427 306.67-500q0-9 1-19.17 1-10.16 3.33-18.16L215-635Zm329.67 110Zm-151.34 76Z" />
              </svg>
            )}
          </div>
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
        <button
          className="cursor-pointer bg-gradient-to-br from-blue-500 to-orange-500 text-white px-4 py-1 rounded-lg font-bold shadow-md hover:from-blue-600 hover:to-orange-600 hover:shadow-lg transition-all duration-300 text-sm text-nowrap"
          onClick={() => navigate("/")}
        >
          Click here
        </button>
      </div>
    </div>
  );
};
