# TripNest — Travel Planning & Trip Management Platform

> Infosys Springboard Internship 2026 — Team Project

TripNest is a full-stack travel planning platform that brings destination discovery, trip planning, day-wise itineraries, budgeting, expense tracking, group collaboration, and travel analytics into one experience.

**Plan better. Travel smarter.**

## The problem

Travel planning is usually distributed across maps, booking sites, spreadsheets, expense trackers, group chats, and document folders. This makes it difficult to keep plans aligned—especially when several people are travelling together.

TripNest provides one workspace where travelers can discover a destination, organize a trip, plan activities, manage shared costs, coordinate a group, and keep relevant travel information together.

## Core capabilities

- Secure account registration, login, JWT authentication, Google OAuth2, and role-based access control
- Trip creation, editing, deletion, listing, and trip details
- Day-wise itineraries with scheduled activities
- Destination pages with attractions, travel guides, and useful travel information
- Trip budgets, categorized expenses, spending reports, and shared-expense settlements
- Travel-group creation, invitations, roles, and collaborative planning
- Notifications plus ticket, booking, photo, and travel-document management
- Traveler and administrator dashboards with charts and reports

## Architecture

~~~text
                    React Frontend
                         │
                    HTTPS / REST
                         │
                         ▼
                 Spring Boot Backend
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
  Authentication      Trip Planning    Budget & Expense
        │                │                │
        ├──── Destination / Itinerary ────┤
        ├──── Groups / Notifications ─────┤
        └──── Media / Analytics ──────────┘
                         │
                         ▼
                    PostgreSQL
~~~

The backend follows a layered design:

~~~text
Controller → Service → Repository → JPA / Hibernate → PostgreSQL
~~~

## Technology stack

- **Backend:** Java 21, Spring Boot, Spring Web MVC, Spring Data JPA, Hibernate, Spring Security, Maven
- **Frontend:** React, React Router, Axios, Chart.js, React Testing Library
- **Database:** PostgreSQL
- **Security:** BCrypt, JWT, OAuth2, protected REST APIs, request validation
- **Testing and development:** JUnit 5, Mockito, Postman, Git, GitHub, IntelliJ IDEA or VS Code
- **Advanced stack:** Spring AI, Google Gemini or OpenAI, Redis, Kafka, Spring Cloud Gateway, Docker, Prometheus, Grafana, Zipkin, GitHub Actions

## Database domain

The initial identity domain includes:

~~~text
users
roles
user_roles
~~~

The broader TripNest domain grows to include trips, itineraries, activities, destinations, budgets, expenses, notifications, travel groups, group members, and uploaded media/documents.

~~~text
User → Trip → Itinerary → Activity → Destination
          │
          ├── Budget → Expenses
          └── Travel Group → Members / Shared Expenses
~~~

## API examples

~~~text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/trips
POST   /api/trips
GET    /api/trips/{id}
PUT    /api/trips/{id}
DELETE /api/trips/{id}
~~~

Additional endpoints are introduced as each milestone is implemented.

## Development roadmap

### Milestone 1 — Foundation, authentication, and user accounts

Build the project foundation and secure access flow.

- Design identity, trip, finance, and support database schemas with ER diagrams and SQL/DDL.
- Configure Spring Boot, Maven, PostgreSQL, JPA/Hibernate, and the project structure.
- Implement registration/login APIs, BCrypt hashing, JWT generation/validation, and Spring Security.
- Add Google OAuth2, User/Admin roles, protected APIs, and profile security.
- Build React routing, Axios configuration, registration/login flows, auth state, protected routes, and profile/account settings.

**Deliverable:** A user can register, authenticate, manage their account, and access only authorized functionality.

### Milestone 2 — Trip planning and itinerary management

Deliver the end-to-end trip-planning workflow.

- Build backend APIs for trips, trip details, editing/deletion, itineraries, activities, and destinations.
- Support activity types including sightseeing, transportation, accommodation, dining, adventure, and shopping.
- Validate ownership, relationships, error handling, and the full **Trip → Itinerary → Activity → Destination** flow.
- Build the trip creation/listing experience, trip details, day-wise itinerary planner, activity scheduler, destination pages, and trip dashboard.

**Deliverable:** Travelers can create, organize, update, and view complete trip plans.

### Milestone 3 — Budgets, expenses, groups, and travel documents

Add financial management and collaboration.

- Implement budgets, category allocations, cost estimates, expenses, and reporting APIs.
- Support Transportation, Hotel, Food, Shopping, Entertainment, and Miscellaneous expense categories.
- Build travel groups, invitations, roles, shared itineraries, discussions, shared expenses, contributions, and settlement data.
- Add notifications for reminders, budget alerts, invitations, and travel updates.
- Support uploading and managing tickets, hotel bookings, travel documents, and photos.
- Deliver the corresponding React interfaces for budgeting, expenses, reports, collaboration, shared expenses, notifications, and documents.

**Deliverable:** Groups can plan together, manage shared travel costs, and keep essential documents in one place.

### Milestone 4 — Analytics, quality, and production deployment

Prepare the full application for demonstration and production deployment.

- Build traveler analytics for upcoming trips, budgets, expenses, travel statistics, and favorite destinations.
- Build administrator analytics for users, trips, destinations, and platform metrics.
- Provide report and data-aggregation APIs for frontend charts.
- Test backend services/controllers with JUnit and Mockito; validate APIs and workflows with Postman.
- Test frontend workflows with React Testing Library.
- Improve security, optimize slow queries and API responses, and configure Docker, environment variables, logging, monitoring, and deployment.
- Complete final frontend-backend integration and production verification.

**Deliverable:** A tested, optimized, deployed TripNest application with traveler and admin dashboards.

## Advanced Scope of the Project

Milestones 5–7 extend the production-ready core with modern AI, event-driven, microservices, and cloud-native capabilities.

### Milestone 5 — Generative AI and Smart Travel Assistant

- POST /api/ai/generate-itinerary creates and stores a structured day-wise itinerary from a prompt such as “3-day budget trip to Manali with hiking.”
- POST /api/ai/chat provides a trip-aware travel assistant using the user’s selected trip and remaining budget.
- POST /api/ai/scan-receipt uses multimodal AI to extract amount, date, merchant, and category from receipt images.
- Generate personalized packing lists from destination, weather, duration, and planned activities.
- Add a “Generate with AI” planner, a Travel Copilot chat interface, and a receipt-scanner upload experience.

**Deliverable:** AI-assisted planning, travel guidance, packing recommendations, and faster expense entry.

### Milestone 6 — Distributed systems, Kafka, and microservices

- Produce and consume TripCreatedEvent for asynchronous itinerary pre-seeding and BudgetExceededEvent for real-time alerts.
- Add Redis cache-aside caching for popular destinations and JWT blacklist support on logout.
- Separate the platform into API Gateway, Trip Service, Expense & Budget Service, and Notification Service.
- Add composite database indexes, HikariCP tuning, and query analysis with EXPLAIN ANALYZE.
- Configure Prometheus, Grafana, Micrometer, and Zipkin for metrics, dashboards, and distributed tracing.
- Create multi-stage Docker images, Docker Compose infrastructure, and a GitHub Actions pipeline.

~~~text
React Frontend → Spring Cloud API Gateway
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
       Trip Service          Expense & Budget Service
            │                         │
            └────── Apache Kafka ────┘
                         │
                         ▼
             Notification Service
                         │
        Redis + PostgreSQL + Observability
~~~

**Deliverable:** A scalable, observable, event-driven architecture suitable for enterprise-style deployment.

### Milestone 7 — TripNest AI Agent with Tool Calling

The TripNest AI agent uses Spring AI function calling to work through backend services, not direct database access.

- Expose typed tools for destination search/details, budget calculation, and itinerary generation.
- Build an authenticated agent endpoint that receives natural-language requests, includes selected-trip context, invokes tools, and returns a clear travel plan.
- Enforce user ownership, validate tool parameters and budget constraints, and return useful errors.
- Add short-term conversational context, AI-provider timeouts/retries, and tool-call logging.
- Keep initial recommendations grounded in structured service data; introduce RAG later when richer destination retrieval is needed.

~~~text
                 TripNest AI Agent
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
Destination Tool      Budget Tool       Itinerary Tool
       │                  │                  │
       ▼                  ▼                  ▼
Destination Service   Expense Service    Itinerary Service
       │                  │                  │
       └──────────────────┴──────────────────┘
                          │
                     PostgreSQL
~~~

For a request such as “Plan a 3-day trip to Varanasi under ₹10,000,” the agent can search destination data, assess budget feasibility, generate an itinerary, and return a data-backed plan.

**Deliverable:** A secure AI agent that gives TripNest a strong modern Java, Spring Boot, and AI architecture foundation.

## Local development

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL
- Git
- Docker and Docker Compose when running the advanced infrastructure

### Backend

~~~powershell
cd code_Backend
mvn spring-boot:run
~~~

The Spring Boot service normally runs on http://localhost:8080. Ensure database and secret configuration are provided through local environment configuration before starting it.

### Frontend

~~~powershell
cd code_Frontend
npm install
npm run dev
~~~

Use the frontend project’s configured start command if it differs from npm run dev.

## Security and contribution guidance

- Do not commit database passwords, JWT secrets, OAuth client secrets, or AI-provider API keys.
- Keep controller, service, repository, entity, and DTO responsibilities separate.
- Pull the latest code before starting work and avoid unrelated changes in another contributor’s module.
- Test backend changes through appropriate API tests and validate frontend user flows.
- Use focused, descriptive commits, such as feat: add itinerary service or fix: validate expense amount.

## Project goal

~~~text
Discover → Plan → Organize → Budget → Collaborate → Track → Enjoy the trip
~~~

**TripNest — Plan Better. Travel Smarter.**
