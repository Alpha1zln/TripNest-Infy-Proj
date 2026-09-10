
// 2 -----------------
import { registerUser } from "../services/api";
import { useState } from "react";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");


    if (name.length < 2 ) {
        setError("Name must be at least 2 characters");
        return;
    }

    if (email === "") {
        setError("Email is required");
        return;
    }


    if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
    }

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);

    try {
        const data = await registerUser({
        name: name,
        email: email,
        password: password
        });

        if (data === "Email already registered") {
            setError("Email already registered");
            return;
        }
        
        setSuccess("Registration successful! 🎉");
        console.log("Server response:", data);

    } catch (error) {
        setError(error.message);
    }
    
  }

  return (
    <div>
      <h1>Register 📝</h1>

      {error && <p>{error}</p>}
      
      {success && <p>{success}</p>}
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <br /><br />

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
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;




// 1 ------------------------
// function Register() {
//   return <h1>TripNest Register</h1>;
// }

// export default Register;