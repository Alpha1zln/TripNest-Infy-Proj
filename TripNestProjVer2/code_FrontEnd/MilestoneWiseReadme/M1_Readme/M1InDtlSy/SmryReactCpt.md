
## Gist react cpts


-------
## ⚛️ React CPT — Quick Revision

React → JavaScript library for building UI using reusable components.

Vite → Tool used to quickly create/run a React project.

Component → Reusable UI building block, usually a JavaScript function returning JSX.

JSX → HTML-like syntax written inside JavaScript.



--------------


Props → Data passed from parent component to child component.

State → Data managed inside a component that can change and trigger re-render.

useState() → React Hook used to create and update state.

Event handling → React responds to events using handlers like onClick, onChange, onSubmit.

Controlled input → Input whose value is controlled by React state.
onChange → Runs when an input's value changes.

onSubmit → Runs when a form is submitted.
preventDefault() → Prevents the browser's default form submission/reload.

Conditional rendering → Show different UI depending on a condition, commonly using ? :.

List rendering → Use .map() to render multiple UI elements from an array.

key → Unique identifier React uses when rendering list items.

Objects + .map() → Store structured data in objects and access fields like destination.name.

Reusable component → Create one component such as DestinationCard and reuse it for many items.

useEffect() → Runs side-effect code after rendering, such as API calls.

Dependency array [] → Makes useEffect run once after the initial render.


Dependency array [count] → Makes useEffect run when count changes.

fetch() → Sends HTTP requests from React to an API.

API response JSON → response.json() converts the HTTP response body into JavaScript data.

API data → state → setUsers(data) stores fetched API data in React state.

React → Backend → React sends HTTP request → Spring Boot processes it → returns JSON → React displays it.

-----------------


🧠 Remember this
async → function can use await
await → wait for result
fetch() → make API request
response.json() → convert response to JS data
setUsers(data) → save data in state







----------

In a real app, API calls can take time or fail. So we normally maintain 3 states:

Loading → API request running
Data    → API succeeded
Error   → API failed


-------------

🧠 Remember these 4 things
BrowserRouter → enables routing
Routes        → holds all routes
Route         → connects URL → component
Link          → navigation without page reload

----------------
🧠 Simple rule
components/ → reusable UI pieces
pages/      → complete screens
services/   → API/backend communication
App.jsx     → routing + overall app structure
main.jsx    → starting point of React


----------------

login.jsx

Test these 3 cases:

Email empty       → Email is required
Password = 123    → Password must be at least 6 characters
Both valid        → Console shows email + password

----------------

react data send stage
Three important things:

method  → POST
headers → tells backend we're sending JSON
body    → actual data we're sending


----------------


oauth2 - ggl link to chk 

http://localhost:8080/oauth2/authorization/google


----------------



----------------



----------------