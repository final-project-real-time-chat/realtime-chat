import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

import robot from "../assets/robot.png";
import { cn } from "../utils/cn.js";
import { ErrorMessage } from "./ErrorMessage.jsx";

// const socket = io(import.meta.env.VITE_REACT_APP_SOCKET_URL, {
//   transports: ["websocket"],
//   withCredentials: true,
// });

export const Chatroom = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["chatroom", id],
    queryFn: async () => {
      const response = await fetch(`/api/chatrooms/chats/${id}`);
      return response.json();
    },
  });

  const chatroomMessages = data?.chatroomMessages;
  const currentUsername = data?.currentUsername;
  const partnerName = data?.partnerName;
  const unreadMessagesCount = data?.unreadMessagesCount;

  const { mutate: markAsRead } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/chatrooms/chats/${id}/mark-as-read`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to mark messages as read");
      }
      return response.json();
    },
    onError: (error) => {
      toast.error("Internal Server Error.");
      console.error(error.message);
    },
  });

  const mutation = useMutation({
    mutationFn: async (userInput) => {
      const response = await fetch(`/api/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatroom: id, content: userInput }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["chatroom", id]);
      textareaRef.current.value = "";
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  function handleSendMessage(e) {
    e.preventDefault();
    const userInput = e.target.textarea.value
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n");
    if (userInput.trim() === "") return null;
    mutation.mutate(userInput);
    e.target.textarea.style.height = "auto";
    messagesEndRef.current.scrollIntoView({ behavior: "auto" });
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

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
        .format(date)
        .replace(",", "");
    }
  }

  const lastMessageRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [nearBottom, setNearBottom] = useState(true);

  const latestMessageId = chatroomMessages?.at(-1)._id;

  useEffect(() => {
    const socket = io(import.meta.env.VITE_REACT_APP_SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("message", (message) => {
      if (message.chatroom !== id) return;

      queryClient.setQueryData(["chatroom", id], (prevData) => {
        if (!prevData) {
          return { chatroomMessages: [message] };
        }

        const updatedData = {
          ...prevData,
          unreadMessagesCount: nearBottom
            ? 0
            : prevData.unreadMessagesCount + 1,
          chatroomMessages: [...prevData.chatroomMessages, message],
        };
        return updatedData;
      });
    });

    return () => {
      socket.off("message");
    };
  }, [id, queryClient, nearBottom]);

  useEffect(() => {
    if (messagesEndRef.current && nearBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [chatroomMessages, nearBottom]);

  useEffect(() => {
    function onscroll() {
      const position = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      const bottomDistance = scrollHeight - (position + viewportHeight);
      setNearBottom(bottomDistance < 50);
    }

    window.addEventListener("scroll", onscroll);

    return () => window.removeEventListener("scroll", onscroll);
  }, []);

  useEffect(() => {
    if (nearBottom && latestMessageId) {
      markAsRead();
      queryClient.setQueryData(["chatroom", id], (prevData) => {
        if (!prevData) return prevData;
        return {
          ...prevData,
          unreadMessagesCount: 0,
        };
      });
    }
  }, [nearBottom, latestMessageId, markAsRead, queryClient, id]);

  function userImg(partnerName) {
    if (partnerName === "deletedUser" || !partnerName) {
      return robot;
    } else {
      return `https://robohash.org/${partnerName}`;
    }
  }

  return (
    <div className="min-h-svh flex flex-col">
      <header className="h-16 flex justify-between  items-center pl-2 sticky top-0 bg-gray-700">
        <div
          className="relative aspect-square h-12 border-2 bg-gray-400 rounded-full mt-2 mr-2 overflow-hidden hover:scale-120 duration-300 z-50"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <img
            className={cn(
              "transition-all absolute inset-0 w-full h-full object-cover transform duration-300 hover:scale-170 z-50",
              isLoading && "opacity-0"
            )}
            src={userImg(partnerName)}
            alt="avatar"
          />
        </div>
        {menuOpen && (
          <ul className="border-gray-300 border-r-2 border-b-2 bg-gray-700 absolute left-0 mt-50 backdrop-blur-xs rounded-br-2xl shadow-lg duration-1000">
            <li
              className="hover:bg-gray-600 cursor-pointer  text-white font-extrabold duration-300  px-3 pb-1 pt-3 md:px-8 overflow-hidden"
              // onClick={() => navigate(`/`)}
            >
              Profile
            </li>
            <li
              className="hover:bg-gray-600 cursor-pointer text-white  font-extrabold  duration-300  px-3 py-1 md:px-8"
              // onClick={() => navigate(`/`)}
            >
              Settings
            </li>
            <li
              className="hover:bg-gray-600 cursor-pointer text-white  font-extrabold  duration-300  px-3 py-1 md:px-8 text-nowrap"
              // onClick={() => navigate(`/`)}
            >
              Delete Message
            </li>
            <li
              className="hover:bg-gray-600 rounded-br-2xl cursor-pointer text-white  font-extrabold  duration-300  px-3 py-1 md:px-8 text-nowrap"
              // onClick={() => navigate(`/`)}
            >
              Delete Chat
            </li>
          </ul>
        )}
        <h1 className="tracking-widest uppercase font-bold absolute left-1/2 transform -translate-x-1/2">
          {partnerName}
        </h1>

        <button
          onClick={() => navigate("/chatarea")}
          className="cursor-pointer pr-4 scr"
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
      <div className={cn("flex flex-col h-full flex-grow")}>
        <ErrorMessage error={error} />
        {unreadMessagesCount > 0 && (
          <button
            onClick={() =>
              messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
            }
            className="cursor-pointer bg-white/10 shadow-lg shadow-blue-900/30 backdrop-blur-[5.5px] text-xl rounded-[10px] border border-white/20 text-amber-400 sticky top-[50%] mx-auto px-8 py-1 font-bold hover:bg-white/20 transition-colors animate-bounce"
          >
            {unreadMessagesCount === 1
              ? `↓ ${unreadMessagesCount} message. Tap to see. ↓`
              : `↓ ${unreadMessagesCount} messages. Tap to see. ↓`}
          </button>
        )}
        {Array.isArray(chatroomMessages) &&
          chatroomMessages.map((message, index) => (
            <div
              className={cn(
                "px-4 pt-2 mx-1 my-4 rounded-2xl w-fit max-w-[75%]",
                message.sender.username === currentUsername
                  ? "border-blue-400 border-2 ml-auto rounded-br-none"
                  : "border-amber-400 border-2 rounded-bl-none"
              )}
              key={message._id}
              ref={
                index === chatroomMessages.length - 1 ? lastMessageRef : null
              }
            >
              <p className="break-words whitespace-pre-line">
                {message.content}
              </p>
              <span
                className={cn(
                  "pt-1 flex justify-end text-[12px] text-gray-400"
                )}
              >
                {formatTimestamp(message.createdAt)}
              </span>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      {/* <form
        className="grid grid-cols-[2rem_1fr_4rem] sticky bottom-0 gap-2 mx-2"
        onSubmit={handleSendMessage}
      >
        <label className="flex items-center justify-center rounded-full h-8 mt-auto bg-blue-500 text-white text-2xl cursor-pointer hover:bg-blue-600">
          <input type="file" className="hidden" />+
        </label>
        <textarea
          className="min-h-8 outline-none border-2 bg-white text-black w-full px-1"
          name="textarea"
          id="textarea"
          rows={1}
          onInput={handleInput}
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          autoFocus={window.innerWidth >= 1024}
        ></textarea>
        <button className="relative flex items-center justify-center w-full h-8 mt-auto bg-[rgb(249,47,64)] text-white text-lg font-bold rounded-lg overflow-hidden transition-all duration-200 ease-in-out cursor-pointer hover:bg-[rgb(200,40,50)] active:scale-95">
          <div className="svg-wrapper-1 flex items-center justify-center">
            <div className="svg-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                ></path>
              </svg>
            </div>
          </div>
        </button>
        <Toaster />
      </form> */}

      <form onSubmit={handleSendMessage} className="sticky bottom-0">
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>

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
