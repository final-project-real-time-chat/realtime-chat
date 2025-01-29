import { useEffect, useState } from "react";
import robot from "../assets/robot.png";

export const ChatArea = () => {
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    async function fetchChatrooms() {
      const response = await fetch("/api/chatrooms/chats", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setChatrooms(data.allChats);
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
          {chatrooms.map((chat) => (
            <li key={chat._id}>{JSON.stringify(chat.users)}</li>
          ))}
        </ul>
      </main>
      <footer>Settings</footer>
    </>
  );
};
