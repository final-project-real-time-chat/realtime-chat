import robot from "../assets/robot.png";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn.js";
// import { ErrorMessage } from "./ErrorMessage.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const NewChatroom = () => {
  const navigate = useNavigate();
  const partnerName = useParams();
  const queryClient = useQueryClient();
  async function handleNavigateBack() {
    navigate("/chatarea");
  }

  const mutation = useMutation({
    mutationFn: async (userInput) => {
      const response = await fetch(`/api/chatrooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partnerName: partnerName.id,
          content: userInput,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["chatroom", data.chatroomId]);
      navigate(`/chatarea/chats/${data.chatroomId}`);
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

      <form className={cn("grid ")} onSubmit={handleSendMessage}>
        <textarea
          className={cn("outline-none border-2")}
          name="textarea"
          id="textarea"
          rows={1}
          onInput={handleInput}
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
