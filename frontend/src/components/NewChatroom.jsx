import robot from "../assets/robot.png";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const NewChatroom = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (userInput) => {
      const response = await fetch(`/api/chatrooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partnerName: username,
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
    <div className="min-h-svh flex flex-col">
      <header className="h-16 flex justify-between items-center pl-2 sticky top-0 bg-gray-700">
        <img
          className="aspect-square h-12 border-2 bg-gray-400 rounded-full"
          src={username ? `https://robohash.org/${username}` : robot}
          alt="avatar"
        />
        <h1 className="tracking-widest font-bold absolute left-1/2 transform -translate-x-1/2">
          {username}
        </h1>

        <button
          onClick={() => navigate("/chatarea")}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-bl-2xl font-bold shadow-md hover:from-red-600 hover:to-orange-600 hover:shadow-lg transition-all duration-300"
        >
          ← Back
        </button>
      </header>
      <div className="flex flex-col h-full flex-grow"></div>
      <form
        className="grid grid-cols-[2rem_1fr_4rem] sticky bottom-0 gap-2 mx-2"
        onSubmit={handleSendMessage}
      >
        <label className="flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl cursor-pointer hover:bg-blue-600">
          <input type="file" className="hidden" />+
        </label>
        <textarea
          className="min-h-8 outline-none border-2 bg-white text-black w-full px-1"
          name="textarea"
          id="textarea"
          rows={1}
          onInput={handleInput}
        ></textarea>
        <button className="relative flex items-center justify-center w-full h-full bg-[rgb(249,47,64)] text-white text-lg font-bold rounded-lg overflow-hidden transition-all duration-200 ease-in-out cursor-pointer hover:bg-[rgb(200,40,50)] active:scale-95">
          <div className="svg-wrapper-1 flex items-center justify-center">
            <div className="svg-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path
                  fill="currentColor"
                  d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                ></path>
              </svg>
            </div>
          </div>
        </button>
      </form>
    </div>
  );
};
