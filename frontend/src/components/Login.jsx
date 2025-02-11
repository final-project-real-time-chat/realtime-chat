import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import robot from "../assets/robot.png";

export const Login = () => {
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    toast.loading("Waiting...");

    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    toast.dismiss();

    if (response.ok && data.isVerified === true) {
      toast.success("Logged in Successfully.");
      setTimeout(() => navigate("/chatarea"), 2000);
    } else if (data.isVerified === false) {
      toast.error("Login failed. You need to verify your email.");
    } else if (response.status === 404) {
      toast.error("Login failed. Username or password is wrong.");
    }else {
      toast.error("Login Failed.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <header className="flex items-center justify-between w-full max-w-md bg-gray-700 text-white p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">Hello, Word!</h1>
        <img className="h-12" src={robot} alt="robot" />
      </header>

      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mt-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">Login</h1>
        <label htmlFor="email" className="block text-gray-700 font-semibold">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          className="text-black w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoFocus
        />
        
        <label htmlFor="password" className="block text-gray-700 font-semibold">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          className=" text-black w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700">Login</button>
        <Toaster />
      </form>
      <div className="flex justify-end items-center gap-2 mt-4">
        <p className="text-black">Are you not registered yet?</p>
        <button
          className="bg-gradient-to-br from-blue-500 to-orange-500 text-white px-4 py-1 rounded-lg font-bold shadow-md hover:from-blue-600 hover:to-orange-600 hover:shadow-lg transition-all duration-300 text-sm"
          onClick={() => navigate("/register")}
        >
          Click here
        </button>
      </div>
      
      <div className="flex justify-end items-center gap-2 mt-4">
        <p className="text-black">Do you need to verify your account?</p>
        <button
          className="bg-gradient-to-br from-blue-500 to-orange-500 text-white px-4 py-1 rounded-lg font-bold shadow-md hover:from-blue-600 hover:to-orange-600 hover:shadow-lg transition-all duration-300 text-sm"
          onClick={() => navigate("/register/verify")}
        >
          Click here
        </button>
      </div>
    </div>
  );
};
