import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import toast, { Toaster } from "react-hot-toast";

import robot from "../assets/robot.png";

import { BackButtonIcon, UserIcon } from "./_AllSVGs";

export const ExistChatroom = (e) => {
  const navigate = useNavigate();
  const partnerNameRef = useRef(null);

  const existChatroomMutation = useMutation({
    mutationFn: async (username) => {
      const response = await fetch(`/api/chatrooms/exist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.status === 404) {
        toast.dismiss();
        toast.error("username not found.");

        throw new Error("Failed to create chatroom");
      }

      if (response.status === 401) {
        toast.dismiss();
        toast.error("You can't search yourself.");

        throw new Error("Failed to create chatroom");
      }

      if (!response.ok) {
        toast.dismiss();
        toast.error("Failed to find the user.");

        throw new Error("Failed to create chatroom");
      }

      const result = await response.json();

      return result;
    },
    onSuccess: (data) => {
      if (data.chatroom !== "new-chatroom") {
        navigate(`/chatarea/chats/${data.chatroom}`);
        toast.dismiss();
        toast.success(
          `You have already chatted with ${partnerNameRef.current.value}`
        );
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
    <div className="min-h-svh dark:bg-base-100 dark:bg-none bg-gradient-to-r from-amber-100 to-blue-300">
      <header className="flex justify-between items-center sticky top-0 z-50 bg-gray-700 h-16 xl:p-2 xl:h-25">
        <h1 className="text-white flex items-center tracking-widest text-sm md:text-base xl:text-3xl ml-2">
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
          <BackButtonIcon />
        </button>
      </header>
      <form
        onSubmit={handleExistChatroom}
        className="mt-[10%] mx-auto w-full max-w-md bg-white/25 shadow-lg shadow-blue-900/30 backdrop-blur-md rounded-xl border border-white/20 p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-black dark:text-white">
          Search for a User
        </h1>

        <label
          htmlFor="username"
          className="block text-black dark:text-gray-300 font-semibold"
        >
          Username
        </label>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <UserIcon />
          </div>

          <input
            type="text"
            name="username"
            id="username"
            placeholder="John-Doe"
            minLength={2}
            className="bg-white/10 text-black dark:text-white border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
            autoFocus
            ref={partnerNameRef}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg font-bold hover:bg-blue-600 transition duration-300"
        >
          Create new chatroom
        </button>
        <Toaster />
      </form>
    </div>
  );
};
