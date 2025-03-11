import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import robot from "../assets/robot.png";
import { BackButtonIcon, SendMessageIcon } from "./_AllSVGs";

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
    <div className="min-h-svh flex flex-col dark:bg-base-100 dark:bg-none bg-gradient-to-r from-amber-100 to-blue-300">
      <header className="xl:h-25 z-10 h-16 flex justify-between  items-center pl-2 sticky top-0 bg-gray-700">
        <img
          className="relative mt-2 mr-2 overflow-hidden hover:scale-120 duration-300 z-50 aspect-square h-12 border-2 border-gray-100 bg-gray-400 rounded-full"
          src={username ? `https://robohash.org/${username}` : robot}
          alt="avatar"
        />
        <h1 className="md:text-base xl:text-3xl text-white tracking-widest font-bold absolute left-1/2 transform -translate-x-1/2">
          {username}
        </h1>

        <button
          onClick={() => navigate("/chatarea")}
          className="cursor-pointer pr-4"
        >
          <BackButtonIcon />
        </button>
      </header>
      <div className="relative flex flex-col h-full flex-grow">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-nowrap text-2xl text-center">
          <h2>Send your first message</h2>
          <h2>to {username}</h2>
        </div>
      </div>
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
            <SendMessageIcon />
          </button>
        </div>
      </form>
    </div>
  );
};
