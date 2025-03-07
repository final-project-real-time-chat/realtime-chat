import { useNavigate } from "react-router-dom";
import robot from "../assets/robot.png";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

export const Settings = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function changePassword(e) {
    e.preventDefault();
    const oldPassword = e.target.oldPassword.value.trim();
    const newPassword = e.target.newPassword.value.trim();
    newPasswordMutation.mutate({ oldPassword, newPassword });
  }

  const newPasswordMutation = useMutation({
    mutationFn: async ({ oldPassword, newPassword }) => {
      const response = await fetch(`/api/users/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!response.ok) throw new Error("Failed to change password.");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: () => {
      toast.error("Failed to change password. Please try again.");
    },
  });

  const handleDeleteAcc = () => {
    setShow(true);
  };

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/delete`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete account");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Account deleted!");
      setShow(false);
      navigate("/");
    },
    onError: () => {
      toast.error("Failed to delete account. Please try again.");
    },
  });

  return (
    <div className="min-h-svh flex flex-col dark:bg-base-100 dark:bg-none bg-gradient-to-r from-amber-100 to-blue-300">
      <header className="xl:h-25 z-10 h-16 flex justify-between  items-center pl-2 sticky top-0 bg-gray-700">
        <h1 className=" flex text-white items-center tracking-widest text-sm md:text-base xl:text-3xl ml-2">
          Hello, Word!
        </h1>
        <img
          className="h-12 absolute left-1/2 transform -translate-x-1/2 xl:h-16"
          src={robot}
          alt="robot"
        />
        <button
          onClick={() => navigate("/chatarea")}
          className="cursor-pointer pr-4"
        >
          <svg
            className="w-6 h-6 text-white hover:text-gray-400 duration-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"
            />
          </svg>
        </button>
      </header>
      <main>
        <h1 className="text-center text-4xl mt-5">Settings</h1>
        <form
          onSubmit={changePassword}
          className="mt-[2%] mx-auto w-full max-w-md bg-white/25 shadow-lg shadow-blue-900/30 backdrop-blur-md rounded-xl border border-white/20 p-6"
        >
          <h1 className="text-2xl font-bold text-center mb-4 text-black dark:text-white">
            Change Password:
          </h1>
          <label
            htmlFor="oldPassword"
            className="block text-gray-600 dark:text-gray-300 font-semibold"
          >
            Your current Password:
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
              name="oldPassword"
              id="oldPassword"
              placeholder="Your current password"
              minLength={6}
              className="bg-white/10 text-gray-500 dark:text-white border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              required
              autoFocus
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
          <label
            htmlFor="newPassword"
            className="block text-gray-600 dark:text-gray-300 font-semibold"
          >
            Your new Password:
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
              name="newPassword"
              id="newPassword"
              placeholder="Your new password"
              minLength={6}
              className="bg-white/10 text-gray-500 dark:text-white border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
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
            className="mt-5 cursor-pointer w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700"
          >
            Change Password
          </button>
          {/* </div> */}
        </form>
        <form className="mt-[7%] mx-auto w-full max-w-md bg-white/25 shadow-lg shadow-blue-900/30 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <div>
            <h1 className="text-2xl font-bold text-center mb-4 text-red-600">
              Delete your Account
            </h1>
            <button
              type="button"
              onClick={handleDeleteAcc}
              className="cursor-pointer w-full bg-red-600 text-white p-2 rounded-lg font-bold hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </form>
        <Toaster />
      </main>

      {show && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex flex-col gap-2 text-center xl:top-25">
          <span>Do you really want to delete your account?</span>
          <button
            onClick={() => deleteAccountMutation.mutate()}
            className="bg-white text-red-600 px-2 py-1 rounded"
          >
            Delete
          </button>
          <button
            onClick={() => setShow(false)}
            className="bg-gray-800 px-2 py-1 rounded text-white"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
