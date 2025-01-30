import { useEffect, useState } from "react";
import robot from "../assets/robot.png";
import { Link } from "react-router-dom";

export const ChatArea = () => {
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    async function fetchChatrooms() {
      const response = await fetch("/api/chatrooms/chats", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        console.log({ data });
        setChatrooms(data.outputChats);
      } else {
        console.error("Failed to fetch chatrooms");
      }
    }

    fetchChatrooms();
  }, []);

  return (
    <>
      <header>
        <h1>Hello, Word!</h1>
        <img src={robot} alt="robot" width={100} />
      </header>
      <main>
        <ul>
          {chatrooms.map((chatroom) => (
            <Link
              key={chatroom.chatId}
              to={`/chatarea/chats/${chatroom.chatId}`}
            >
              <li>{chatroom.usernames.join(", ")}</li>
            </Link>
          ))}
          {chatrooms.length === 0 && <button>Add new chat</button>}
        </ul>
      </main>
      <footer>Settings</footer>
    </>
  );
};
