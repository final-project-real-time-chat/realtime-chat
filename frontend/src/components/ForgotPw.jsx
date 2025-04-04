import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import robot from "../assets/robot.png";
import { EmailIcon } from "./_AllSVGs";
import { ButtonNavigate } from "./_Button";

export const ForgotPw = () => {
  const navigate = useNavigate();

  async function handleResetPw(e) {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase().trim();

    toast.loading("Waiting...");

    const response = await fetch("/api/users/forgot-pw", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    toast.dismiss();

    if (response.ok) {
      toast.success("email sent with new password");
      setTimeout(() => navigate("/new-pw"), 2000);
    } else if (response.status === 404) {
      toast.error("no user found with this email");
    } else if (response.status === 401) {
      toast.error("Key is not correct, please try again");
    } else {
      toast.error("progress failed.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6 dark:bg-[#1D232A] dark:bg-none bg-gradient-to-r  from-amber-200 to-blue-300">
      <header className="flex items-center justify-between w-full max-w-md bg-gray-700 text-white p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">Hello, Word!</h1>
        <img className="h-12" src={robot} alt="robot" />
      </header>

      <form
        onSubmit={handleResetPw}
        className="mt-[2%] mx-auto w-full max-w-md bg-white/25 shadow-lg shadow-blue-900/30 backdrop-blur-md rounded-xl border border-white/20 p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-white text-black">
          Reset your Password
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
            placeholder="Email"
            className="bg-white/10 dark:text-white text-gray-600 border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700"
        >
          Send Email
        </button>
        <Toaster />
      </form>
      <div className="flex justify-end items-center gap-2 mt-4">
        <p className="dark:text-white text-gray-600 text-sm">Back to Login</p>
        <ButtonNavigate onClick={() => navigate("/")}>
          Click here
        </ButtonNavigate>
      </div>
    </div>
  );
};
