import { useNavigate, useParams } from "react-router-dom";
import robot from "../assets/robot.png";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

export const Settings = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { username } = useParams();
  console.log(username);

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
      <header className="flex justify-between items-center pl-2 sticky top-0 bg-gray-700">
        <h1 className="flex items-center tracking-widest text-sm md:text-base xl:text-2xl">
          Hello, Word!
        </h1>
        <img
          className="h-12 absolute left-1/2 transform -translate-x-1/2"
          src={robot}
          alt="robot"
        />
        <button onClick={() => navigate("/chatarea")}>Back</button>
      </header>
      <main>
        <form>
          <h1>Settings</h1>
          <div>
            <h1>Change Password:</h1>
            <label htmlFor="oldPw">
              Type in your old Password:
              <input
                type="password"
                id="oldPw"
                placeholder="Your old password"
              />
            </label>
            <label htmlFor="newPw">
              Type in your new Password:
              <input
                type="password"
                id="newPw"
                placeholder="Your new password"
              />
            </label>
            <button type="submit">Change Password</button>
          </div>
          <div>
            Delete your Account
            <button type="button" onClick={handleDeleteAcc}>
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
