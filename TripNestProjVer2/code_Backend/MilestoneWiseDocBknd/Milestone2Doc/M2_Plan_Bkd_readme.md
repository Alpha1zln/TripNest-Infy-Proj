# TripNest — Milestone 2 Frontend Plan

## Overview

Milestone 2 focuses on implementing the **core Trip Management and Travel Planning functionality** of the TripNest frontend.

The frontend will consume the REST APIs provided by the Spring Boot backend and provide users with interfaces for creating and managing trips, planning itineraries, scheduling activities, exploring destinations, and viewing trip information through a centralized dashboard.

This document represents the **initial M2 frontend plan**. It will be updated at the end of Milestone 2 to document the actual implementation, design decisions, API integration, testing, issues encountered, and fixes.

---

# M2 Objectives

The main objectives of Milestone 2 frontend development are:

* Implement Trip creation and listing UI
* Implement Trip details, edit and delete functionality
* Implement day-wise itinerary planning
* Implement activity scheduling
* Implement destination listing and details pages
* Implement Trip dashboard
* Integrate all M2 frontend modules with Spring Boot REST APIs
* Establish navigation between TripNest modules
* Validate the complete frontend workflow

---

# Technology Stack

* React.js
* JavaScript
* Vite
* React Router
* Axios
* HTML5
* CSS3
* ESLint

The frontend will communicate with the Spring Boot backend through REST APIs.

---

# M2 Frontend Tasks

## 1. Trip Creation & Listing UI

### Objective

Provide users with an interface to create new trips and view their existing trips.

### Planned Work

* Create Trip creation form
* Add required trip information fields
* Capture:

  * Trip name
  * Destination
  * Start date
  * End date
  * Number of travelers
  * Budget
  * Trip status
* Add form validation
* Create Trip listing page
* Display existing trips
* Connect frontend with Trip APIs using Axios
* Handle loading and API error states

### Expected Deliverable

**Trip creation and listing UI working with backend APIs.**

---

# 2. Trip Details, Edit & Delete UI

### Objective

Allow users to view and manage an individual trip.

### Planned Work

* Create Trip details page
* Display:

  * Destination
  * Dates
  * Travelers
  * Budget
  * Status
* Implement Edit Trip functionality
* Implement Delete Trip functionality
* Connect UI with corresponding Trip APIs
* Add appropriate confirmation/error handling
* Restrict management actions to authorized users where applicable

### Expected Deliverable

**Trip details, edit and delete functionality working.**

---

# 3. Itinerary Planning UI

### Objective

Provide a day-wise itinerary planning interface for each trip.

### Planned Work

* Create itinerary section/page
* Link itinerary to a selected Trip
* Display itinerary by day
* Add itinerary creation form
* Add itinerary update functionality
* Add itinerary deletion functionality
* Connect with Itinerary APIs
* Display itinerary information clearly

### Expected Deliverable

**Day-wise itinerary planning UI working with backend APIs.**

---

# 4. Activity Scheduling UI

### Objective

Allow users to add and manage activities within their itinerary.

### Planned Work

* Create activity scheduling interface
* Link activities to itineraries
* Capture:

  * Activity name
  * Date
  * Time
  * Place
  * Activity type
* Support activity types such as:

  * Sightseeing
  * Transportation
  * Accommodation
  * Dining
  * Adventure
  * Shopping
* Implement activity creation
* Implement activity update
* Implement activity deletion
* Connect with Activity APIs

### Expected Deliverable

**Activity scheduling UI working with backend APIs.**

---

# 5. Destination Pages

### Objective

Provide users with destination information useful for trip planning.

### Planned Work

* Create destination listing page
* Create destination details page
* Display destination information
* Display attractions
* Display travel guides
* Display relevant travel information
* Connect with Destination APIs
* Provide navigation from destinations to trip planning where applicable

### Expected Deliverable

**Destination listing and details pages implemented.**

---

# 6. Trip Dashboard & Frontend Integration

### Objective

Create a centralized dashboard for viewing important trip information and integrate all M2 frontend modules.

### Planned Work

* Create Trip Dashboard
* Display upcoming trips
* Display trip summaries
* Display itinerary summary
* Display relevant trip information
* Provide navigation to:

  * Trip details
  * Itinerary
  * Activities
  * Destinations
* Integrate all M2 frontend pages
* Verify frontend ↔ backend API communication
* Verify authenticated user workflow
* Handle API errors and loading states

### Expected Deliverable

**Complete M2 frontend workflow working.**

---

# Planned Frontend Flow

The expected user flow for M2 is:

```text
Login
  │
  ▼
Dashboard
  │
  ├── View Trips
  │      │
  │      ├── Create Trip
  │      │
  │      └── Select Trip
  │             │
  │             ▼
  │        Trip Details
  │             │
  │       ┌─────┼─────────────┐
  │       │     │             │
  │       ▼     ▼             ▼
  │   Edit/   Itinerary    Delete
  │   Update      │
  │               ▼
  │           Activities
  │
  └── Destinations
          │
          ▼
    Destination Details
```

---

# Planned API Integration

The frontend will consume backend REST APIs for:

```text
Trip APIs
   │
   ├── Create Trip
   ├── Get Trip
   ├── List Trips
   ├── Update Trip
   └── Delete Trip

Itinerary APIs
   │
   ├── Create
   ├── View
   ├── Update
   └── Delete

Activity APIs
   │
   ├── Create
   ├── View
   ├── Update
   └── Delete

Destination APIs
   │
   ├── List Destinations
   └── View Destination Details
```

Axios will be used for communication between the React frontend and Spring Boot backend.

---

# Planned M2 Frontend Structure

The existing frontend structure will be expanded as required.

```text
src/
│
├── assets/
│
├── components/
│   ├── Navbar/
│   ├── Header/
│   ├── Footer/
│   └── ...
│
├── pages/
│   ├── Dashboard/
│   ├── Trips/
│   ├── TripDetails/
│   ├── Itinerary/
│   ├── Activities/
│   ├── Destinations/
│   └── ...
│
├── services/
│   ├── tripService.js
│   ├── itineraryService.js
│   ├── activityService.js
│   └── destinationService.js
│
├── hooks/
│
├── context/
│
├── utils/
│
├── App.jsx
└── main.jsx
```

The actual structure may be adjusted during implementation according to project requirements.

---

# Authentication & Authorization

M1 authentication will continue to be used in M2.

Authenticated requests will include the JWT access token:

```http
Authorization: Bearer <JWT_TOKEN>
```

M2 frontend modules will therefore operate within the authentication and protected-route structure established during M1.

Users should only be able to access and manage resources permitted by the backend authorization rules.

---

# M2 Integration Workflow

The complete expected workflow is:

```text
React Frontend
      │
      ▼
Trip Creation
      │
      ▼
Trip API
      │
      ▼
Spring Boot Backend
      │
      ▼
Trip
      │
      ▼
Itinerary
      │
      ▼
Activities
      │
      ▼
Destination
```

The frontend should allow the user to move naturally through this workflow.

---

# Testing Plan

The following areas will be tested during M2:

### UI Testing

* Pages load correctly
* Forms work correctly
* Navigation works
* Validation works
* Responsive layout where applicable

### API Testing

* GET requests
* POST requests
* PUT/PATCH requests
* DELETE requests
* API success responses
* API error responses
* Loading states

### Authentication Testing

* Authenticated access
* Protected routes
* JWT-based API requests
* Unauthorized access handling

### Workflow Testing

```text
Create Trip
    ↓
View Trip
    ↓
Edit Trip
    ↓
Create Itinerary
    ↓
Add Activities
    ↓
View Destination
    ↓
View Complete Trip Dashboard
```

---

# Expected M2 Outcome

At the completion of Milestone 2, the TripNest frontend should provide a functional end-to-end travel planning workflow.

Users should be able to:

* Create trips
* View their trips
* View trip details
* Edit trips
* Delete trips
* Plan day-wise itineraries
* Schedule activities
* Explore destinations
* View trip summaries through the dashboard
* Navigate between all M2 modules
* Interact with the Spring Boot backend through REST APIs

---

# Documentation Update at M2 Completion

This initial plan will be updated after implementation.

The final M2 frontend README will additionally document:

* Actual implementation
* Final project structure
* Components and pages created
* API endpoints used
* Axios configuration
* Request/response handling
* Important React concepts used
* Authentication integration
* Validation
* Error handling
* UI decisions
* Problems encountered
* Errors and their fixes
* Testing performed
* Final workflow
* Important concepts for revision
* Possible mentor/interview questions
* M2 completion status

---

# Status

**Milestone 2 — Frontend Development: Planned**

M2 frontend development will begin with Trip Management UI and progressively integrate Itinerary, Activity, Destination, and Dashboard functionality.

This document serves as the **initial M2 frontend plan** and will be converted into the final M2 frontend revision/documentation README after milestone completion.


---------------

