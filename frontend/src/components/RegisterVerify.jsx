import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import robot from "../assets/robot.png";
import { EmailIcon, KeyIcon } from "./_AllSVGs";
import { ButtonNavigate } from "./_Button";

export const RegisterVerify = () => {
  const navigate = useNavigate();

  async function handleVerify(e) {
    e.preventDefault();
    toast.loading("Waiting...");

    const email = e.target.email.value.toLowerCase();
    const key = e.target.key.value;

    const response = await fetch("/api/users/register/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, key }),
    });
    const user = await response.json();
    toast.dismiss();

    if (user.isVerified) {
      toast.success("Verified Successfully.");
      setTimeout(() => navigate("/"), 2000);
    } else if (response.status === 400) {
      toast.error("Verification Failed. Your email is already verified");
    } else if (response.status === 409) {
      toast.error("Verification Failed. Key and email doesn't match");
    } else {
      toast.error("Verification Failed. Internal Server Error");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6 dark:bg-[#1D232A] dark:bg-none bg-gradient-to-r  from-amber-200 to-blue-300">
      <header className="flex items-center justify-between w-full max-w-md bg-gray-700 text-white p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">Hello, Word!</h1>
        <img className="h-12" src={robot} alt="robot" />
      </header>
      <Toaster />

      <form
        onSubmit={handleVerify}
        className="mt-[2%] mx-auto w-full max-w-md bg-white/25 shadow-lg shadow-blue-900/30 backdrop-blur-md rounded-xl border border-white/20 p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-white text-black">
          Verify your email
        </h1>
        <p className="dark:text-white text-gray-600 text-center mb-4">
          You will receive an email with a 6-digit code, please use it to verify
          your email address
        </p>

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

        <label
          htmlFor="key"
          className="block dark:text-gray-300 text-gray-600 font-semibold"
        >
          Verification Key
        </label>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <KeyIcon />
          </div>
          <input
            type="tel"
            name="key"
            id="key"
            placeholder="XXXXXX"
            minLength={6}
            maxLength={6}
            className="bg-white/10 dark:text-white text-gray-600 border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-600 transition duration-300"
        >
          Verify your account
        </button>
      </form>

      <div className="flex items-center gap-2 mt-4">
        <p className="dark:text-white text-gray-600 text-sm">Back to login?</p>
        <ButtonNavigate onClick={() => navigate("/")}>
          Click here
        </ButtonNavigate>
      </div>
    </div>
  );
};
