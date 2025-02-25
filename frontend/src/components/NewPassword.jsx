import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import robot from "../assets/robot.png";

export const NewPassword = () => {
  const navigate = useNavigate();

  async function handleNewPw(e) {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase();
    const key = e.target.key.value;
    const newPw = e.target.newPw.value;

    toast.loading("Waiting...");

    const response = await fetch("/api/users/new-pw", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, key, newPw }),
    });

    toast.dismiss();

    if (response.ok) {
      toast.success("Password successfully changed");
      setTimeout(() => navigate("/"), 2000);
    } else if (response.status === 404) {
      toast.error("no user found with this email");
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
        onSubmit={handleNewPw}
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
        <label htmlFor="email" className="block text-gray-700 font-semibold">
          Key
        </label>
        <input
          type="text"
          name="key"
          id="key"
          placeholder="Enter your key"
          className="text-black w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <label htmlFor="email" className="block text-gray-700 font-semibold">
          new Password
        </label>
        <input
          type="password"
          name="newPw"
          id="newPw"
          placeholder="Enter your new Password"
          className="text-black w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          minLength={6}
        />
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700"
        >
          Set new Password
        </button>
        <Toaster />
      </form>
    </div>
  );
};
