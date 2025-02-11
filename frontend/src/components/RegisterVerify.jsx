import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import robot from "../assets/robot.png";

export const RegisterVerify = () => {
  const navigate = useNavigate();

  async function handleVerify(e) {
    e.preventDefault();
    toast.loading("Waiting...");

    const email = e.target.email.value;
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <header className="flex items-center justify-between w-full max-w-md bg-gray-700 text-white p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">Hello, World!</h1>
        <img className="h-12" src={robot} alt="robot" />
      </header>

      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mt-6"
      >
        <h1 className="text-black text-2xl font-bold text-center mb-4">
          Verify your email
        </h1>
        <p className="text-gray-700 text-center mb-4">
          You have received an email with a 6-digit code, please use it to
          verify your email address
        </p>

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

        <label htmlFor="key" className="block text-gray-700 font-semibold">
          Verification Key
        </label>
        <input
          type="text"
          name="key"
          id="key"
          placeholder="XXXXXX"
          minLength={6}
          maxLength={6}
          className="tracking-[16px] text-center text-black w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700"
        >
          Verify your account
        </button>
        <Toaster />
      </form>

      <div className="flex items-center gap-2 mt-4">
        <p className="text-black">Back to login?</p>
        <button
          className="bg-gradient-to-br from-blue-500 to-orange-500 text-white px-4 py-1 rounded-lg font-bold shadow-md hover:from-blue-600 hover:to-orange-600 hover:shadow-lg transition-all duration-300 text-sm"
          onClick={() => navigate("/")}
        >
          Click here
        </button>
      </div>
    </div>
  );
};