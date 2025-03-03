import robot from "../assets/robot.png";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

export const NewChatroom = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const queryClient = useQueryClient();
  const textareaRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async (userInput) => {
      const response = await fetch(`/api/chatrooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partnerName: username,
          content: userInput,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["chatroom", data.chatroomId]);
      navigate(`/chatarea/chats/${data.chatroomId}`);
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  function handleSendMessage(e) {
    e.preventDefault();
    const userInput = e.target.textarea.value;

    mutation.mutate(userInput);
  }

  function handleKeyDown(event) {
    if (window.innerWidth >= 1024 && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage({
        preventDefault: () => {},
        target: { textarea: textareaRef.current },
      });
    }
  }

  function handleInput(event) {
    const textarea = event.target;
    textarea.style.height = "auto";
    const maxHeight = 150;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }

  return (
    <div className="min-h-svh flex flex-col">
      <header className="xl:h-25 z-10 h-16 flex justify-between  items-center pl-2 sticky top-0 bg-gray-700">
        <img
          className="relative mt-2 mr-2 overflow-hidden hover:scale-120 duration-300 z-50 aspect-square h-12 border-2 bg-gray-400 rounded-full"
          src={username ? `https://robohash.org/${username}` : robot}
          alt="avatar"
        />
        <h1 className="md:text-base xl:text-3xl tracking-widest uppercase font-bold absolute left-1/2 transform -translate-x-1/2">
          {username}
        </h1>

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
      <div className="flex flex-col h-full flex-grow"></div>
      <form onSubmit={handleSendMessage} className="sticky bottom-0">
        <div className="flex items-center py-2 rounded bg-gray-50 dark:bg-gray-700">
          <label className="mt-auto cursor-pointer text-gray-500 ml-2 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <input type="file" className="hidden" />
            <span className="material-symbols-outlined p-1">add</span>
          </label>

          <textarea
            name="textarea"
            id="textarea"
            rows={1}
            onInput={handleInput}
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            autoFocus={window.innerWidth >= 1024}
            className="[scrollbar-width:thin] resize-none min-h-8 block mx-3 p-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Hello, word! ……"
          ></textarea>

          <button
            type="submit"
            className="inline-flex justify-center pr-3 text-[rgb(229,47,64)] cursor-pointer"
          >
            <svg
              className="w-8 h-8 rotate-90 rtl:-rotate-90 hover:scale-120  hover:text-[rgb(255,50,54)] duration-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
};
