import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

import robot from "../assets/robot.png";
import { cn } from "../utils/cn.js";

export const ChatArea = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

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
    onSuccess: (data) => {
      queryClient.setQueryData(["chatrooms"], data);
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

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

  useEffect(() => {
    const socket = io(import.meta.env.VITE_REACT_APP_SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("message", () => {
      queryClient.invalidateQueries(["chatrooms"]);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return (
    <>
      <header className="flex justify-between items-center sticky top-0 bg-gray-700">
        <h1 className=" flex items-center tracking-widest text-sm md:text-base xl:text-2xl ml-2">
          Hello, Word!
        </h1>
        <img
          className="h-12 absolute left-1/2 transform -translate-x-1/2"
          src={robot}
          alt="robot"
        />
        <div className="relative">
          <div
            className="cursor-pointer flex flex-col items-center"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div className="relative aspect-square h-8 border-2 bg-gray-400 rounded-full mt-2 mr-2 overflow-hidden hover:scale-120 duration-300">
              <img
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 hover:scale-170"
                src={
                  chatroomsData?.currentUsername
                    ? `https://robohash.org/${chatroomsData?.currentUsername}`
                    : robot
                }
                alt="avatar"
              />
            </div>
            <span>{chatroomsData?.currentUsername}</span>
          </div>

          {/* Settings Menu */}
          {menuOpen && (
            <ul className="border-gray-300 border-l-2 border-b-2 bg-gray-700 absolute right-0 backdrop-blur-xs rounded-bl-2xl shadow-lg z-999 duration-1000">
              <li
                className="hover:bg-gray-600 cursor-pointer  text-white font-extrabold duration-300  px-3 py-1 md:px-8"
                // onClick={() => navigate(`/`)}
              >
                Profile
              </li>
              <li
                className="hover:bg-gray-600 cursor-pointer text-white  font-extrabold  duration-300  px-3 py-1 md:px-8"
                onClick={() => navigate(`/settings`)}
              >
                Settings
              </li>
              <li
                className="hover:bg-gray-600 cursor-pointer text-white  font-extrabold  duration-300  px-3 py-1 md:px-8 text-nowrap"
                // onClick={() => navigate(`/`)}
              >
                Delete Chat
              </li>
              <li
                className="hover:bg-gray-600 cursor-pointer text-white 
                duration-300 text-xs  px-3 py-1 md:px-8 text-nowrap"
                // onClick={() => navigate(`/`)}
              >
                About us
              </li>
              <li
                className="hover:bg-gray-600 cursor-pointer text-white 
                duration-300 text-xs  px-3 py-1 md:px-8 text-nowrap"
                // onClick={() => navigate(`/`)}
              >
                Legal
              </li>
              <li
                className="hover:bg-gray-600 rounded-bl-2xl cursor-pointer text-red-600 font-extrabold  duration-300 px-3 py-1 md:px-8 outline-none"
                onClick={() => logoutMutation.mutate()}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      </header>
      <main>
        {isLoading ? (
          <p>Loading...</p>
        ) : chatroomsError ? (
          <p>Error loading chatrooms: {chatroomsError.message}</p>
        ) : (
          <>
            <div className="flex justify-start pl-2 md:justify-center md:pl-0 bg-blue-300 w-full text-black py-1">
              <button
                onClick={() => navigate("/chatarea/exist")}
                className="cursor-pointer relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-amber-400 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-amber-400 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-300 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  Add new chat
                </span>
              </button>
            </div>
            <ul>
              {chatroomsData?.chatrooms.map((chatroom) => (
                <Link
                  key={chatroom.chatId}
                  to={`/chatarea/chats/${chatroom.chatId}`}
                >
                  <li
                    className={cn(
                      "flex p-2 border-b-2 hover:bg-gray-700 duration-300"
                    )}
                  >
                    <div className="relative aspect-square h-12 border-2 bg-gray-400 rounded-full overflow-hidden">
                      <img
                        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-300 hover:scale-150"
                        src={
                          chatroom.usernames.join(", ")
                            ? `https://robohash.org/${chatroom.usernames.join(", ")}`
                            : robot
                        }
                        alt="avatar"
                      />
                    </div>
                    <div className={cn("flex flex-col pl-2")}>
                      <span>
                        {chatroom.usernames.join(", ") ?? "No Username"}
                      </span>
                      {chatroom.lastMessage && (
                        <span>
                          {truncateText(chatroom.lastMessage.content, 20)}
                        </span>
                      )}
                    </div>
                    <div className="text-amber-400 ml-auto">
                      {chatroom.unreadMessagesCount > 0 && (
                        <span className="text-amber-400 animate-pulse">
                          {chatroom.unreadMessagesCount === 1
                            ? `${chatroom.unreadMessagesCount} unread message`
                            : `${chatroom.unreadMessagesCount} unread messages`}
                        </span>
                      )}
                      {chatroom.timestamps &&
                        chatroom.timestamps.length > 0 && (
                          <span className={cn("flex justify-end")}>
                            {formatTimestamp(chatroom.timestamps[0])}
                          </span>
                        )}
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          </>
        )}
      </main>
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
