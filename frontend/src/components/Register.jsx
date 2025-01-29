import { Link } from "react-router-dom";

export const Register = () => {
  async function handleRegister(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const username = e.target.username.value;
    const password = e.target.password.value;

    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Register successful:", data);
    } else {
      console.error("Register failed");
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <h1>Register</h1>

      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter your email"
      />
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        placeholder="Enter your username"
        minLength={2}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Enter your password"
        minLength={6}
      />
      <button type="submit">Login</button>

      <p>Are you already registered?</p>
      <Link to="/">Click here</Link>
    </form>
  );
};
