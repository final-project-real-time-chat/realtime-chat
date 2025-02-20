import { useNavigate } from "react-router-dom";
import robot from "../assets/robot.png";

export const Settings = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className="flex justify-between items-center pl-2 sticky top-0 bg-gray-700">
        <h1 className=" flex items-center tracking-widest text-sm md:text-base xl:text-2xl">
          Hello, Word!
        </h1>
        <img
          className="h-12 absolute left-1/2 transform -translate-x-1/2"
          src={robot}
          alt="robot"
        />
        <button onClick={() => navigate("/chatarea")}>back</button>
      </header>
      <main>
        <form>
          <h1>Settings</h1>
        </form>
      </main>
    </>
  );
};
