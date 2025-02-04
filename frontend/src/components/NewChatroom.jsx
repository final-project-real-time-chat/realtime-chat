import { useState } from "react";

export const NewChatroom = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [chatroomId, setChatroomId] = useState(null);

  async function handleCreateChatroom(e) {
    e.preventDefault();

    try {
      const response = await fetch(`/api/chatrooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatroomId(data.newChatroom._id);
        console.log("Chatroom created successfully:", data);
      } else {
        console.error("Failed to create chatroom");
      }
    } catch (error) {
      console.error("Failed to create chatroom", error);
    }
  }

  async function handleInviteUser(e) {
    e.preventDefault();
    const inviteEmail = e.target.inviteEmail.value;

    try {
      const response = await fetch(`/api/chatrooms/${chatroomId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User invited successfully:", data);
      } else {
        console.error("Failed to invite user");
      }
    } catch (error) {
      console.error("Failed to invite user", error);
    }
  }

  return (
    <>
      <header>
        <h1>Create new chatroom</h1>
      </header>
      <form onSubmit={handleCreateChatroom}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Create new chatroom</button>
      </form>

      {chatroomId && (
        <>
          <header>
            <h2>Invite User to Chatroom</h2>
          </header>
          <form onSubmit={handleInviteUser}>
            <label htmlFor="inviteEmail">Invite User by Email</label>
            <input type="email" name="inviteEmail" />
            <button type="submit">Invite User</button>
          </form>
        </>
      )}
    </>
  );
};
