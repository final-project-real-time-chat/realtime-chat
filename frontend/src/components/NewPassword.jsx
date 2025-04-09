import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { getTranslations } from "../utils/languageHelper.js";
import { fetchBrowserLanguage } from "../utils/browserLanguage.js";

import robot from "../assets/robot.png";
import {
  EmailIcon,
  EyeClosedIcon,
  EyeOpenedIcon,
  KeyIcon,
  PasswordIcon,
} from "./_AllSVGs";
import { ButtonNavigate } from "./_Button";

const browserLanguage = fetchBrowserLanguage();

export const NewPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [translations, setTranslations] = useState(
    getTranslations(browserLanguage)
  );

  async function handleNewPw(e) {
    e.preventDefault();
    const email = e.target.email.value.toLowerCase().trim();
    const key = e.target.key.value.trim();
    const newPw = e.target.newPw.value.trim();

    toast.loading(translations.loginWaiting);

    const response = await fetch("/api/users/new-pw", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, key, newPw }),
    });

    setTimeout(() => toast.dismiss(), 1000);

    if (response.ok) {
      toast.success(translations.newPwToastSuccessPwChange);
      setTimeout(() => navigate("/"), 2000);
    } else if (response.status === 404) {
      setTimeout(
        () => toast.error(translations.forgotPwToastErrorNotFound),
        1500
      );
    } else {
      setTimeout(() => toast.error(translations.forgotPwToastError), 1500);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6 dark:bg-[#1D232A] dark:bg-none bg-gradient-to-r  from-amber-200 to-blue-300">
      <header className="flex items-center justify-between w-full max-w-md bg-gray-700 text-white p-4 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">Hello, Word!</h1>
        <img className="h-12" src={robot} alt="robot" />
      </header>

      <form
        onSubmit={handleNewPw}
        className="mt-[2%] mx-auto w-full max-w-md bg-white/25 shadow-lg shadow-blue-900/30 backdrop-blur-md rounded-xl border border-white/20 p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-black dark:text-white">
          {translations.forgotPwResetPw}
        </h1>
        <label
          htmlFor="email"
          className="block dark:text-gray-300 text-gray-600 font-semibold"
        >
          {translations.email}
        </label>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <EmailIcon />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            placeholder={translations.email}
            className="bg-white/10 dark:text-white text-gray-600 border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
            autoFocus
          />
        </div>
        <label
          htmlFor="key"
          className="block text-gray-600 dark:text-gray-300 font-semibold"
        >
          {translations.verifyKey}
        </label>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <KeyIcon />
          </div>
          <input
            type="text"
            name="key"
            id="key"
            placeholder="Enter your key"
            minLength={6}
            maxLength={6}
            className="bg-white/10 dark:text-white text-gray-600 border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
          />
        </div>
        <label
          htmlFor="newPw"
          className="block text-gray-600 dark:text-gray-300 font-semibold"
        >
          {translations.newPwNewPw}
        </label>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <PasswordIcon />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="newPw"
            id="newPw"
            placeholder={translations.newPwPlaceholder}
            className="bg-white/10 dark:text-white text-gray-600 border border-gray-500 rounded-lg w-full p-2 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <div
            className="absolute inset-y-0 end-0 flex items-center pe-3.5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOpenedIcon /> : <EyeClosedIcon />}
          </div>
        </div>
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white p-2 rounded-lg font-bold hover:bg-blue-700"
        >
          {translations.newPwSetNewPw}
        </button>
        <Toaster />
      </form>
      <div className="flex justify-end items-center gap-2 mt-4">
        <p className="dark:text-white text-gray-600 text-sm">
          {translations.verifyBackToLogin}
        </p>
        <ButtonNavigate onClick={() => navigate("/")}>
          {translations.registerClickHere}
        </ButtonNavigate>
      </div>
    </div>
  );
};
