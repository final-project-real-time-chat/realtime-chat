import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import robot from "../assets/robot.png";

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
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
      <header className="flex items-center justify-between w-full max-w-md bg-gray-700 text-white p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">Hello, Word!</h1>
        <img className="h-12" src={robot} alt="robot" />
      </header>
      <Toaster />

      <form
        onSubmit={handleVerify}
        className="mt-[2%] mx-auto w-full max-w-md bg-white/25 shadow-lg shadow-blue-900/30 backdrop-blur-md rounded-xl border border-white/20 p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-white">
          Verify your email
        </h1>
        <p className="text-white text-center mb-4">
          You will receive an email with a 6-digit code, please use it to verify
          your email address
        </p>

        <label htmlFor="email" className="block text-gray-300 font-semibold">
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
            placeholder="Email"
            className="bg-white/10 text-white border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
            autoFocus
          />
        </div>

        <label htmlFor="key" className="block text-gray-300 font-semibold">
          Verification Key
        </label>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <svg
              className="w-6 h-6 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 -960 960 960"
            >
              <path d="M280.17-395.67q-34.5 0-59.5-24.83-25-24.84-25-59.33 0-34.5 24.83-59.5 24.84-25 59.33-25 34.5 0 59.5 24.83 25 24.84 25 59.33 0 34.5-24.83 59.5-24.84 25-59.33 25ZM280-214.33q-109.78 0-187.72-77.99-77.95-77.99-77.95-187.84 0-109.84 77.95-187.67 77.94-77.84 187.72-77.84 79.33 0 140 38.34Q480.67-669 512.06-601h350.27L991-473.33 802-293.67l-86.33-64.66-84.34 61.66L548.67-359H512q-27 61-87.39 102.83-60.39 41.84-144.61 41.84Zm0-92.34q60.67 0 108.17-39.66 47.5-39.67 59.16-104h132l51 40.33 86-62.33 78 57.66 68.34-56.66-37.34-38.34H447q-8.67-59.33-56.73-101.5-48.06-42.16-110.27-42.16-72 0-122.67 50.66Q106.67-552 106.67-480t50.66 122.67Q208-306.67 280-306.67Z" />
            </svg>
          </div>
          <input
            type="tel"
            name="key"
            id="key"
            placeholder="XXXXXX"
            minLength={6}
            maxLength={6}
            className="bg-white/10 text-white border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
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
        <p className="text-white">Back to login?</p>
        <button
          className="cursor-pointer bg-gradient-to-br from-blue-500 to-orange-500 text-white px-4 py-1 rounded-lg font-bold shadow-md hover:from-blue-600 hover:to-orange-600 hover:shadow-lg transition-all duration-300 text-sm"
          onClick={() => navigate("/")}
        >
          Click here
        </button>
      </div>
    </div>
  );
};
