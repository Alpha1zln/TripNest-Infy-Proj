*******************
<!-- // M2 -- VER 1  -->
**********************
<!-- <!-- # TripNest — Milestone 2 Frontend V1 -->






















-----------------

*******************
<!-- // M1 -- VER 2  -->
**********************
<!-- # TripNest — Milestone 1 Frontend V2



# TripNest — Milestone 1 Frontend

## Overview

This folder contains the **frontend implementation** of the TripNest Travel Planning & Trip Management Platform.

The frontend is developed using **React.js** and provides the user interface for authentication and the initial TripNest application structure.

Milestone 1 focuses on establishing the React frontend, integrating it with the Spring Boot backend, implementing authentication-related screens, and preparing the application structure for future TripNest modules.

---

## Milestone 1 Goals

The main objectives of the frontend implementation for Milestone 1 were:

* Set up the React.js frontend using Vite
* Establish a clean and scalable project structure
* Configure ESLint and basic development tooling
* Create the initial TripNest application layout
* Create common navigation/header/footer components
* Implement login and registration interfaces
* Integrate frontend authentication with Spring Boot REST APIs
* Handle JWT authentication on the frontend
* Implement protected routes
* Provide authenticated and unauthenticated navigation flows
* Prepare the frontend for future TripNest modules

---

## Technology Stack

* **React.js**
* **JavaScript**
* **Vite**
* **ESLint**
* **HTML5**
* **CSS3**
* **React Router**
* **Fetch / REST API integration**
* **JWT Authentication**

---

## React + Vite Setup

### 1. Create / Open the Frontend Folder

```text
TripNest/
└── milestone1_frontend/
```

Open CMD, PowerShell, or Git Bash inside `milestone1_frontend`.

### 2. Create React Project Using Vite

```bash
npm create vite@latest .
```

Select:

```text
Framework → React
Variant   → JavaScript
Linter    → ESLint
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Open the localhost URL displayed in the terminal.

---

## Important Commands

```bash
npm install       # Install dependencies

npm run dev       # Start development server

npm run build     # Create production build

npm run lint      # Run ESLint checks
```

---

# Frontend Structure

The frontend structure was expanded from the initial Vite structure to support authentication and reusable application components.

```text
milestone1_frontend/

├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Header/
│   │   ├── Navbar/
│   │   └── Footer/
│   │
│   ├── pages/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Home/
│   │   ├── Dashboard/
│   │   ├── Profile/
│   │   ├── CreateGroup/
│   │   └── ...
│   │
│   ├── services/
│   │   └── API / authentication related services
│   │
│   ├── hooks/
│   │
│   ├── context/
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

The exact folders may continue to evolve as additional milestones and modules are implemented.

---

# Application Layout

A common application layout was established so that TripNest pages maintain a consistent UI.

```text
┌─────────────────────────────────────┐
│              Navbar                 │
├─────────────────────────────────────┤
│                                     │
│              Page                   │
│            Content                  │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

Reusable layout components help maintain consistency across the application and reduce duplication.

---

# Authentication

Authentication was integrated with the Spring Boot backend during Milestone 1.

The frontend provides:

* User Registration
* User Login
* Logout
* Authentication state handling
* JWT token handling
* Protected routes
* Authenticated navigation

### Authentication Flow

```text
User
 │
 ▼
React Login Page
 │
 ▼
Login REST API
 │
 ▼
Spring Boot Backend
 │
 ▼
Authentication / JWT
 │
 ▼
JWT Access Token
 │
 ▼
React Frontend
 │
 ▼
Authenticated User
```

For subsequent protected API requests, the JWT is sent using the HTTP `Authorization` header.

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Protected Routes

Routes containing authenticated/user-specific functionality are protected so that unauthenticated users cannot directly access them.

Conceptually:

```text
Public Routes
│
├── Home
├── Login
└── Register

Protected Routes
│
├── Dashboard
├── Profile
├── Create Group
├── Group Members
└── Other authenticated features
```

The protected-route mechanism checks whether the user has a valid authentication state/token before allowing access to protected pages.

---

# Backend Integration

The React frontend communicates with the Spring Boot backend through REST APIs.

```text
React Frontend
       │
       │ HTTP / REST API
       ▼
Spring Boot Backend
       │
       ▼
PostgreSQL Database
```

For authentication:

```text
React
  │
  │ Login / Register Request
  ▼
Spring Boot Authentication API
  │
  │ JWT
  ▼
React
  │
  │ Authorization: Bearer <token>
  ▼
Protected REST APIs
```

The frontend and backend are therefore separated into independent application layers.

---

# User Interface Implemented in M1

The initial TripNest frontend includes UI for:

* Landing / Home page
* Login
* Registration
* Authenticated dashboard
* User profile
* Group creation flow
* Group member interface
* Common header/navbar
* Common footer
* Authentication-aware navigation

The UI has been designed so that additional TripNest functionality can be added without restructuring the entire application.

---

# Planned Frontend Modules

Future milestones will expand the frontend with modules such as:

* Authentication & OAuth2
* User Profile
* Dashboard
* Trips
* Destinations
* Itinerary
* Budget & Expenses
* Group / Trip Members
* Notifications
* Media / Documents
* Recommendations
* Admin

These modules will be introduced incrementally according to the project milestones.

---

# Future Frontend Architecture

As the application grows, the frontend will follow a modular structure similar to:

```text
src/

├── assets/
├── components/
├── pages/
├── services/
├── hooks/
├── context/
├── utils/
└── App.jsx
```

This structure separates:

* **Pages** → application screens
* **Components** → reusable UI elements
* **Services** → API/backend communication
* **Hooks** → reusable React logic
* **Context** → shared application/authentication state
* **Utils** → common helper functions
* **Assets** → images and other static resources

---

# M1 Testing

The frontend was tested during development to verify:

* React application starts successfully
* Vite development server works correctly
* Login page loads correctly
* Registration page loads correctly
* Authentication API communication works
* JWT authentication flow works
* Authenticated pages can be accessed after login
* Protected routes prevent unauthenticated access
* Logout/authentication state behavior works
* Common navigation is displayed consistently
* Frontend successfully communicates with the Spring Boot backend

---

# Milestone 1 Status

## Completed

**Milestone 1 — Frontend Setup, Authentication & Backend Integration**

The React + Vite frontend environment has been successfully established.

The initial TripNest UI structure, reusable layout components, authentication screens, JWT-based authentication flow, protected routes, and Spring Boot REST API integration have been implemented.

The frontend is now ready to be extended with the remaining TripNest business modules in subsequent milestones.

---

## Overall Architecture

```text
                 TRIPNEST

              React Frontend
                    │
        ┌───────────┴───────────┐
        │                       │
   Public Pages          Protected Pages
        │                       │
 Login / Register       Dashboard / Profile
                                │
                         TripNest Features
                                │
                                ▼
                       REST API Integration
                                │
                                ▼
                      Spring Boot Backend
                                │
                                ▼
                           PostgreSQL
```

---

## Next Steps

Future milestones will focus on implementing the core TripNest business functionality, including:

1. Trip and destination management
2. Itinerary planning
3. Budget and expense management
4. Group collaboration
5. Notifications
6. Media/document management
7. Additional dashboard functionality
8. OAuth2/social authentication
9. Advanced travel-planning features




-----------------


*******************
<!-- // ver 1  -->
**********************
<!-- # TripNest — Milestone 1 Frontend

# TripNest — Milestone 1 Frontend

## Overview

This folder contains the **frontend implementation** of the TripNest Travel Planning & Trip Management Platform.

The frontend is developed using **React.js** and will provide the user interface for authentication, destination discovery, trip planning, itineraries, budgets, expenses, collaboration, and other travel-related features.

## Milestone 1 Goals

* Set up the React frontend project
* Establish the initial project structure
* Configure basic development tools
* Create the initial application layout
* Integrate the frontend with the Spring Boot backend APIs

## Technology Stack

* React.js
* JavaScript
* Vite
* ESLint
* HTML5
* CSS3

## Initial Project Structure

```text
milestone1_frontend/

├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## React + Vite Setup

### 1. Create / Open the Frontend Folder

```text
TripNest/
└── milestone1_frontend/
```

Open CMD, PowerShell, or Git Bash inside `milestone1_frontend`.

### 2. Create React Project Using Vite

```bash
npm create vite@latest .
```

Select:

```text
Framework → React
Variant   → JavaScript
Linter    → ESLint
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

Open the localhost URL displayed in the terminal.

## Important Commands

```bash
npm install       # Install dependencies
npm run dev       # Start development server
npm run build     # Create production build
npm run lint      # Check code using ESLint
```

## Planned Frontend Modules

The frontend will be expanded gradually across the project milestones:

* Authentication
* User Profile
* Dashboard
* Trips & Destinations
* Itinerary
* Budget & Expenses
* Group / Trip Members
* Notifications
* Media / Documents
* Admin

## Backend Integration

The React frontend communicates with the **Spring Boot backend through REST APIs**.

```text
React Frontend
      ↓
 REST APIs
      ↓
Spring Boot Backend
      ↓
 PostgreSQL
```

For authenticated requests, the frontend will send the JWT access token to protected backend APIs using the HTTP `Authorization` header.

```text
React
  ↓
Login API
  ↓
Spring Boot
  ↓
JWT returned
  ↓
Frontend stores token
  ↓
Bearer Token
  ↓
Protected REST API
```

## Future Frontend Structure

As the application grows, the `src` folder will be organized into modules such as:

```text
src/

├── assets/
├── components/
├── pages/
├── services/
├── hooks/
├── context/
└── App.jsx
```

These folders will be introduced gradually as new features are implemented.

## Status

**Milestone 1 — React Frontend Setup & Backend Integration**

The initial React + Vite development environment has been created. The frontend is being developed incrementally and will be connected to the Spring Boot authentication APIs as part of Milestone 1.



**************************************

# TripNest — Milestone 1 Frontend

## React + Vite Setup

### 1. Create / open the frontend folder

```text
TripNest/
└── milestone1_frontend/
```

Open CMD/PowerShell inside `milestone1_frontend`.

### 2. Create React project using Vite

```bash
npm create vite@latest .
```

Choose interactively:

```text
Framework → React
Variant   → JavaScript
Linter    → ESLint
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start development server

```bash
npm run dev
```

Open the localhost URL shown in the terminal.

### Initial Structure

```text
milestone1_frontend/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

### Important Commands

```bash
npm install       # Install dependencies
npm run dev       # Start development server
npm run build     # Create production build
npm run lint      # Check code using ESLint
```

### Later

The `src` folder will be expanded based on TripNest features:

```text
components/
pages/
services/
hooks/
context/
assets/
```

Features will be added gradually after the requirements and module division are finalized.


*************************************** -->