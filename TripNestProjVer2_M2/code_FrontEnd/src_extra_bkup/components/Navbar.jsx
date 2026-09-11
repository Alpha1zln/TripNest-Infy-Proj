
// 4*****
import { Link, useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav>
      <h2>✈️ TripNest</h2>

        <Link to="/">Home</Link>{" "}
        <Link to="/destinations">Destinations</Link>{" "}
        <Link to="/dashboard">Dashboard</Link>{" "}
        <Link to="/login">Login</Link>{" "}
        <Link to="/register">Register</Link>{" "}

        <Link to="/profile">Profile</Link>{" "}
        <Link to="/settings">Settings</Link>{" "}

      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;



// 3 ----------------
// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav>
//       <h2>✈️ TripNest</h2>

//       <Link to="/">Home</Link>{" "}
//       <Link to="/destinations">Destinations</Link>{" "}
//       <Link to="/dashboard">Dashboard</Link>{" "}
//       <Link to="/login">Login</Link>{" "}
//       <Link to="/register">Register</Link>
//     </nav>
//   );
// }

// export default Navbar;


// 2 --------------
// function Navbar({ title }) {
//   return (
//     <nav>
//       <h2>{title}</h2>
//     </nav>
//   );
// }

// export default Navbar;




// try 1
// function Navbar({ title }) {
//   return (
//     <nav>
//       <h2>{title}</h2>
//     </nav>
//   );
// }

// export default Navbar;