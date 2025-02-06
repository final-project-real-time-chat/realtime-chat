import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import robot from "../assets/robot.png";
import { cn } from "../utils/cn.js";
import { ExistChatroom } from "./ExistChatroom.jsx";

export const ChatArea = () => {
  const [showNewChatroom, setShowNewChatroom] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: chatroomsData,
    error: chatroomsError,
    isLoading,
  } = useQuery({
    queryKey: ["chatrooms"],
    queryFn: async () => {
      const response = await fetch("/api/chatrooms/chats");
      if (!response.ok) {
        throw new Error("Failed to fetch chatrooms");
      }
      return response.json();
    },
    refetchInterval: 3_000,
  });

  const chatrooms = chatroomsData?.outputChats;

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/logout`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      return response.json();
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("Failed to logout", error);
    },
  });

  function handleLogout() {
    logoutMutation.mutate();
  }

  function handleNewChatroom() {
    setShowNewChatroom(true);
  }

  return (
    <>
      <header
        className={cn(
          "bg-blue-300 flex justify-between px-4 py-2 items-center"
        )}
      >
        <h1>Hello, Word!</h1>
        <img src={robot} alt="robot" width={40} />
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main>
        {showNewChatroom ? (
          <ExistChatroom />
        ) : isLoading ? (
          <p>Loading...</p>
        ) : chatroomsError ? (
          <p>Error loading chatrooms: {chatroomsError.message}</p>
        ) : (
          <ul>
            {chatrooms.map((chatroom) => (
              <Link
                key={chatroom.chatId}
                to={`/chatarea/chats/${chatroom.chatId}`}
              >
                <li className={cn("flex p-2 border-b-2")}>
                  <img
                    className="aspect-square h-12 border-2 bg-gray-400 rounded-full"
                    src={`https://robohash.org/${chatroom.usernames.join(", ")}`}
                    alt="avatar"
                  />
                  <div className={cn("flex flex-col pl-2")}>
                    <span>{chatroom.usernames.join(", ")}</span>
                    {chatroom.lastMessage && (
                      // <span className="text-ellipsis">
                      <span>
                        {truncateText(chatroom.lastMessage.content, 20)}
                      </span>
                    )}
                  </div>
                  {chatroom.timestamps && chatroom.timestamps.length > 0 && (
                    <span className={cn("flex items-end ml-auto")}>
                      {formatTimestamp(chatroom.timestamps[0])}
                    </span>
                  )}
                </li>
              </Link>
            ))}
            <button onClick={handleNewChatroom}>Add new chat</button>
          </ul>
        )}
      </main>
      {/* <footer>Settings</footer> */}
    </>
  );
};

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

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "…";
  }
  return text;
}
