import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import robot from "../assets/robot.png";
import { cn } from "../utils/cn.js";
import { NewChatroom } from "./NewChatroom.jsx";

export const ChatArea = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [showNewChatroom, setShowNewChatroom] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChatrooms() {
      try {
        const response = await fetch("/api/chatrooms/chats", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setChatrooms(data.outputChats);
        } else {
          console.error(
            "Failed to fetch chatrooms",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Failed to fetch chatrooms", error);
      }
    }

    fetchChatrooms();
  }, []);

  useEffect(() => {
    function updateChatrooms() {
      setChatrooms((prevChatrooms) => [...prevChatrooms]);
    }

    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    );
    const timeUntilMidnight = midnight - now;

    const timeout = setTimeout(() => {
      updateChatrooms();
      const interval = setInterval(updateChatrooms, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

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
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  async function handleLogout() {
    try {
      const response = await fetch(`/api/users/logout`, {
        method: "GET",
      });
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log("Logout successful:", data);
        navigate("/");
      } else {
        console.log("Failed to logout");
      }
    } catch (error) {
      console.error("Failed to fetch chatrooms", error);
    }
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
          <NewChatroom />
        ) : (
          <ul>
            {chatrooms.map((chatroom) => (
              <Link
                key={chatroom.chatId}
                to={`/chatarea/chats/${chatroom.chatId}`}
              >
                <li className={cn("flex px-2 border-b-2")}>
                  <img src={robot} alt="robot" width={28} />
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
            <button onClick={handleNewChatroom}>Add new chat</button>
          </ul>
        )}
      </main>
      {/* <footer>Settings</footer> */}
    </>
  );
};
