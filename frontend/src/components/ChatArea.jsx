import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import robot from "../assets/robot.png";
import { cn } from "../utils/cn.js";

export const ChatArea = () => {
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
    // refetchInterval: 3_000,
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

  return (
    <>
      <header className={"flex justify-between pl-2 sticky top-0 bg-gray-700"}>
        <h1 className="w-32 flex items-center tracking-widest font-bold">
          Hello, Word!
        </h1>
        <img className="h-12" src={robot} alt="robot" />
        <button
          className="bg-[#f92f40] w-36 rounded-bl-2xl font-bold"
          onClick={() => logoutMutation.mutate()}
        >
          Logout
        </button>
      </header>
      <main>
        {isLoading ? (
          <p>Loading...</p>
        ) : chatroomsError ? (
          <p>Error loading chatrooms: {chatroomsError.message}</p>
        ) : (
          <>
            <div className="flex justify-center bg-blue-300 w-full text-black py-1">
              <button
                onClick={() => navigate("/chatarea/exist")}
                className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-amber-400 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-amber-400 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  Add new chat
                </span>
              </button>
            </div>
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
