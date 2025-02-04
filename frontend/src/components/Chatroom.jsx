import { useRef } from "react";
import robot from "../assets/robot.png";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn.js";
import { ErrorMessage } from "./ErrorMessage.jsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
    // refetchInterval: 30_000,
  });

  const chatroomMessages = data?.chatroomMessages;
  const currentUsername = data?.currentUsername;

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
    const userInput = e.target.textarea.value;
    mutation.mutate(userInput);
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

  async function handleNavigateBack() {
    navigate("/chatarea");
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

  return (
    <>
      <header className={cn("flex justify-between pl-2")}>
        <img src={robot} alt="robot" width={40} />
        <button
          onClick={handleNavigateBack}
          className={cn("bg-[#f92f40] w-16 rounded-bl-2xl font-bold")}
        >
          Back
        </button>
      </header>
      <div>
        <ErrorMessage error={error} />
        {Array.isArray(chatroomMessages) &&
          chatroomMessages.map((message) => (
            <div
              className={cn(
                "px-4 pt-2 mx-1 my-4  rounded-2xl  w-fit max-w-[75%]",
                message.sender.username === currentUsername
                  ? "bg-blue-400 ml-auto rounded-br-none"
                  : "bg-amber-400 rounded-bl-none"
              )}
              key={message._id}
            >
              <p>{message.content}</p>
              <span
                className={cn(
                  "pt-1 flex justify-end  text-[12px] text-gray-600"
                )}
              >
                {formatTimestamp(message.createdAt)}
              </span>
            </div>
          ))}
      </div>
      <form className={cn("grid ")} onSubmit={handleSendMessage}>
        <textarea
          className={cn("outline-none border-2")}
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
    </>
  );
};
