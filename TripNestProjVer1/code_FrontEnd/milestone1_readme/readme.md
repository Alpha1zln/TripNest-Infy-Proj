# TripNest — Milestone 1 Frontend

## Overview

This folder contains the **frontend implementation** of the TripNest Travel Planning & Trip Management Platform.

The frontend is developed using **React.js** and will provide the user interface for exploring destinations, managing trips, planning itineraries, tracking expenses, and other travel-related features.

## Milestone 1 Goals

* Set up the React frontend project
* Establish the initial project structure
* Configure basic development tools
* Create the initial application layout
* Prepare the frontend for integration with the Spring Boot backend

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
│
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

## Planned Frontend Modules

The complete frontend will be developed in later milestones.

* Authentication
* User Profile
* Dashboard
* Trips & Destinations
* Itinerary
* Budget & Expenses
* Hotel Search
* Group/Trip Members
* Admin

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Future Integration

The frontend will communicate with the **Spring Boot backend through REST APIs**.

```text
React Frontend
      ↓
   REST APIs
      ↓
Spring Boot Backend
      ↓
     MySQL
```

## Status

**Milestone 1 — Initial Frontend Setup**

The basic React development environment has been created. Feature implementation and backend integration will be completed in subsequent milestones.


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


***************************************