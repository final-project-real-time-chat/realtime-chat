import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful:", data);
      navigate("/chatarea");
    } else {
      console.error("Login failed");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>

      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter your email"
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Enter your password"
      />
      <button type="submit">Login</button>

      <p>Are you not registered yet?</p>
      <Link to="/register">Click here</Link>
    </form>
  );
};
