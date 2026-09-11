

// try 5 ---------------
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Destinations from "./pages/Destinations";

import Navbar from "./components/Navbar";
import DestinationCard from "./components/DestinationCard";
import Profile from "./pages/Profile";

function App() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      console.log("Google JWT stored:", token);
    }
  }, []);


  return (
    <BrowserRouter>

      <Navbar />
      {/* <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/destinations">Destinations</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route
              path="/dashboard"
              element={<ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                      }
        />
        <Route path="/destinations" element={<Destinations />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


      </Routes>

    </BrowserRouter>
  );
}

export default App;







// import DestinationCard from "./DestinationCard";

// // try 4 --------------------
// import { useState } from "react";
// import Navbar from "./Navbar";

// function App() {

//   const [message, setMessage] = useState("Welcome to TripNest");
//   function handleClick() {
//     setMessage("Let's plan your next adventure! ✈️");
//   }

//   // const [name, setName] = useState("");
//   // const [greeting, setGreeting] = useState("");
//   // function handleGreeting() {
//   //   setGreeting("Hello, " + name + "!");
//   // }


//   // function handleSubmit(event) {
//   //   event.preventDefault();

//   //   console.log("Form submitted");
//   //   console.log("Name:", name);
//   // }

//   const [message2, setMessage2] = useState("Explore Destinations");
//   function handleClick2() {
//     setMessage2("Discover amazing places 🌍! ✈️");
//   }

//   // ----------------
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
  
//   function handleSubmitForm(event) {
//     event.preventDefault();

//     console.log("Email:", email);
//     console.log("Password:", password);
//   }

// // --------------
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

// // ----------
//   // const destinations1 = [
//   //   "Paris 🇫🇷",
//   //   "Tokyo 🇯🇵",
//   //   "Bali 🇮🇩",
//   //   "Dubai 🇦🇪"
//   // ];
// // ---------------------------------



//   const destinations = [
//     {
//       name: "Goa",
//       country: "India",
//       emoji: "🇮🇳",
//       description: "Beaches, sunsets and great food."
//     },
//     {
//       name: "Paris",
//       country: "France",
//       emoji: "🇫🇷",
//       description: "The city of lights."
//     },
//     {
//       name: "Tokyo",
//       country: "Japan",
//       emoji: "🇯🇵",
//       description: "A fascinating mix of tradition and technology."
//     },
//     {
//       name: "Rome",
//       country: "Italy",
//       emoji: "🇮🇹",
//       description: "Ancient history, ruins, and unmatched culinary art."
//     },
//     {
//       name: "Bali",
//       country: "Indonesia",
//       emoji: "🇮🇩",
//       description: "Tropical landscapes, serene temples, and coral reefs."
//     }
//   ];

//   // Handler function in the parent
//   const handleExplore = (destinationName) => {
//     alert(`Exploring trips and itineraries for ${destinationName}!`);
//   };

// //-----------------------------------
//   return (
//     <div>
//       <br /><br />
//       <Navbar title="✈️ TripNest" />
    
//     {/* ---------------------------------- */}
//       <h1>{message}</h1>
//       <button onClick={handleClick}>
//         <i>Start Planning</i>
//       </button>
//       {/* ---------------------- */}
//       <br /><br />


//     {/* ---------------------------------- */}
//       <form onSubmit={handleSubmitForm}>

//         <input
//           type="email"
//           placeholder="Enter email"
//           value={email}
//           onChange={(event) => setEmail(event.target.value)}
//         />

//         <br /><br />

//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(event) => setPassword(event.target.value)}
//         />

//         <br /><br />

//         <button type="submit">
//           Login
//         </button>

//       </form>

//       {/* ---------------------------------- */}
//       {/* <button onClick={handleGreeting}>
//         submit  
//       </button>
//       <br />
//       <p>{greeting}</p> */}


//       {/* ---------------------------------- */}

//       {isLoggedIn ? (
//         <div>
//           <h2>Welcome back to TripNest! 🌍</h2>

//           <button onClick={() => setIsLoggedIn(false)}>
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div>
//           <h2>Please login to continue.</h2>

//           <button onClick={() => setIsLoggedIn(true)}>
//             Login
//           </button>
//         </div>
//       )}

//       {/* ---------------------------------- */}
//       {/* <br />
//       <h3>Popular Destinations</h3>

//       {destinations.map((destination1) => (
//         <h3>{destination1}</h3>
//       ))} */}


//       {/* ---------------------------------- */}

//       <br /><br />
//       <h2>{message2}</h2>
//       <button onClick={handleClick2}>
//         <i>Explore Destinations</i>
//       </button>
      

//       {/* ------------------------ */}
//       <h1>Featured Destinations</h1>
//       <div>
//         {destinations.map((destination) => (
//           <DestinationCard
//             key={destination.name}
//             destination={destination}
//             onExplore={handleExplore}
//           />
//         ))}
//       </div>

//     </div>
//   );
// }

// export default App;




// try 3 ------------------------
// import { useState } from "react";
// import Navbar from "./Navbar";

// function App() {

//   const [message, setMessage] = useState("Welcome to TripNest");
//   function handleClick() {
//     setMessage("Let's plan your next adventure! ✈️");
//   }

//   const [message2, setMessage2] = useState("Explore Destinations");
//   function handleClick2() {
//     setMessage2("Discover amazing places 🌍! ✈️");
//   }

//   return (
//     <div>
//       <br /><br />
//       <Navbar title="✈️ TripNest" />

//       <h1>{message}</h1>
//       <button onClick={handleClick}>
//         <i>Start Planning</i>
//       </button>

//       <br /><br />

//       <h2>{message2}</h2>
//       <button onClick={handleClick2}>
//         <i>Explore Destinations</i>
//       </button>
      

//     </div>
//   );
// }

// export default App;



// try 2 *************************************
// import { useState } from "react";
// import Navbar from "./Navbar";

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <Navbar title="✈️ TripNest" />

//       <h1>Plan smarter. Travel better.</h1>

//       <p>Button clicked: {count} times</p>

//       <button onClick={() => setCount(count + 1)}>
//         Click Me
//       </button>
//     </div>
//   );
// }

// export default App;

///  try 1 -----------------------
// import './App.css'

// import Navbar from "./Navbar";

// function App() {
//   return (
//     <div>
//       <Navbar title="✈️ TripNest" />

//       <h3>Adventure made simple. Easy planning. Happy journeys.</h3>
//       <h4>Your Journey starts with TripNest.</h4>
//     </div>
//   );
// }

// export default App
