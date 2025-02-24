import { useNavigate } from "react-router-dom";
import robot from "../assets/robot.png";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

export const Settings = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

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
      toast.success("Password changed seccessfully!");
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
      navigate("/"); // Redirect after deletion
    },
    onError: () => {
      toast.error("Failed to delete account. Please try again.");
    },
  });

  return (
    <>
      <header className="h-16 flex items-center justify-between pl-2 sticky top-0 bg-gray-700">
        <h1 className="flex items-center tracking-widest font-bold">
          Hello, Word!
        </h1>
        <img
          className="h-12 absolute left-1/2 transform -translate-x-1/2"
          src={robot}
          alt="robot"
        />
        <button
          onClick={() => navigate("/chatarea")}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-bl-2xl font-bold shadow-md hover:from-red-600 hover:to-orange-600 hover:shadow-lg transition-all duration-300"
        >
          ← Back
        </button>
      </header>
      <main>
        <h1 className="text-center text-4xl mt-5">Settings</h1>
        <form
          onSubmit={changePassword}
          className="text-center mt-[5%] mx-auto w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center mb-4 text-black">
            Change Password:
          </h1>
          <div className="">
            <label
              htmlFor="oldPassword"
              className="block text-gray-700 font-semibold"
            >
              Type in your old Password:
              <input
                type="password"
                name="oldPassword"
                id="oldPassword"
                placeholder="Your old password"
              />
            </label>
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-semibold mt-5"
            >
              Type in your new Password:
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="Your new password"
              />
            </label>
            <button
              type="submit"
              className="mt-5 cursor-pointer w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700"
            >
              Change Password
            </button>
          </div>
        </form>
        <form className="mt-[10%] mx-auto w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
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
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-4">
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
    </>
  );
};
