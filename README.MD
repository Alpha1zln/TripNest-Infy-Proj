# ✈️ TripNest — AI-Powered Travel Planning & Management Platform

TripNest is an **AI-powered full-stack travel planning and management platform** designed to streamline end-to-end trip planning through intelligent itinerary generation, destination discovery, budget and expense management, and collaborative group travel.

The platform follows a **decoupled architecture**, with a React.js frontend communicating with modular Spring Boot REST APIs backed by PostgreSQL.

---

## 🎯 Problem Statement

Travel planning often involves information scattered across multiple platforms for destinations, itineraries, budgets, bookings, and group expenses.

TripNest aims to bring these activities into a **single unified platform**, making travel planning more organized, collaborative, and intelligent.

---

## 💡 Key Features

* 🔐 Secure user authentication and authorization
* 🗺️ Destination discovery
* ✈️ Trip creation and management
* 📅 Day-wise itinerary planning
* 📍 Time-based activity scheduling
* 💰 Budget planning and expense tracking
* 👥 Group travel collaboration
* 🔔 Notifications and travel alerts
* 📊 Traveler and admin analytics
* 📄 Travel document and media management
* 🤖 AI-powered itinerary and travel assistance *(Future Scope)*

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │    React Frontend    │
                    │  React + Tailwind    │
                    └──────────┬───────────┘
                               │
                         REST APIs / JWT
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Spring Boot APIs   │
                    │  Spring Security 6   │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
           User/Auth      Trip/Itinerary   Budget/Expense
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                       ┌───────────────┐
                       │  PostgreSQL   │
                       └───────────────┘
```

The planned architecture can be extended with external services such as Google OAuth2, maps, cloud storage, notifications, AI services, Kafka, and Redis.

---

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript
* Vite
* Tailwind CSS
* REST API integration

### Backend

* Java 17
* Spring Boot 3
* Spring Security 6
* JWT Authentication
* OAuth2
* Spring Data JPA / Hibernate
* RESTful APIs
* Maven

### Database

* PostgreSQL

### Testing & DevOps

* JUnit 5
* Mockito
* Docker
* Git & GitHub

### Future Technologies

* Spring AI
* Google Gemini
* Apache Kafka
* Redis
* Microservices

---

# 📌 Milestones

The internship project is structured into **4 core milestones over 8 weeks**, with additional future enhancements planned as Milestones 5 and 6.

---

## Milestone 1 — Authentication, Database & Security

### Database

* Designed the relational database schema for TripNest.
* Configured PostgreSQL as the primary database.
* Implemented JPA entities and repository structure.

### Authentication & Security

* Implemented stateless JWT authentication.
* Implemented BCrypt password hashing.
* Configured Spring Security 6 security filter chain.
* Added authentication APIs for registration and login.
* Prepared Role-Based Access Control (RBAC).
* Integrated / prepared OAuth2 authentication.

### Frontend

* Created the React + Vite frontend foundation.
* Established the initial project structure.
* Prepared frontend-backend REST API integration.

**Status: 🚧 In Progress / Core Authentication Completed**

---

## Milestone 2 — Trip & Itinerary Management

* Trip creation and management.
* Day-wise itinerary planning.
* Activity scheduling and management.
* Destination discovery.
* Integration between Trip → Itinerary → Activity → Destination.

```text
Trip
 │
 ├── Itinerary Day 1
 │      ├── Activity
 │      └── Activity
 │
 ├── Itinerary Day 2
 │      ├── Activity
 │      └── Activity
 │
 └── Destination
```

**Status: 📋 Planned / Upcoming**

---

## Milestone 3 — Budget, Expenses & Collaboration

* Trip budget management.
* Expense recording and categorization.
* Budget threshold alerts.
* Group creation and member management.
* Group invitations and collaboration.
* Shared expense splitting and settlement.
* Notifications.
* Travel documents and media management.

**Status: 📋 Planned**

---

## Milestone 4 — Analytics, Testing & Deployment

* Traveler analytics and dashboard.
* Admin/platform analytics.
* Expense and budget visualization.
* Automated unit testing using JUnit 5 and Mockito.
* Integration/API testing.
* Performance optimization.
* Docker-based deployment.

**Status: 📋 Planned**

---

# 🚀 Adv Scope

## Milestone 5 — GenAI Travel Copilot

* Integrate **Spring AI + Google Gemini** for intelligent itinerary generation and a context-aware travel assistant.
* Explore multimodal receipt processing to extract expense information and simplify automated expense logging.

## Milestone 6 — Distributed & Event-Driven Architecture

* Introduce **Apache Kafka** for asynchronous event-driven communication and **Redis** for distributed caching.
* Progress toward microservices decomposition for scalability, fault isolation, and independent service deployment.


## Milestone 7 — TripNest AI Agent with Tool Calling
* Build a Spring AI agent that plans trips using secure backend tools.
* Connect destination search, budget calculation, and itinerary generation services.

---

# 📂 Project Structure

```text
TripNest/
│
├── code_Frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── code_Backend/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   ├── pom.xml
│   └── README.md
│
├── docs/
│   ├── architecture/
│   ├── database/
│   ├── api/
│   └── milestones/
│
├── README.md
└── .gitignore
```

---

# 🔄 Application Flow

### Registration

```text
React
  ↓
Register API
  ↓
Spring Security
  ↓
Auth Controller
  ↓
Auth Service
  ↓
BCrypt Password Hashing
  ↓
User Repository
  ↓
PostgreSQL
```

### Login & JWT Authentication

```text
React
  ↓
Login API
  ↓
AuthenticationManager
  ↓
UserDetailsService
  ↓
PostgreSQL
  ↓
BCrypt Verification
  ↓
JWT Service
  ↓
JWT Token
  ↓
React
```

For subsequent protected requests:

```text
React
  │
  │ Authorization: Bearer <JWT>
  ▼
Spring Security Filter Chain
  ↓
JWT Authentication
  ↓
SecurityContext
  ↓
Authorization / RBAC
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

---

# 🌿 Development Workflow

The project uses Git for version control and milestone-based development.

```text
main
 │
 ├── M1 development
 │
 ├── M2 development
 │
 ├── M3 development
 │
 └── M4 development
```

Feature and milestone branches are used for development before integration into the stable `main` branch.

---

# ▶️ Running the Project

## Backend

Prerequisites:

* JDK 17+
* Maven 3.8+
* PostgreSQL

```bash
cd code_Backend
mvn spring-boot:run
```

Backend runs on the configured Spring Boot port, typically:

```text
http://localhost:8080
```

## Frontend

Prerequisites:

* Node.js
* npm

```bash
cd code_Frontend
npm install
npm run dev
```

The Vite development server will provide the local frontend URL.

---

# 🧪 Testing

The project will include:

* Unit testing with **JUnit 5**
* Mock-based testing with **Mockito**
* Spring Security testing
* REST API testing
* Integration testing
* Frontend testing as required

---

# 👥 Project Development

TripNest is being developed as a collaborative internship project, with responsibilities divided across frontend and backend development and further divided by project milestones/modules.

The architecture and module boundaries are designed to allow different team members to work independently while integrating through well-defined REST APIs.

---

# 📈 Project Vision

TripNest aims to evolve from a conventional travel management application into an **intelligent, scalable travel platform** combining:

```text
Travel Planning
      +
Collaboration
      +
Financial Tracking
      +
Analytics
      +
Generative AI
      +
Event-Driven Architecture
```

The long-term goal is to provide travelers with a unified platform that not only helps them **plan and manage trips**, but also assists them intelligently throughout the travel-planning journey.
