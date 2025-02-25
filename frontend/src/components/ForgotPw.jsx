import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import robot from "../assets/robot.png";

export const ForgotPw = () => {
  const navigate = useNavigate();

  async function handleResetPw(e) {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase();

    toast.loading("Waiting...");

    const response = await fetch("/api/users/forgot-pw", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    // const data = await response.json();

    toast.dismiss();
    console.log(response);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <header className="flex items-center justify-between w-full max-w-md bg-gray-700 text-white p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">Hello, Word!</h1>
        <img className="h-12" src={robot} alt="robot" />
      </header>

      <form
        onSubmit={handleResetPw}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mt-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          Reset your Password
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
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700"
        >
          Send Email
        </button>
        <Toaster />
      </form>
      <div className="flex justify-end items-center gap-2 mt-4">
        <p className="text-black">Back to Login</p>
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
