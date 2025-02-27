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
          className="cursor-pointer pr-4"
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white hover:text-gray-400 duration-200"
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
        <div className="relative mb-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
          </div>

          <input
            type="text"
            name="username"
            id="username"
            placeholder="John-Doe"
            minLength={2}
            className="bg-gray-50 focus:border-blue-500 block ps-10 text-black w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
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
