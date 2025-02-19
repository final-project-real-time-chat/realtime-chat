import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

import robot from "../assets/robot.png";
import { cn } from "../utils/cn.js";
import { ErrorMessage } from "./ErrorMessage.jsx";

const socket = io(import.meta.env.VITE_REACT_APP_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export const Chatroom = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const { data, error } = useQuery({
    queryKey: ["chatroom", id],
    queryFn: async () => {
      const response = await fetch(`/api/chatrooms/chats/${id}`);
      return response.json();
    },
    // refetchInterval: 1_000,
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
    messagesEndRef.current.scrollIntoView({ behavior: "auto" });
  }

  function handleInput(event) {
    const textarea = event.target;
    const maxHeight = 150;
    if (textarea.scrollHeight >= maxHeight) {
      textarea.style.height = `${maxHeight}px`;
    } else {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
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
    socket.on("message", (message) => {
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
        console.log({ updatedData });
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

  return (
    <div className="min-h-svh flex flex-col">
      <header
        className={cn("flex justify-between pl-2 sticky top-0 bg-gray-700")}
      >
        <img
          className="aspect-square h-12 border-2 bg-gray-400 rounded-full"
          src={partnerName ? `https://robohash.org/${partnerName}` : robot}
          alt="avatar"
        />
        <h1 className="flex items-center tracking-widest font-bold">
          {`CurrentUser: ${currentUsername}`}
        </h1>
        <h1 className="flex items-center tracking-widest font-bold">
          {`Partner: ${partnerName}`}
        </h1>
        <button
          onClick={() => navigate("/chatarea")}
          className={cn("bg-[#f92f40] w-36 rounded-bl-2xl font-bold")}
        >
          Back
        </button>
      </header>
      <div className={cn("flex flex-col h-full flex-grow")}>
        <ErrorMessage error={error} />
        {/* {unreadMessagesCount > 0 && (
          <span className="text-red-500 sticky top-[50%] border-2 pl-[50%]">
            {unreadMessagesCount} unread messages
          </span>
        )} */}
        {unreadMessagesCount > 0 && (
          <span className="text-red-500 sticky top-[50%] border-2 pl-[50%]">
            {unreadMessagesCount === 1
              ? `${unreadMessagesCount} unread message`
              : `${unreadMessagesCount} unread messages`}
          </span>
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
      <form className={cn("grid sticky bottom-0")} onSubmit={handleSendMessage}>
        <textarea
          className={cn("outline-none border-2 bg-white text-black")}
          name="textarea"
          id="textarea"
          rows={1}
          onInput={handleInput}
          ref={textareaRef}
        ></textarea>
        <div className={cn("grid grid-cols-4")}>
          <input
            className={cn("bg-[#f92f40] font-bold border-r-2 appearance-none")}
            type="file"
          />
          <button
            className={cn("bg-[#f92f40] font-bold col-span-3")}
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
