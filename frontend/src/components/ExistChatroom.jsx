import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import robot from "../assets/robot.png";

export const ExistChatroom = (e) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const existChatroomMutation = useMutation({
    mutationFn: async (username) => {
      const response = await fetch(`/api/chatrooms/exist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chatroom");
      }
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      if (data.chatroom !== "new-chatroom") {
        navigate(`/chatarea/chats/${data.chatroom}`);
        return;
      } else {
        // console.log("sind im else");
        // console.log("partner: ", data.partnerName, data.partnerId);
        navigate(`/chatarea/chats/new-chatroom/${data.partnerName}`);
        return;
      }
    },
    onError: (error) => {
      console.error("Failed to create chatroom", error);
    },
  });

  function handleExistChatroom(e) {
    e.preventDefault();
    const username = e.target.username.value;
    existChatroomMutation.mutate(username);
  }

  async function handleNavigateBack() {
    navigate("/chatarea");
  }

  return (
    <>
      <header>
        <header
          className={"flex justify-between pl-2 sticky top-0 bg-gray-700"}
        >
          <h1 className="flex items-center tracking-widest font-bold">Hello, Word!</h1>
          <img className="h-12" src={robot} alt="robot" />
          <button
            onClick={handleNavigateBack}
            className={"bg-[#f92f40] w-16 rounded-bl-2xl font-bold"}
          >
            Back
          </button>
        </header>
        <h1>Create new chatroom</h1>
      </header>
      <form onSubmit={handleExistChatroom}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
        />
        <button type="submit">Create new chatroom</button>
      </form>
    </>
  );
};
