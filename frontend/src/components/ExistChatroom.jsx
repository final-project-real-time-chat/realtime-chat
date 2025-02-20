import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

import robot from "../assets/robot.png";

export const ExistChatroom = (e) => {
  const navigate = useNavigate();

  const existChatroomMutation = useMutation({
    mutationFn: async (username) => {
      const response = await fetch(`/api/chatrooms/exist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        toast.dismiss();
        toast.error("username not found.");

        throw new Error("Failed to create chatroom");
      }
      const result = await response.json();

      return result;
    },
    onSuccess: (data) => {
      if (data.chatroom !== "new-chatroom") {
        navigate(`/chatarea/chats/${data.chatroom}`);
        return;
      } else {
        navigate(`/chatarea/chats/new-chatroom/${data.partnerName}`);
        return;
      }
    },
    onError: (error) => {
      console.error("Failed to create chatroom", error);
    },
  });

  function handleExistChatroom(e) {
    e.preventDefault();
    const username = e.target.username.value.trim();
    if (username === "") {
      toast.dismiss();
      toast.error("you have to type a username.");
      return;
    }
    existChatroomMutation.mutate(username);
  }

  return (
    <>
      <header
        className={
          "h-16 flex items-center justify-between pl-2 sticky top-0 bg-gray-700"
        }
      >
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
      <form
        onSubmit={handleExistChatroom}
        className="mt-[10%] mx-auto w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          Search for a User
        </h1>
        <label htmlFor="username" className="block text-gray-700 font-semibold">
          Username
        </label>
        <input
          className="text-black w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          name="username"
          id="username"
          placeholder="Enter username"
        />
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700"
        >
          Create new chatroom
        </button>
        <Toaster />
      </form>
    </>
  );
};
