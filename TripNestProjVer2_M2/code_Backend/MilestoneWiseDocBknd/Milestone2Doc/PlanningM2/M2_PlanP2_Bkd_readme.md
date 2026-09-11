
----------------------------------------------------

# TripNest — Milestone 2 Backend Plan vr 2

## Overview

Milestone 2 focuses on implementing the **core Trip Management and Travel Planning backend functionality** of the TripNest platform.

The Spring Boot backend will provide REST APIs for managing:

* Trips
* Destinations
* Day-wise itineraries
* Activities

The major objective of M2 is to establish the core travel-planning workflow:

```text
User
 │
 ▼
Trip
 │
 ├──────────────► Destination
 │
 ▼
Itinerary Day
 │
 ▼
Activity
```

The `Trip` entity will act as the central object for the M2 travel-planning modules and will provide the foundation for future M3 functionality such as Budget, Expense Management and Group Collaboration.

This document represents the **initial M2 backend plan**. It will be updated at the end of Milestone 2 with the actual implementation, database changes, API details, validation, authorization, errors/fixes, testing results, design decisions and important revision concepts.

---

# M2 Scope

Milestone 2 will focus on:

```text
Trip Management
      │
      ├── Destination
      │
      └── Day-wise Itinerary
              │
              └── Activities
```

### M2 includes

* Trip creation and management
* Trip details, update and deletion
* Destination listing and details
* Day-wise itinerary planning
* Activity scheduling and management
* Entity relationships
* Validation
* Authorization
* Exception/error handling
* JWT-protected APIs
* Postman testing
* Complete backend workflow

### M2 does NOT include

The following functionality belongs to M3 and will not be implemented in M2:

* Budget Management
* Expense Management
* Expense Categories and Reports
* Group Collaboration
* Group Invitations
* Group Roles
* Group Discussions
* Shared Expenses
* Expense Settlement

The M2 design will, however, ensure that these future modules can be associated with the `Trip` entity without major redesign.

---

# M2 Objectives

The main objectives of Milestone 2 backend development are:

* Implement Trip management
* Implement Trip details, edit and delete functionality
* Implement Destination management
* Implement day-wise Itinerary management
* Implement Activity management
* Establish relationships between User, Trip, Itinerary Day and Activity
* Establish appropriate Trip-Destination relationships
* Implement validation
* Implement authorization
* Implement appropriate exception/error handling
* Integrate all M2 backend modules
* Test the complete workflow using Postman

---

# Technology Stack

* Java
* Spring Boot
* Spring Web / REST
* Spring Data JPA
* Hibernate
* Jakarta Validation
* Spring Security
* JWT Authentication
* PostgreSQL
* Maven
* Lombok
* Postman

M1 authentication and authorization infrastructure will be reused for M2 protected APIs.

---

# M2 Backend Tasks

## 1. Trip Management APIs

### Objective

Implement the core Trip management functionality.

The `Trip` entity will act as the central parent entity for the M2 travel-planning modules.

### Planned Work

Create:

* Trip entity
* Trip repository
* Trip service
* Trip controller
* DTOs where required

Trip information may include:

* Trip ID
* Trip name/title
* Destination
* Start date
* End date
* Number of travelers
* Trip status
* User/owner relationship

### Important Design Decision

Budget will **not** be implemented as part of the M2 Trip management functionality.

Although a trip may eventually have a budget, **Budget Management belongs to M3**.

Therefore, the M2 Trip entity should not contain detailed budget-management functionality.

M3 can later associate:

```text
Trip
 │
 └── Budget
      │
      └── Expenses
```

### Planned APIs

```text
POST   /api/trips
GET    /api/trips
GET    /api/trips/{id}
PUT    /api/trips/{id}
DELETE /api/trips/{id}
```

### Expected Deliverable

**Trip creation, listing, details, update and deletion APIs working with validation and authorization.**

---

# 2. Trip Ownership, Edit, Delete & Authorization

### Objective

Allow authenticated users to manage trips they are authorized to access.

### Planned Work

* Associate Trip with its owner/user
* Implement complete Trip details retrieval
* Implement Trip update
* Implement Trip deletion
* Add request validation
* Verify authenticated user ownership where applicable
* Handle invalid/non-existing Trip IDs
* Handle unauthorized operations
* Return appropriate HTTP status codes

### Example Authorization Logic

Conceptually:

```text
Authenticated User
       │
       ▼
Request Trip
       │
       ▼
Does Trip belong to this user?
       │
    ┌──┴──┐
   YES    NO
    │      │
    ▼      ▼
 Allow   403 FORBIDDEN
```

Authorization will be enforced by the backend and will not depend only on frontend route protection.

### Expected Deliverable

**Secure Trip management APIs with appropriate ownership and authorization checks.**

---

# 3. Destination Management APIs

### Objective

Provide destination information that can be used during trip planning.

### Planned Work

Create:

* Destination entity
* Destination repository
* Destination service
* Destination controller
* DTOs where required

Destination information may include:

* Destination ID
* Destination name
* City/location
* Country
* Description
* Attractions
* Travel guides
* Relevant travel information

### Planned APIs

```text
GET /api/destinations
GET /api/destinations/{id}
```

Additional APIs may be introduced if required by the final implementation.

### Future Enhancement

Destination search and filtering may be added later, for example:

```text
Country-wise search

India
 ├── Manali
 ├── Goa
 └── Jaipur
```

and destination-type filtering:

```text
Beach
Hill Station
Temple
Adventure
Historical
...
```

These are considered future enhancements unless required within the final M2 scope.

### Expected Deliverable

**Destination listing and destination details APIs working.**

---

# 4. Day-wise Itinerary Management APIs

### Objective

Allow users to create and manage a **day-wise travel itinerary** associated with a Trip.

The itinerary design will reflect the actual TripNest travel-planning workflow discussed during mentor guidance.

For example:

```text
Trip: Manali
20 Sept – 23 Sept

Day 1 — 20 Sept
    │
    ├── Breakfast       10:00 – 12:00
    ├── Hill Station    14:00 – 17:00
    └── Dinner          20:00 – 21:00

Day 2 — 21 Sept
    │
    ├── ...
    └── ...

Day 3 — 22 Sept
    │
    └── ...
```

### Planned Work

Create the appropriate itinerary/day model, repository, service, controller and DTOs.

An itinerary day may contain:

* Trip relationship
* Day number
* Date
* Title/description
* Notes
* Ordering where required

### Important Design Consideration

The exact JPA model will be finalized during implementation.

The preferred conceptual model is:

```text
Trip
 │
 ▼
ItineraryDay
 │
 ▼
Activity
```

The application may use the term **Itinerary** for the overall feature while representing individual travel days as `ItineraryDay` records internally.

### Planned APIs

```text
POST   /api/itineraries
GET    /api/itineraries/{id}
GET    /api/trips/{tripId}/itineraries
PUT    /api/itineraries/{id}
DELETE /api/itineraries/{id}
```

### Expected Deliverable

**Day-wise itinerary CRUD APIs working and correctly linked to Trips.**

---

# 5. Activity Management APIs

### Objective

Allow users to schedule activities within individual itinerary days.

### Planned Work

Create:

* Activity entity
* Activity repository
* Activity service
* Activity controller
* DTOs where required

Activities may support types such as:

* Sightseeing
* Transportation
* Accommodation
* Dining
* Adventure
* Shopping

Activity information may include:

* Activity ID
* Activity name
* Activity type
* Date
* Start time
* End time
* Place/location
* Description
* Itinerary Day relationship

### Example

```text
Day 1 — 20 Sept

10:00 – 12:00
Breakfast
ABC Cafe

14:00 – 17:00
Visit Solang Valley
Solang Valley

20:00 – 21:00
Dinner
Famous Restaurant
```

### Planned APIs

```text
POST   /api/activities
GET    /api/activities/{id}
GET    /api/itineraries/{itineraryId}/activities
PUT    /api/activities/{id}
DELETE /api/activities/{id}
```

### Important Design Decision

Activities will **not** be directly connected to Expense in M2.

Expense management belongs to M3.

Therefore, M2 will not create an:

```text
Activity → Expense
```

relationship.

This relationship can be reconsidered later based on the actual M3 requirements.

### Expected Deliverable

**Activity CRUD APIs working and correctly linked to Itinerary Days.**

---

# 6. Entity Relationships

A major objective of M2 is establishing clean relationships between the core travel-planning entities.

The primary conceptual relationship is:

```text
User
 │
 │ owns
 ▼
Trip
 │
 │ contains
 ▼
ItineraryDay
 │
 │ contains
 ▼
Activity
```

Destination information will be associated with the Trip and/or Activity design as finalized during implementation.

A possible conceptual structure is:

```text
                 ┌──────────────┐
                 │     User     │
                 └──────┬───────┘
                        │
                      owns
                        │
                        ▼
                 ┌──────────────┐
                 │     Trip     │
                 └──────┬───────┘
                        │
                 ┌──────┴─────────┐
                 │                │
                 ▼                ▼
          ┌──────────────┐  ┌──────────────┐
          │ Destination │  │ ItineraryDay │
          └──────────────┘  └──────┬───────┘
                                   │
                                   ▼
                            ┌──────────────┐
                            │   Activity   │
                            └──────────────┘
```

The exact JPA relationship mappings will be finalized during implementation.

---

# 7. Future M3 Relationship

M2 should provide the foundation for M3 without implementing M3 functionality prematurely.

The future architecture is expected to extend the Trip:

```text
Trip
 │
 ├── Destination              ← M2
 │
 ├── ItineraryDay             ← M2
 │    └── Activity             ← M2
 │
 ├── Budget                   ← M3
 │    └── Expense             ← M3
 │
 └── Group Collaboration      ← M3
      ├── Members
      ├── Invitations
      ├── Roles
      ├── Shared Itinerary
      ├── Discussions
      └── Shared Expenses
```

M2 will therefore focus on establishing a stable `Trip` foundation that can be extended by M3.

Budget, Expense and Group Collaboration entities will **not** be created during M2 unless the project requirements are changed.

---

# Backend Layer Architecture

M2 will continue using the layered Spring Boot architecture established during M1.

```text
Client / Postman
       │
       ▼
Controller
       │
       ▼
Service
       │
       ▼
Repository
       │
       ▼
JPA / Hibernate
       │
       ▼
PostgreSQL
```

DTOs will be used where appropriate to separate API request/response models from persistence entities.

---

# Planned Package Structure

The backend structure will be expanded according to M2 modules.

```text
src/main/java/com/tripnest/backend/

├── controller/
│   ├── TripController
│   ├── ItineraryController
│   ├── ActivityController
│   └── DestinationController
│
├── service/
│   ├── TripService
│   ├── ItineraryService
│   ├── ActivityService
│   └── DestinationService
│
├── repository/
│   ├── TripRepository
│   ├── ItineraryRepository
│   ├── ActivityRepository
│   └── DestinationRepository
│
├── entity/
│   ├── Trip
│   ├── ItineraryDay
│   ├── Activity
│   └── Destination
│
├── dto/
│   ├── Trip DTOs
│   ├── Itinerary DTOs
│   ├── Activity DTOs
│   └── Destination DTOs
│
├── exception/
│
├── security/
│
└── ...
```

The final package and class names may be adjusted during implementation according to the final domain model.

---

# Validation

M2 APIs will include validation for incoming request data.

Potential validation areas include:

* Required fields
* Valid dates
* Valid date ranges
* Positive traveler count
* Valid activity times
* Valid activity types
* Required relationships
* Valid entity IDs
* Appropriate text lengths
* Valid status values

Jakarta Bean Validation annotations such as:

```java
@NotBlank
@NotNull
@Positive
@PositiveOrZero
@Size
```

may be used where appropriate.

Cross-field validation, such as ensuring:

```text
startDate <= endDate
```

may be implemented where required.

---

# Authorization

M1 JWT authentication and role-based authorization will continue to protect appropriate M2 APIs.

For user-owned resources, the backend should verify that the authenticated user has permission to perform operations such as:

```text
View Trip
Edit Trip
Delete Trip
Create Itinerary
Update Itinerary
Delete Itinerary
Manage Activities
```

Child resources should also be checked through their parent relationships where required.

For example:

```text
User
 │
 └── Trip
      │
      └── ItineraryDay
           │
           └── Activity
```

A user should not be able to modify an activity simply by knowing its ID if that activity belongs to another user's trip.

Authorization should therefore be enforced on the **backend**, rather than relying only on frontend route protection.

---

# Exception Handling

M2 will implement appropriate error handling for scenarios such as:

* Trip not found
* Itinerary day not found
* Activity not found
* Destination not found
* Invalid request
* Invalid date range
* Invalid relationship
* Unauthorized access
* Forbidden resource access
* Duplicate/conflicting data where applicable

Appropriate HTTP responses will be returned, for example:

```text
200 OK
201 CREATED
400 BAD REQUEST
401 UNAUTHORIZED
403 FORBIDDEN
404 NOT FOUND
500 INTERNAL SERVER ERROR
```

The exact exception-handling implementation will be documented after development.

---

# API Workflow

The expected backend workflow is:

```text
Create Trip
    │
    ▼
Retrieve Trip
    │
    ▼
Create Itinerary Day
    │
    ▼
Retrieve Itinerary
    │
    ▼
Create Activities
    │
    ▼
Retrieve / Update / Delete Activities
    │
    ▼
Retrieve Destination Information
```

The relationships between these resources should remain consistent throughout the workflow.

---

# Backend Integration Testing

The complete M2 backend workflow will be tested using **Postman**.

Testing will cover:

### Trip

```text
Create
List
Get Details
Update
Delete
```

### Itinerary

```text
Create Day
List Days
Get Day
Update Day
Delete Day
```

### Activity

```text
Create
List
Get
Update
Delete
```

### Destination

```text
List
Get Details
```

### Security

```text
Valid JWT
Missing JWT
Invalid JWT
Unauthorized resource access
Forbidden resource access
```

---

# Planned End-to-End Test

The complete workflow should be tested approximately as:

```text
Login
  │
  ▼
Receive JWT
  │
  ▼
Create Trip
  │
  ▼
Get Trip
  │
  ▼
Create Itinerary Day for Trip
  │
  ▼
Create Activity for Itinerary Day
  │
  ▼
Retrieve Trip / Itinerary / Activities
  │
  ▼
Update Trip / Itinerary Day / Activity
  │
  ▼
Delete Activity
  │
  ▼
Delete Itinerary Day
  │
  ▼
Delete Trip
```

Destination APIs will be tested independently and integrated into the trip-planning workflow as appropriate.

---

# Expected M2 Backend Outcome

At the completion of Milestone 2, the backend should provide a functional travel-planning API workflow.

The backend should support:

* Trip creation
* Trip listing
* Trip details
* Trip update
* Trip deletion
* Trip ownership
* Destination listing
* Destination details
* Day-wise itinerary CRUD
* Activity CRUD
* Entity relationships
* Validation
* Authorization
* Error handling
* JWT-protected APIs
* Complete Postman-tested workflow

The backend should provide a stable foundation for future Budget, Expense and Group Collaboration functionality in M3.

---

# Documentation Update at M2 Completion

This initial plan will be updated after implementation.

The final M2 backend README will additionally document:

* Actual database/schema changes
* Final entities
* Entity relationships
* JPA mappings
* Repository implementation
* Service-layer logic
* Controller/API implementation
* DTOs
* Validation rules
* Authorization implementation
* Exception handling
* Complete API endpoint list
* Request/response examples
* Postman testing
* Important Spring Boot/JPA concepts
* Problems/errors encountered
* Fixes and debugging steps
* Design decisions
* Final backend workflow
* Mentor/interview questions
* Important revision concepts
* M2 completion status

---

# Status

**Milestone 2 — Backend Development: Planned**

M2 backend development will begin with **Trip Management** and progressively implement:

```text
Trip
  ↓
Destination
  ↓
Itinerary Day
  ↓
Activity
```

The implementation will be performed incrementally, with each module being developed, tested and documented before moving to the next module.

This document serves as the **initial M2 backend plan** and will be converted into the final M2 revision/documentation README after milestone completion.



-----------------------------------------------------
-----------------------------------------------------



# TripNest — Milestone 2 Backend Plan vr 1

## Overview

Milestone 2 focuses on implementing the **core Trip Management and Travel Planning backend functionality** of the TripNest platform.

The Spring Boot backend will provide REST APIs for managing trips, itineraries, activities, and destinations.

The major objective of M2 is to establish the backend workflow:

```text
Trip
 │
 ▼
Itinerary
 │
 ▼
Activity
 │
 ▼
Destination
```

This document represents the **initial M2 backend plan**. It will be updated at the end of Milestone 2 with the actual implementation, database changes, API details, validation, authorization, errors/fixes, testing results, and important revision concepts.

---

# M2 Objectives

The main objectives of Milestone 2 backend development are:

* Implement Trip management
* Implement Trip details, edit and delete functionality
* Implement Itinerary management
* Implement Activity management
* Implement Destination management
* Establish relationships between Trip, Itinerary, Activity and Destination
* Implement validation
* Implement authorization
* Implement appropriate exception/error handling
* Integrate all M2 backend modules
* Test the complete workflow using Postman

---

# Technology Stack

* Java
* Spring Boot
* Spring Web / REST
* Spring Data JPA
* Hibernate
* Jakarta Validation
* Spring Security
* JWT Authentication
* PostgreSQL
* Maven
* Lombok
* Postman

M1 authentication and authorization infrastructure will be reused for M2 protected APIs.

---

# M2 Backend Tasks

## 1. Trip Management APIs

### Objective

Implement the core Trip management functionality.

### Planned Work

Create:

* Trip entity
* Trip repository
* Trip service
* Trip controller
* DTOs where required

Trip information will include appropriate fields such as:

* Trip name/title
* Destination
* Start date
* End date
* Number of travelers
* Budget
* Status
* User/owner relationship

### Planned APIs

Examples:

```text
POST   /api/trips
GET    /api/trips
GET    /api/trips/{id}
```

### Expected Deliverable

**Trip creation and retrieval APIs working.**

---

# 2. Trip Edit, Delete & Details APIs

### Objective

Allow authorized users to manage their trips after creation.

### Planned Work

* Implement complete Trip details retrieval
* Implement Trip update
* Implement Trip deletion
* Add request validation
* Add authorization checks
* Handle invalid/non-existing Trip IDs
* Handle unauthorized operations
* Return appropriate HTTP status codes

### Planned APIs

```text
GET    /api/trips/{id}
PUT    /api/trips/{id}
DELETE /api/trips/{id}
```

### Expected Deliverable

**Trip edit, delete and details APIs working with validation and authorization.**

---

# 3. Itinerary Management APIs

### Objective

Allow users to create and manage day-wise itineraries associated with Trips.

### Planned Work

Create:

* Itinerary entity
* Itinerary repository
* Itinerary service
* Itinerary controller
* DTOs where required

An itinerary will be associated with a Trip.

Potential information:

* Trip
* Day/date
* Title/description
* Notes
* Ordering where required

### Planned APIs

```text
POST   /api/itineraries
GET    /api/itineraries/{id}
GET    /api/trips/{tripId}/itineraries
PUT    /api/itineraries/{id}
DELETE /api/itineraries/{id}
```

### Expected Deliverable

**Itinerary CRUD APIs working and linked to Trips.**

---

# 4. Activity Management APIs

### Objective

Allow users to schedule activities within an itinerary.

### Planned Work

Create:

* Activity entity
* Activity repository
* Activity service
* Activity controller
* DTOs where required

Activities should support types such as:

* Sightseeing
* Transportation
* Accommodation
* Dining
* Adventure
* Shopping

Activity information may include:

* Activity name
* Activity type
* Date
* Time
* Place/location
* Description
* Itinerary relationship

### Planned APIs

```text
POST   /api/activities
GET    /api/activities/{id}
GET    /api/itineraries/{itineraryId}/activities
PUT    /api/activities/{id}
DELETE /api/activities/{id}
```

### Expected Deliverable

**Activity CRUD APIs working and linked to Itineraries.**

---

# 5. Destination Management APIs

### Objective

Provide destination information that can be used during trip planning.

### Planned Work

Create:

* Destination entity
* Destination repository
* Destination service
* Destination controller
* DTOs where required

Destination functionality may include:

* Destination name
* Location/country
* Description
* Attractions
* Travel guides
* Relevant travel information

### Planned APIs

```text
GET /api/destinations
GET /api/destinations/{id}
```

Additional APIs may be introduced if required by the final implementation.

### Expected Deliverable

**Destination listing and destination details APIs working.**

---

# 6. Entity Relationships

A major objective of M2 is establishing the relationships between the core travel-planning entities.

The planned conceptual relationship is:

```text
User
 │
 │ owns
 ▼
Trip
 │
 │ contains
 ▼
Itinerary
 │
 │ contains
 ▼
Activity
```

Destination information will be associated with the Trip and/or Activity design as finalized during implementation.

Conceptually:

```text
                 ┌──────────────┐
                 │     User     │
                 └──────┬───────┘
                        │
                      owns
                        │
                        ▼
                 ┌──────────────┐
                 │     Trip     │
                 └──────┬───────┘
                        │
                    contains
                        │
                        ▼
                 ┌──────────────┐
                 │  Itinerary   │
                 └──────┬───────┘
                        │
                    contains
                        │
                        ▼
                 ┌──────────────┐
                 │   Activity   │
                 └──────────────┘

                 ┌──────────────┐
                 │ Destination  │
                 └──────────────┘
```

The exact JPA relationship mappings will be finalized during implementation.

---

# Backend Layer Architecture

M2 will continue using the layered Spring Boot architecture established during M1.

```text
Client / Postman
       │
       ▼
Controller
       │
       ▼
Service
       │
       ▼
Repository
       │
       ▼
JPA / Hibernate
       │
       ▼
PostgreSQL
```

DTOs will be used where appropriate to separate API request/response models from persistence entities.

---

# Planned Package Structure

The backend structure will be expanded according to M2 modules.

```text
src/main/java/com/tripnest/backend/

├── controller/
│   ├── TripController
│   ├── ItineraryController
│   ├── ActivityController
│   └── DestinationController
│
├── service/
│   ├── TripService
│   ├── ItineraryService
│   ├── ActivityService
│   └── DestinationService
│
├── repository/
│   ├── TripRepository
│   ├── ItineraryRepository
│   ├── ActivityRepository
│   └── DestinationRepository
│
├── entity/
│   ├── Trip
│   ├── Itinerary
│   ├── Activity
│   └── Destination
│
├── dto/
│   ├── Trip DTOs
│   ├── Itinerary DTOs
│   ├── Activity DTOs
│   └── Destination DTOs
│
├── exception/
│
├── security/
│
└── ...
```

The final package structure may differ depending on implementation decisions.

---

# Validation

M2 APIs will include validation for incoming request data.

Potential validation areas include:

* Required fields
* Valid dates
* Valid date ranges
* Positive traveler count
* Valid budget values
* Valid activity types
* Required relationships
* Valid entity IDs

Jakarta Bean Validation annotations such as:

```java
@NotBlank
@NotNull
@Positive
@PositiveOrZero
@Size
```

may be used where appropriate.

---

# Authorization

M1 JWT authentication and role-based authorization will continue to protect appropriate M2 APIs.

For user-owned resources, the backend should verify that the authenticated user has permission to perform operations such as:

```text
View Trip
Edit Trip
Delete Trip
Create Itinerary
Update Itinerary
Delete Itinerary
Manage Activities
```

Authorization should be enforced on the **backend**, rather than relying only on frontend route protection.

---

# Exception Handling

M2 will implement appropriate error handling for scenarios such as:

* Trip not found
* Itinerary not found
* Activity not found
* Destination not found
* Invalid request
* Invalid relationship
* Unauthorized access
* Duplicate/conflicting data where applicable

Appropriate HTTP responses will be returned, for example:

```text
200 OK
201 CREATED
400 BAD REQUEST
401 UNAUTHORIZED
403 FORBIDDEN
404 NOT FOUND
500 INTERNAL SERVER ERROR
```

The exact exception-handling implementation will be documented after development.

---

# API Workflow

The expected backend workflow is:

```text
Create Trip
    │
    ▼
Retrieve Trip
    │
    ▼
Create Itinerary
    │
    ▼
Retrieve Itinerary
    │
    ▼
Create Activities
    │
    ▼
Retrieve / Update / Delete Activities
    │
    ▼
Retrieve Destination Information
```

The relationships between these resources should remain consistent throughout the workflow.

---

# Backend Integration Testing

The complete M2 backend workflow will be tested using **Postman**.

Testing will cover:

### Trip

```text
Create
List
Get Details
Update
Delete
```

### Itinerary

```text
Create
List
Get
Update
Delete
```

### Activity

```text
Create
List
Get
Update
Delete
```

### Destination

```text
List
Get Details
```

### Security

```text
Valid JWT
Missing JWT
Invalid JWT
Unauthorized resource access
```

---

# Planned End-to-End Test

The complete workflow should be tested approximately as:

```text
Login
  │
  ▼
Receive JWT
  │
  ▼
Create Trip
  │
  ▼
Get Trip
  │
  ▼
Create Itinerary for Trip
  │
  ▼
Create Activity for Itinerary
  │
  ▼
Retrieve Complete Trip Information
  │
  ▼
Update Trip / Itinerary / Activity
  │
  ▼
Delete Activity
  │
  ▼
Delete Itinerary
  │
  ▼
Delete Trip
```

---

# Expected M2 Backend Outcome

At the completion of Milestone 2, the backend should provide a functional travel-planning API workflow.

The backend should support:

* Trip creation
* Trip listing
* Trip details
* Trip update
* Trip deletion
* Itinerary CRUD
* Activity CRUD
* Destination retrieval
* Entity relationships
* Validation
* Authorization
* Error handling
* JWT-protected APIs
* Complete Postman-tested workflow

---

# Documentation Update at M2 Completion

This initial plan will be updated after implementation.

The final M2 backend README will additionally document:

* Actual database/schema changes
* Final entities
* Entity relationships
* JPA mappings
* Repository implementation
* Service-layer logic
* Controller/API implementation
* DTOs
* Validation rules
* Authorization implementation
* Exception handling
* Complete API endpoint list
* Request/response examples
* Postman testing
* Important Spring Boot/JPA concepts
* Problems/errors encountered
* Fixes and debugging steps
* Design decisions
* Final backend workflow
* Mentor/interview questions
* M2 completion status

---

# Status

**Milestone 2 — Backend Development: Planned**

M2 backend development will begin with Trip Management and progressively implement Itinerary, Activity, Destination, and complete Trip-planning integration.

This document serves as the **initial M2 backend plan** and will be converted into the final M2 backend revision/documentation README after milestone completion.
