import { useNavigate } from "react-router-dom";

import robot from "../assets/robot.png";

export const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh bg-gray-800 text-white">
      <header className="xl:h-25 z-10 h-16 flex justify-between  items-center pl-2 sticky top-0 bg-gray-700">
        <h1 className="flex items-center tracking-widest text-sm md:text-base xl:text-3xl ml-2">
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
            className="w-6 h-6 text-gray-800 dark:text-white hover:text-gray-400 duration-200"
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
      <div className="py-8 max-w-3xl flex flex-col items-center">
        <div className="border-2 max-w-fit">
          <h1 className="text-3xl font-bold mb-2">About Us</h1>
          <p className="mb-4 text-balance">
            We, Olivia and Renat, are passionate developers who took on the
            challenge of creating a powerful and user-friendly real-time chat
            application. With our experience in web and software development, we
            successfully brought this project from concept to implementation.
            Our goal was to build a modern, fast, and secure communication
            platform.
          </p>
        </div>
        <h2 className="text-2xl font-semibold mb-2">App Development</h2>
        <p className="mb-4 text-balance">
          Our real-time chat application is built on the MERN stack (MongoDB,
          Express, React, Node.js). By utilizing cutting-edge technologies and
          best practices, we developed a robust and scalable architecture.
        </p>
        <h2 className="text-2xl font-semibold mb-2">Technologies Used</h2>
        <ul className="list-disc list-inside mb-4">
          <li className="mb-2 text-balance">
            Frontend: React with Vite for an optimized development environment,
            Zustand for state management, and Tailwind CSS/DaisyUI for an
            appealing UI design.
          </li>
          <li className="mb-2 text-balance">
            Backend: Express.js as the web framework, MongoDB as the NoSQL
            database, bcrypt for password encryption, and JSON Web Token (JWT)
            for secure authentication.
          </li>
          <li className="mb-2 text-balance">
            Real-time Communication: Socket.io enables smooth real-time
            messaging.
          </li>
          <li className="mb-2 text-balance">
            Cloud Integration: Cloudinary is used for storing and managing
            images.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-2">App Features</h2>
        <p className="mb-2 text-balance">
          Our application allows users to register, log in, and communicate in
          real-time. Key features include:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li className="mb-2 text-balance">
            User registration and login with secure authentication
          </li>
          <li className="mb-2 text-balance">
            Real-time messaging powered by Socket.io
          </li>
          <li className="mb-2 text-balance">Image uploads and media support</li>
          <li className="mb-2 text-balance">
            Modern user interface, optimized for both desktop and mobile devices
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-2">Project Links</h2>
        <ul className="list-disc list-inside mb-4">
          <li className="mb-2  w-76">
            <span className="inline-block w-36">Live Demo – Olivia:</span>
            <a
              href="https://hello-word-6z2bg.ondigitalocean.app/"
              className="text-blue-400 underline"
            >
              Hello-Word App
            </a>
          </li>
          <li className="mb-2 w-76">
            <span className="inline-block w-36">Live Demo – Renat:</span>
            <a
              href="https://hello-word.khambazarov.dev/"
              className="text-blue-400 underline"
            >
              Hello-Word App
            </a>
          </li>
          <li className="mb-2 w-76">
            <span className="inline-block w-36">Source Code:</span>
            <a
              href="https://github.com/final-project-real-time-chat/realtime-chat"
              className="text-blue-400 underline"
            >
              GitHub Repository
            </a>
          </li>
        </ul>
        <h3 className="text-xl text-center text-balance">
          We appreciate feedback and suggestions and warmly invite developers to
          contribute to the further development of the app!
        </h3>
      </div>
    </div>
  );
};
