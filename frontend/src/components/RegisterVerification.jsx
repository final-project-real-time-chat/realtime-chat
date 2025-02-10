import { useNavigate } from "react-router-dom";

export const RegisterVerification = () => {
  const navigate = useNavigate();

  // TODO: IMPLEMENT SEND NEW KEY & EXPIRE THE KEY e.g. 24 hour
  async function handleVerification(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const key = e.target.key.value;

    const response = await fetch("/api/users/register-verification", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, key }),
    });
    const user = await response.json();
    if (user.isVerified) {
      console.log("Verification successfully");
      navigate("/");
    } else {
      console.log("Is Verified:", user.isVerified);
      console.log({ user });
      console.error("Verification failed");
    }
  }

  return (
    <form onSubmit={handleVerification}>
      <h1>Register</h1>

      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter your email"
      />
      <label htmlFor="key">Varification Key</label>
      <input
        type="text"
        name="key"
        id="key"
        placeholder="XXXXXX"
        minLength={6}
        maxLength={6}
      />
      <button type="submit">Verify your account</button>
    </form>
  );
};
