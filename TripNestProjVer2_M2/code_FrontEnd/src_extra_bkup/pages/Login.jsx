
// 2 --------------------

import { loginUser } from "../services/api";
import { useState } from "react";


function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (email === "") {
            setError("Email is required");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            const data = await loginUser({
            email: email,
            password: password
            });


            localStorage.setItem("token", data);
            
            setSuccess("Login successful! 🎉");

            console.log("Server response:", data);

        } catch (error) {
            setError(error.message);
        }
    }



  return (
    <div>
      <h1>Login 🔐</h1>

      {error && <p>{error}</p>}  
    {success && <p>{success}</p>}
      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <br /><br />

        <button type="submit">
          Login
        </button>

      </form>
    </div>
  );
}

export default Login;



// 1 ------------
// function Login() {
//   return <h1>TripNest Login</h1>;
// }

// export default Login;