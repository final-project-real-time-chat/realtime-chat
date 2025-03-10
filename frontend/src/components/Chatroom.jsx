import { useState, useRef, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

import EmojiPicker from "emoji-picker-react";

import robot from "../assets/robot.png";
import fingerSnap from "../assets/finger-snap.mp3";
import positiveNotification from "../assets/positive-notification.wav";
import { cn } from "../utils/cn.js";
import { ErrorMessage } from "./ErrorMessage.jsx";

const audioSend = new Audio(fingerSnap);
const audioReceive = new Audio(positiveNotification);

audioSend.volume = 1; // Setze die Lautstärke auf einen hörbaren Wert
audioReceive.volume = 1; // Setze die Lautstärke auf einen hörbaren Wert

export const Chatroom = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingMessage, setEditingMessage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);

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

  const sendMessageMutation = useMutation({
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
      audioSend.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, content }) => {
      const response = await fetch(`/api/messages/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId, content }),
      });
      if (!response.ok) {
        throw new Error("Failed to edit message");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["chatroom", id]);
      setEditingMessage(null);
      textareaRef.current.value = "";
      audioSend.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async ({ messageId, content }) => {
      const response = await fetch(`/api/messages/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId, content }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete message");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["chatroom", id]);
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

    if (partnerName === "deletedUser" || partnerName === undefined) {
      e.target.textarea.value = "";
      toast.dismiss();
      toast.error("You cannot send messages to a deleted user.", {
        position: "bottom-center",
      });
      return;
    }

    if (editingMessage) {
      editMessageMutation.mutate({
        messageId: editingMessage._id,
        content: userInput,
      });
    } else {
      sendMessageMutation.mutate(userInput);
    }

    e.target.textarea.style.height = "auto";
    messagesEndRef.current.scrollIntoView({ behavior: "auto" });
  }

  function handleKeyDown(event) {
    if (window.innerWidth >= 1024 && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setShowEmojiPicker(false);
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

        if (!nearBottom) {
          audioReceive.play().catch((error) => {
            console.error("Audio playback failed:", error);
          });
        }
        return updatedData;
      });
    });

    socket.on("message-update", ({ updatedMessage }) => {
      if (updatedMessage.chatroom.toString() !== id) return;

      queryClient.setQueryData(["chatroom", id], (prevData) => {
        if (!prevData) return prevData;

        const updatedMessages = prevData.chatroomMessages.map((message) =>
          message._id === updatedMessage._id ? updatedMessage : message
        );

        return {
          ...prevData,
          chatroomMessages: updatedMessages,
        };
      });
    });

    socket.on("message-delete", ({ deletedMessage }) => {
      if (deletedMessage.chatroom.toString() !== id) return;

      queryClient.setQueryData(["chatroom", id], (prevData) => {
        if (!prevData) return prevData;

        const deletedMessages = prevData.chatroomMessages.filter(
          (message) => message._id !== deletedMessage._id
        );

        return {
          ...prevData,
          chatroomMessages: deletedMessages,
        };
      });
    });

    return () => {
      socket.off("message");
      socket.off("message-update");
      socket.off("message-delete");
    };
  }, [id, queryClient, nearBottom, partnerName]);

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

  function handleEditMessage(message) {
    setEditingMessage(message);
    textareaRef.current.value = message.content;
    textareaRef.current.focus();
    textareaRef.current.style.outline = "2px solid yellow";

    setTimeout(() => {
      textareaRef.current.style.outline = "";
    }, 3000);
  }

  function handleDeleteMessage(message) {
    deleteMessageMutation.mutate({ messageId: message._id });
  }

  if ((data === undefined && !isLoading) || data?.errorMessage) {
    return <Navigate to={"/404"}></Navigate>;
  }

  function handleEmojiPicker() {
    setTimeout(() => {
      setShowEmojiPicker((prev) => !prev);
    }, 100);
  }

  function handleEmojiClick(emojiObject) {
    if (!emojiObject || !emojiObject.emoji) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const text = textareaRef.current.value;
    const newText =
      text.slice(0, cursorPosition) +
      emojiObject.emoji +
      text.slice(cursorPosition);
    textareaRef.current.value = newText;

    const event = new Event("input", { bubbles: true });
    textareaRef.current.dispatchEvent(event);

    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        cursorPosition + emojiObject.emoji.length,
        cursorPosition + emojiObject.emoji.length
      );
    }, 0);
  }

  return (
    <div className="min-h-svh flex flex-col dark:bg-[#1d232a] dark:bg-none bg-gradient-to-r from-amber-100 to-blue-300">
      <header className="xl:h-25 z-10 h-16 flex justify-between  items-center pl-2 sticky top-0 bg-gray-700">
        <div className="relative aspect-square h-12 border-2 border-gray-100 bg-gray-400 rounded-full mt-2 mr-2 overflow-hidden hover:scale-120 duration-300 z-10">
          <img
            className={cn(
              "transition-all absolute inset-0 w-full h-full object-cover transform duration-300 hover:scale-170 z-50",
              isLoading && "opacity-0"
            )}
            src={userImg(partnerName)}
            alt="avatar"
          />
        </div>
        <h1 className="md:text-base xl:text-3xl text-white tracking-widest font-bold absolute left-1/2 transform -translate-x-1/2">
          {partnerName}
        </h1>

        <button
          onClick={() => navigate("/chatarea")}
          className="cursor-pointer pr-4 scr"
        >
          <svg
            className="w-6 h-6  text-white hover:text-gray-400 duration-200"
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
      <div className="flex flex-col h-full flex-grow ">
        <ErrorMessage error={error} />
        {unreadMessagesCount > 0 && (
          <button
            onClick={() =>
              messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
            }
            className="cursor-pointer dark:bg-white/10 bg-gray-700 shadow-lg shadow-blue-900/30 backdrop-blur-[5.5px] text-xl rounded-[10px] border border-white/20 text-amber-400 sticky top-[50%] mx-auto px-8 py-1 font-bold dark:hover:bg-white/20 hover:bg-gray-600 transition-colors animate-bounce"
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
                "px-4 pt-2 mx-2 my-6 rounded-xl w-fit max-w-[75%] dark:text-gray-100 text-gray-900 border-2 dark:bg-transparent",
                message.sender.username === currentUsername
                  ? "border-blue-400  bg-blue-50 rounded-br-none ml-auto"
                  : "border-amber-400  bg-amber-50 rounded-bl-none"
              )}
              key={message._id}
              ref={
                index === chatroomMessages.length - 1 ? lastMessageRef : null
              }
            >
              <p className="break-words whitespace-pre-line min-w-40">
                {message.content}
              </p>
              <span className="pt-1 flex justify-end text-[12px] dark:text-gray-400 text-gray-600">
                {message.createdAt !== message.updatedAt
                  ? `( Updated ) ${formatTimestamp(message.createdAt)}`
                  : `${formatTimestamp(message.createdAt)}`}
              </span>
              {message.sender.username === currentUsername && (
                <div className="relative">
                  <button
                    onClick={() => handleEditMessage(message)}
                    className="absolute -left-3 top-1 dark:text-gray-400 text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16px"
                      width="16px"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path d="M186.67-120q-27 0-46.84-19.83Q120-159.67 120-186.67v-586.66q0-27 19.83-46.84Q159.67-840 186.67-840h389L509-773.33H186.67v586.66h586.66v-324.66L840-578v391.33q0 27-19.83 46.84Q800.33-120 773.33-120H186.67ZM480-480ZM360-360v-170l377-377q10-10 22.33-14.67 12.34-4.66 24.67-4.66 12.67 0 25.04 5 12.38 5 22.63 15l74 75q9.4 9.97 14.53 22.02 5.13 12.05 5.13 24.51 0 12.47-4.83 24.97-4.83 12.5-14.83 22.5L530-360H360Zm499-424.67-74.67-74.66L859-784.67Zm-432.33 358H502l246-246L710-710l-38.33-37.33-245 244.33v76.33ZM710-710l-38.33-37.33L710-710l38 37.33L710-710Z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(message)}
                    className="absolute top-1 -right-3 dark:text-gray-400 text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16px"
                      width="16px"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path d="M267.33-120q-27.5 0-47.08-19.58-19.58-19.59-19.58-47.09V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-328 469.33h66.66v-386h-66.66v386Zm164 0h66.66v-386h-66.66v386ZM267.33-740v553.33V-740Z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <Toaster />
      <form onSubmit={handleSendMessage} className="sticky bottom-0">
        {showEmojiPicker && (
          <div className="fixed bottom-16 left-0">
            <EmojiPicker
              className=""
              width={window.innerWidth >= 1024 ? 500 : 320}
              theme="auto"
              reactionsDefaultOpen={true}
              onEmojiClick={handleEmojiClick}
            />
          </div>
        )}

        <div className="flex items-center py-2 rounded bg-gray-700">
          <label className="mt-auto cursor-pointer text-gray-400 ml-2 hover:text-white hover:scale-120 duration-300">
            <span
              className="material-symbols-outlined p-2"
              onClick={handleEmojiPicker}
            >
              add_reaction
            </span>
          </label>

          <textarea
            name="textarea"
            id="textarea"
            rows={1}
            onInput={handleInput}
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            autoFocus={window.innerWidth >= 1024}
            className="[scrollbar-width:thin] resize-none min-h-8 block mx-3 p-2 w-full text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Hello, Word! …"
          />

          <button
            type="submit"
            onClick={() => setShowEmojiPicker(false)}
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
