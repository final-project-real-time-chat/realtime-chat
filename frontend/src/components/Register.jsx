import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import robot from "../assets/robot.png";

export const Register = () => {
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    const email = e.target.email.value;
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
      toast.success("Registered Successfully.");
      setTimeout(() => navigate("/register/verify"), 2000);
    } else if (response.status === 409) {
      toast.error("Registration Failed. Username or Email already taken");
    } else {
      toast.error("Registration Failed. Internal Server Error");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <header className="flex items-center justify-between w-full max-w-md bg-gray-700 text-white p-4 rounded-lg shadow-lg ">
        <h1 className="text-xl font-bold tracking-wide">Hello, World!</h1>
        <img className="h-12" src={robot} alt="robot" />
      </header>

      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mt-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          Register
        </h1>
        <label htmlFor="email" className="block text-gray-700 font-semibold">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          className="text-black w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoFocus
        />

        <label htmlFor="username" className="block text-gray-700 font-semibold">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          minLength={2}
          className="text-black w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label htmlFor="password" className="block text-gray-700 font-semibold">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          minLength={6}
          className="text-black w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700"
        >
          Register
        </button>
        <Toaster />
      </form>

      <div className="flex items-center gap-2 mt-4">
        <p className="text-black">Are you already registered?</p>
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