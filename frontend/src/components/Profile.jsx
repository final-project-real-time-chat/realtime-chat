import { useNavigate } from "react-router-dom";
import robot from "../assets/robot.png";
import { useQuery } from "@tanstack/react-query";
import { cn } from "../utils/cn.js";

export const Profile = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch("/api/users/current");
      if (!response.ok) {
        throw new Error("Failed to fetch userdata");
      }
      return response.json();
    },
    onSuccess: () => {},
    onError: (error) => {
      console.error(error.message);
    },
  });

  const username = data?.username;
  const usermail = data?.usermail;
  const dateOfRegistration = data?.dateOfRegistration;

  const date = dateOfRegistration ? new Date(dateOfRegistration) : null;
  const germanDateOfRegistration = date
    ? new Intl.DateTimeFormat("de-DE", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Europe/Berlin",
      }).format(date)
    : "Datum nicht verfügbar";

  const rightDate = germanDateOfRegistration.split("MEZ")[0];

  return (
    <div className="min-h-svh flex flex-col dark:bg-base-100 dark:bg-none bg-gradient-to-r from-amber-100 to-blue-300">
      <header className="xl:h-25 z-10 h-16 flex justify-between  items-center pl-2 sticky top-0 bg-gray-700">
        <h1 className="flex text-white items-center tracking-widest text-sm md:text-base xl:text-3xl ml-2">
          Hello, Word!
        </h1>
        <img
          className="h-12 absolute left-1/2 transform -translate-x-1/2 xl:h-16"
          src={robot}
          alt="robot"
        />
        <button
          onClick={() => navigate("/chatarea")}
          className="cursor-pointer pr-4"
        >
          <svg
            className="w-6 h-6 text-white hover:text-gray-400 duration-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"
            />
          </svg>
        </button>
      </header>
      {!isLoading && (
        <main className="flex flex-col justify-center mt-5 mx-auto w-full max-w-md bg-white/25 shadow-lg shadow-blue-900/30 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <img
            src={username ? `https://robohash.org/${username}` : robot}
            alt=""
            className="m-auto mb-5"
          />
          <p className="mx-auto font-bold">Username:</p>
          <p className="mx-auto mb-3 "> {username}</p>
          <p className="mx-auto font-bold">Email: </p>
          <p className="mx-auto mb-3 ">{usermail}</p>

          <p className="mx-auto font-bold">Registriert am:</p>
          <p className="mx-auto ">{rightDate}</p>
        </main>
      )}
    </div>
  );
};
