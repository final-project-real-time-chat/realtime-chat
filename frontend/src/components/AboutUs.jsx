import { useNavigate } from "react-router-dom";

import robot from "../assets/robot.png";
import GitHub from "../assets/github.svg";
import LinkedIn from "../assets/linkedin.svg";
import Email from "../assets/email.svg";
import Web from "../assets/web.svg";

export const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-svh dark:bg-gray-800 bg-gray-300 dark:text-white">
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
      <div className="max-w-3xl mx-auto px-4 flex flex-col items-center text-center tracking-wide">
        <h1 className="text-3xl font-bold mt-12">About Us</h1>
        <p className="text-balance mt-4">
          We, Olivia and Renat, are passionate developers who took on the
          challenge of creating a powerful and user-friendly real-time chat
          application. With our experience in web and software development, we
          successfully brought this project from concept to implementation. Our
          goal was to build a modern, fast, and secure communication platform.
        </p>
        <h2 className="text-2xl font-semibold mt-8">App Development</h2>
        <p className="text-balance mt-4">
          Our real-time chat application is built on the MERN stack (MongoDB,
          Express, React, Node.js). By utilizing cutting-edge technologies and
          best practices, we developed a robust and scalable architecture.
        </p>
        <h2 className="text-2xl font-semibold mt-8">Technologies Used</h2>
        <ul className="list-disc list-inside mt-4 space-y-4">
          <li className="text-balance">
            Frontend: React with Vite for an optimized development environment,
            Zustand for state management, and Tailwind CSS/React-hot-toast for
            an appealing UI design.
          </li>
          <li className="text-balance">
            Backend: Express.js as the web framework, MongoDB as the NoSQL
            database, bcrypt for password encryption, and Express-session for
            secure authentication.
          </li>
          <li className="text-balance">
            Real-time Communication: Socket.io enables smooth real-time
            messaging.
          </li>
          <li className="text-balance">
            Cloud Integration: Cloudinary is used for storing and managing
            images.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8">App Features</h2>
        <p className="text-balance text-xl mt-4">
          Our application allows users to register, log in, and communicate in
          real-time.
        </p>
        <h3 className="my-4 text-xl">Key features include:</h3>
        <ul className="list-disc list-inside space-y-4">
          <li className="text-balance">
            Modern user interface, optimized for both desktop and mobile devices
          </li>
          <li className="text-balance">
            User registration and login with secure authentication
          </li>
          <li className="text-balance">Image uploads and media support</li>
          <li className="text-balance">
            Real-time messaging powered by Socket.io
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mt-8">Project Links</h2>
        <ul className="list-inside mt-4 space-y-4">
          <li>
            Live Demo:
            <a
              href="https://hello-word-6z2bg.ondigitalocean.app/"
              className="text-blue-400 hover:text-blue-200 duration-200 underline pl-2"
            >
              Hello-Word App
            </a>
          </li>
          <li>
            Live Demo:
            <a
              href="https://hello-word.khambazarov.dev/"
              className="text-blue-400 hover:text-blue-200 duration-200 underline pl-2"
            >
              Hello-Word App
            </a>
          </li>
          <li>
            Source Code:
            <a
              href="https://github.com/final-project-real-time-chat/realtime-chat"
              className="text-blue-400 hover:text-blue-200 duration-200 underline pl-2"
            >
              GitHub Repository
            </a>
          </li>
        </ul>
        <div className="border-2 shadow-gray-600 bg-gray-700 shadow-2xl mt-8 p-8 rounded-3xl">
          <h2 className="text-3xl font-semibold tracking-widest">
            Our Contacts
          </h2>
          <h2 className="text-2xl font-semibold mt-6 mb-2 tracking-widest">
            Olivia
          </h2>
          <ul className="flex gap-x-8">
            <li>
              <a
                href=""
                title="Still in Development"
                // target="_blank"
                // rel="noopener noreferrer"
              >
                <img
                  src={Web}
                  alt="Web Icon"
                  className="w-8 bg-gray-300 rounded hover:scale-120 duration-300"
                />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/OliviaPiwe"
                title="github.com/OliviaPiwe"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={GitHub}
                  alt="GitHub Icon"
                  className="w-8 hover:scale-120 duration-300"
                />
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/olivia-piechowski"
                title="linkedin.com/in/olivia-piechowski"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={LinkedIn}
                  alt="LinkedIn Icon"
                  className="w-8 hover:scale-120 duration-300"
                />
              </a>
            </li>
            <li>
              <a
                href="mailto:olivia_piechowski@hotmail.de"
                title="olivia_piechowski@hotmail.de"
              >
                <img
                  src={Email}
                  alt="Email Icon"
                  className="w-8 hover:scale-120 duration-300"
                />
              </a>
            </li>
          </ul>
          <h2 className="text-2xl font-semibold mt-6 mb-2 tracking-widest">
            Renat
          </h2>
          <ul className="flex gap-x-8">
            <li>
              <a
                href="https://khambazarov.dev"
                title="https://khambazarov.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={Web}
                  alt="Web Icon"
                  className="w-8 bg-gray-300 rounded hover:scale-120 duration-300"
                />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Khambazarov"
                title="github.com/Khambazarov"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={GitHub}
                  alt="GitHub Icon"
                  className="w-8 hover:scale-120 duration-300"
                />
              </a>
            </li>
            <li>
              <a
                href="http://linkedin.com/in/renat-khambazarov"
                title="linkedin.com/in/renat-khambazarov"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={LinkedIn}
                  alt="LinkedIn Icon"
                  className="w-8 hover:scale-120 duration-300"
                />
              </a>
            </li>
            <li>
              <a
                href="mailto:renat@khambazarov.dev"
                title="renat@khambazarov.dev"
              >
                <img
                  src={Email}
                  alt="Email Icon"
                  className="w-8 hover:scale-120 duration-300"
                />
              </a>
            </li>
          </ul>
        </div>
        <h3 className="text-xl text-center text-balance my-16">
          We appreciate feedback and suggestions and warmly invite developers to
          contribute to the further development of the app!
        </h3>
      </div>
    </div>
  );
};
