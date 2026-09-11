# TripNest — Travel Planning & Trip Management Platform

> **Infosys Springboard Internship 2026 — Team Project**

TripNest is a Travel Planning and Trip Management Platform designed to bring travel planning, itinerary management, budgeting, expense tracking, collaboration, and destination discovery into one application.

The platform helps users plan trips, organize day-wise itineraries, manage budgets and expenses, collaborate with travel groups, and explore destinations from a single dashboard.

---

# 1. Project Structure

The main project repository is organized as:

```text
TripNestProj/
│
├── code_Backend/
│   └── Spring Boot Backend
│
├── code_Frontend/
│   └── React Frontend
│
└── README.md
```

The project uses a separate backend and frontend architecture.

```text
                    TripNest
                       │
             ┌─────────┴─────────┐
             │                   │
        React Frontend      Spring Boot Backend
             │                   │
             └─────────┬─────────┘
                       │
                   PostgreSQL
```

---

# 2. Problem Statement

Travel information is often scattered across multiple applications and websites.

Users may need different applications for:

* Destination research
* Trip planning
* Itinerary creation
* Budget management
* Expense tracking
* Group coordination
* Document management
* Notifications

This makes travel planning inconvenient, especially for group trips.

TripNest aims to provide a centralized platform for these activities.

---

# 3. Proposed Solution

TripNest provides a unified travel management platform where users can:

* Register and authenticate
* Explore destinations
* Create and manage trips
* Build day-wise itineraries
* Set trip budgets
* Track expenses
* Collaborate with other travelers
* Manage trip-related documents/media
* Receive notifications
* Get destination/recommendation assistance
* Manage trip information through a dashboard

---

# 4. Major Features

## Authentication & Security

* User registration
* Login
* BCrypt password hashing
* JWT authentication
* Protected APIs
* Role-based access control
* OAuth2 login

## Trip Management

* Create trips
* Update trips
* Delete trips
* View trip details
* Manage trip members

## Itinerary Management

* Create day-wise itinerary
* Add activities
* Organize activities by date/time
* Update and remove itinerary items

## Budget & Expense Management

* Set trip budget
* Record expenses
* Categorize expenses
* Track spending
* Compare expenses against budget

## Collaboration

* Invite users to trips
* Manage group members
* Assign roles
* Collaborate on trip planning

## Destination

* Explore destinations
* View destination information
* Search destinations
* Destination-related recommendations

## Media / Documents

* Store trip-related media/documents
* Manage uploaded resources
* Connect media with trips

## Notifications

* Trip-related notifications
* Collaboration notifications
* System notifications

## Recommendations

* Destination/travel recommendations
* Personalized recommendations where applicable

---

# 5. System Architecture

The planned backend architecture contains multiple logical services/modules.

```text
                         React Web Client
                                │
                                ▼
                       API Gateway / Security
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
    User Service        Trip Management          Itinerary
          │                     │                     │
          │                     ▼                     │
          │                  Budget                   │
          │                     │                     │
          │                     ▼                     │
          │                  Expense                  │
          │
          ├──────────────► Collaboration
          │
          ├──────────────► Notification
          │
          ├──────────────► Destination
          │
          ├──────────────► Media
          │
          └──────────────► Recommendation

                       Common Utilities
```

External integrations may include:

```text
Email Service
Push Notification Service
Cloud Storage
Maps / Location Services
Payment Services
```

An optional mobile application may also consume the backend APIs.

---

# 6. Technology Stack

## Frontend

| Technology | Purpose                  |
| ---------- | ------------------------ |
| React.js   | User interface           |
| JavaScript | Frontend programming     |
| HTML/CSS   | UI structure and styling |
| REST APIs  | Backend communication    |

## Backend

| Technology      | Purpose                        |
| --------------- | ------------------------------ |
| Java 21         | Programming language           |
| Spring Boot     | Backend framework              |
| Spring Web MVC  | REST APIs                      |
| Spring Data JPA | Database access                |
| Hibernate       | ORM                            |
| Spring Security | Authentication & authorization |
| JWT             | Token-based authentication     |
| OAuth2          | External authentication        |
| Lombok          | Boilerplate reduction          |
| Maven           | Dependency/build management    |

## Database

| Technology    | Purpose                   |
| ------------- | ------------------------- |
| PostgreSQL    | Relational database       |
| JPA/Hibernate | Object-relational mapping |

## Development & Testing

| Tool                             | Purpose                   |
| -------------------------------- | ------------------------- |
| Git                              | Version control           |
| GitHub                           | Source-code repository    |
| IntelliJ IDEA / VS Code          | Development               |
| Postman                          | API testing               |
| MySQL Workbench / database tools | Database design/reference |

> PostgreSQL is the current target database for the backend.

---

# 7. Database

The current authentication schema contains:

```text
users
roles
user_roles
```

## users

Stores registered users.

```text
users
-------------------------
id
email
name
password
```

The password is stored as a BCrypt hash.

## roles

Stores application roles.

Current roles:

```text
TRAVELER
GROUP_ADMIN
ADMIN
```

## user_roles

Associates users with roles.

```text
user_roles
-------------------------
id
user_id
role_id
```

Relationship:

```text
User
 │
 │ 1 : N
 ▼
UserRole
 ▲
 │ N : 1
 │
Role
```

The database schema will expand as additional TripNest modules are implemented.

---

# 8. Milestone Plan

The project is divided into four major milestones.

```text
M1 → Foundation & Authentication
M2 → Core Trip Management
M3 → Itinerary, Budget & Expense
M4 → Collaboration, Notifications & Advanced Features
```

---

# 9. M1 — Foundation & Authentication

## Objective

Set up the project architecture, database foundation and authentication system.

### Backend

* Spring Boot project setup
* Maven configuration
* PostgreSQL connection
* JPA/Hibernate setup
* User entity
* Role entity
* UserRole entity
* Authentication DTOs
* Registration API
* Login API
* BCrypt password hashing
* JWT generation
* JWT validation
* Spring Security configuration
* Protected API testing

### Frontend

* React project setup
* Basic project structure
* Authentication UI foundation
* API communication foundation

### Database

Initial authentication schema:

```text
users
roles
user_roles
```

### Current Backend JWT Flow

```text
Register
   ↓
Validate Request
   ↓
BCrypt Password Hash
   ↓
PostgreSQL
   ↓
Login
   ↓
Password Verification
   ↓
JWT Generation
   ↓
Client receives JWT
   ↓
Bearer Token
   ↓
JWT Validation
   ↓
Protected API
```

### M1 Status

```text
Backend foundation        ✅
PostgreSQL connection     ✅
Authentication schema     ✅
Registration              ✅
BCrypt                    ✅
Login                     ✅
JWT generation            ✅
JWT validation            ✅
Protected API             ✅
```

Additional M1 authentication/authorization work may be handled as separate assigned tasks.

---

# 10. M2 — Core Trip Management

## Objective

Build the core functionality for creating and managing trips.

### Planned functionality

* Trip creation
* Trip update
* Trip deletion
* Trip retrieval
* Trip details
* Trip ownership
* Trip members
* Basic trip search/filtering
* Trip API integration with frontend

### Backend

Expected components:

```text
Trip Entity
Trip Repository
Trip Service
Trip Controller
Trip DTOs
```

### Frontend

Expected screens/components:

```text
Trip Dashboard
Create Trip
Edit Trip
Trip Details
My Trips
```

### Database

Additional trip-related tables/entities will be introduced.

Conceptually:

```text
User
  │
  └────── Trip
             │
             └────── Trip Members
```

---

# 11. M3 — Itinerary, Budget & Expense

## Objective

Add detailed trip planning and financial management.

### Itinerary

Users can:

* Create day-wise plans
* Add activities
* Set activity dates/times
* Update activities
* Remove activities

Conceptually:

```text
Trip
 │
 └── Itinerary
       │
       ├── Day 1
       │    ├── Activity
       │    └── Activity
       │
       ├── Day 2
       │    ├── Activity
       │    └── Activity
       │
       └── Day 3
```

### Budget

Users can:

* Define trip budget
* Allocate budget categories
* Track planned spending

### Expense

Users can:

* Add expenses
* Categorize expenses
* Record amount
* Track who paid
* View trip expenses
* Compare expenses with budget

Conceptually:

```text
Trip
 ├── Budget
 │
 └── Expenses
       ├── Food
       ├── Transport
       ├── Stay
       └── Activities
```

### Frontend

Expected screens:

```text
Itinerary
Budget
Expenses
Expense Summary
```

---

# 12. M4 — Collaboration & Advanced Features

## Objective

Complete major collaboration and supporting TripNest functionality.

### Collaboration

* Invite users
* Add/remove trip members
* Group management
* Member roles
* Shared trip planning

### Notifications

* Trip notifications
* Member invitations
* Collaboration updates
* Other system notifications

### Destination

* Destination information
* Search
* Destination details

### Media

* Trip media
* Documents
* Cloud-storage integration where required

### Recommendation

* Travel/destination recommendations
* Recommendation integration

### Dashboard

A centralized dashboard can provide:

```text
Upcoming Trips
Recent Expenses
Budget Status
Itinerary
Notifications
Recommendations
```

---

# 13. Authentication Architecture

The current backend uses JWT-based authentication.

```text
                 Login
                   │
                   ▼
            Authentication
                   │
                   ▼
              JwtService
                   │
                   ▼
             JWT Token
                   │
                   ▼
          Client / Frontend
                   │
                   │ Authorization:
                   │ Bearer <JWT>
                   ▼
           Spring Security
                   │
                   ▼
             JwtDecoder
                   │
                   ▼
             Protected API
```

JWT contains information such as:

```text
sub → user identity
iat → issued-at time
exp → expiration time
```

---

# 14. Security

Security-related technologies include:

* Spring Security
* BCrypt
* JWT
* OAuth2
* Role-based authorization
* Request validation
* Protected REST APIs

Sensitive configuration such as:

```text
Database password
JWT secret
OAuth2 client secret
API keys
```

must not be committed to the public repository.

Use environment variables or appropriate secret-management mechanisms.

---

# 15. API Design

The backend follows REST-style API design.

Examples:

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/trips
POST   /api/trips
GET    /api/trips/{id}
PUT    /api/trips/{id}
DELETE /api/trips/{id}
```

Additional endpoints will be introduced as the milestones progress.

---

# 16. Development Guidelines

Before modifying the project:

1. Pull the latest code from the repository.
2. Understand the existing module structure.
3. Check the relevant entity and database relationships.
4. Follow the existing naming conventions.
5. Keep controller, service, repository and DTO responsibilities separate.
6. Test APIs after making backend changes.
7. Avoid committing secrets.
8. Avoid unnecessary changes to another team member's module.
9. Update documentation when introducing major functionality.

---

# 17. Backend Layering

The backend follows a layered architecture.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
JPA / Hibernate
    ↓
PostgreSQL
```

### Controller

Handles HTTP requests and responses.

### Service

Contains business logic.

### Repository

Handles database operations.

### Entity

Represents database tables.

### DTO

Carries data between client and backend without exposing entities directly.

---

# 18. Testing

Postman is currently used for backend API testing.

Authentication testing includes:

```text
Registration
     ↓
Login
     ↓
JWT received
     ↓
Protected API without JWT
     ↓
401 Unauthorized

Protected API with valid JWT
     ↓
200 OK
```

Automated unit and integration tests will be expanded as development progresses.

---

# 19. Running the Backend

Navigate to the backend directory:

```powershell
cd code_Backend
```

Depending on the repository structure, navigate to the directory containing `pom.xml`.

Run:

```powershell
mvn spring-boot:run
```

The backend runs by default on:

```text
http://localhost:8080
```

---

# 20. Running the Frontend

Navigate to:

```text
code_Frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server using the project's configured command, commonly:

```powershell
npm run dev
```

The frontend communicates with the Spring Boot backend through REST APIs.

---

# 21. Git Workflow

The project uses Git for version control.

Recommended workflow:

```text
Pull latest code
      ↓
Create / switch to your branch
      ↓
Make changes
      ↓
Test
      ↓
git status
      ↓
git add
      ↓
git commit
      ↓
git push
      ↓
Create Pull Request
```

Avoid directly overwriting another developer's work.

Commit messages should describe the change clearly.

Examples:

```text
feat: add trip creation API
fix: validate expense amount
feat: add itinerary service
docs: update M3 documentation
```

---

# 22. Team Development

The project is divided into frontend and backend responsibilities.

### Backend

Responsible for:

* APIs
* Business logic
* Database
* Security
* Authentication
* Authorization
* Integration

### Frontend

Responsible for:

* React UI
* Forms
* Pages
* Client-side state
* API integration
* User experience

Both sides communicate through REST APIs.

```text
React Frontend
      │
      │ HTTP / JSON
      ▼
Spring Boot Backend
      │
      ▼
PostgreSQL
```

---

# 23. Documentation

Project documentation is maintained separately from implementation code.

Recommended documentation:

```text
README.md
    ↓
High-level project understanding

M1 implementation documentation
    ↓
Detailed M1 implementation notes

M2 documentation
    ↓
Detailed M2 implementation notes

M3 documentation
    ↓
Detailed M3 implementation notes

M4 documentation
    ↓
Detailed M4 implementation notes
```

The main README should remain relatively concise and should not contain every implementation step.

---

# 24. Current Project Status

| Area                  | Status         |
| --------------------- | -------------- |
| Project architecture  | ✅ Defined      |
| Backend foundation    | ✅ Started      |
| Frontend foundation   | 🔄 In progress |
| PostgreSQL            | ✅ Configured   |
| Authentication schema | ✅ Created      |
| Registration          | ✅ Implemented  |
| Login                 | ✅ Implemented  |
| BCrypt                | ✅ Implemented  |
| JWT generation        | ✅ Implemented  |
| JWT validation        | ✅ Implemented  |
| Protected API         | ✅ Tested       |
| Trip Management       | 🔄 M2          |
| Itinerary             | 🔄 M3          |
| Budget                | 🔄 M3          |
| Expense               | 🔄 M3          |
| Collaboration         | 🔄 M4          |
| Notifications         | 🔄 M4          |
| Destination           | 🔄 M4          |
| Media                 | 🔄 M4          |
| Recommendations       | 🔄 M4          |

---

# 25. Project Roadmap

```text
                    TRIPNEST
                       │
                       ▼
              ┌─────────────────┐
              │       M1        │
              │ Foundation      │
              │ Authentication  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │       M2        │
              │ Trip Management │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │       M3        │
              │ Itinerary       │
              │ Budget          │
              │ Expense         │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │       M4        │
              │ Collaboration   │
              │ Notifications   │
              │ Destination     │
              │ Media           │
              │ Recommendation  │
              └─────────────────┘
```

---

# 26. Quick Reference

### Backend

```text
Java 21
Spring Boot
Spring Security
Spring Data JPA
Hibernate
Maven
PostgreSQL
JWT
```

### Frontend

```text
React
JavaScript
HTML
CSS
REST API
```

### Development

```text
Git
GitHub
Postman
IntelliJ IDEA / VS Code
```

---

# 27. Project Goal

The ultimate goal of TripNest is to provide a single platform for:

```text
Discover
   ↓
Plan
   ↓
Organize
   ↓
Budget
   ↓
Collaborate
   ↓
Track
   ↓
Enjoy the Trip
```

**TripNest — Plan Better. Travel Smarter.**

-------------

