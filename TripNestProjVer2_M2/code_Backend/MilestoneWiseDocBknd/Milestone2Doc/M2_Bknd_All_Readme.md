

# TripNest — M2 Backend Documentation

**Project:** TripNest — Travel Planning & Trip Management Platform
**Backend:** Spring Boot
**Database:** PostgreSQL
**Java:** 21
**Build Tool:** Maven
**Authentication:** JWT
**ORM:** Spring Data JPA / Hibernate

---

# M2 Backend

## M2 Overview

M2 focuses on the core travel-planning functionality of TripNest.

### Planned M2 Backend Parts

```text
P1 → Trip Management              ✅ Completed
P2 → Day-wise Itinerary
P3 → Activity Management
P4 → Destination Management
P5 → End-to-End Integration
P6 → Final validation/security cleanup
```

The M2 backend is designed around:

```text
User
 │
 └── Trip
      │
      ├── Destination
      │
      └── ItineraryDay
             │
             └── Activity
```

### M2 Scope

M2 includes:

* Trip creation
* Trip listing
* Trip details
* Trip update
* Trip deletion
* Trip ownership/authorization
* Day-wise itinerary
* Activity scheduling
* Destination APIs
* Validation
* JWT-protected APIs
* PostgreSQL persistence
* REST API integration
* Postman testing

### Explicitly NOT part of M2

The following are planned for M3:

* Budget Management
* Expense Management
* Expense Categories
* Expense Reports
* Group Collaboration
* Group Members
* Invitations
* Group Roles
* Group Discussions
* Shared Expenses
* Expense Settlement

Also:

> Activity → Expense relationship will NOT be implemented in M2.

The M2 Trip model should remain clean so that M3 features can be associated with Trip later.

---

# P1 — Trip Management

## P1.1 Objective

Implement the core `Trip` backend functionality.

A logged-in user should be able to:

```text
Create Trip
     ↓
View own Trips
     ↓
View Trip details
     ↓
Update own Trip
     ↓
Delete own Trip
```

Every Trip belongs to an authenticated user.

---

# P1.2 Trip Entity

### File

```text
src/main/java/com/tripnest/backend/entity/Trip.java
```

### Entity structure

```java
@Entity
@Table(name = "trips")
public class Trip
```

### Fields

| Field               | Type         | Purpose                |
| ------------------- | ------------ | ---------------------- |
| `id`                | `Long`       | Primary key            |
| `title`             | `String`     | Trip name              |
| `destination`       | `String`     | Trip destination       |
| `startDate`         | `LocalDate`  | Trip start date        |
| `endDate`           | `LocalDate`  | Trip end date          |
| `numberOfTravelers` | `Integer`    | Number of travelers    |
| `status`            | `TripStatus` | Current trip status    |
| `owner`             | `User`       | User who owns the Trip |

### Important mapping

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id", nullable = false)
private User owner;
```

This creates the relationship:

```text
User
  │
  │ 1
  │
  │ owns
  │
  │ *
  ▼
Trip
```

The database stores the relationship through:

```text
trips.user_id → users.id
```

The existing TripNest `User` entity uses `Long` as its ID, so Trip also uses `Long`.

---

# P1.3 Trip Status

### File

```text
src/main/java/com/tripnest/backend/entity/TripStatus.java
```

Current values:

```text
PLANNED
ONGOING
COMPLETED
CANCELLED
```

The enum is stored as a String in PostgreSQL:

```java
@Enumerated(EnumType.STRING)
```

This is preferable to storing numeric enum positions because changing enum order will not change existing database meanings.

---

# P1.4 Trip Repository

### File

```text
src/main/java/com/tripnest/backend/repository/TripRepository.java
```

```java
public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByOwnerId(Long ownerId);
}
```

### Automatically available JPA operations

Because the repository extends:

```java
JpaRepository<Trip, Long>
```

Spring Data JPA provides operations such as:

```text
save()
findById()
findAll()
deleteById()
existsById()
```

### Custom method

```java
findByOwnerId(Long ownerId)
```

This allows TripNest to retrieve only the Trips belonging to a particular user.

Conceptually:

```text
Logged-in User ID = 2
        ↓
findByOwnerId(2)
        ↓
Only user 2's Trips
```

This is important for multi-user authorization.

---

# P1.5 Trip Service

### File

```text
src/main/java/com/tripnest/backend/service/TripService.java
```

The Service layer sits between Controller and Repository.

Architecture:

```text
TripController
      ↓
TripService
      ↓
TripRepository
      ↓
JPA / Hibernate
      ↓
PostgreSQL
```

### Current responsibilities

#### Save Trip

```java
public Trip saveTrip(Trip trip)
```

Used for creating and saving a Trip.

#### Get all Trips

```java
public List<Trip> getAllTrips()
```

#### Get Trip by ID

```java
public Optional<Trip> getTripById(Long tripId)
```

`Optional` is used because the requested Trip may not exist.

#### Get Trips by owner

```java
public List<Trip> getTripsByOwner(Long ownerId)
```

#### Ownership check

```java
public boolean isTripOwnedByUser(Long tripId, Long ownerId)
```

This checks:

```text
Trip ID
   ↓
Find Trip
   ↓
Get Trip.owner.id
   ↓
Compare with authenticated user's ID
```

Example:

```text
Trip 2 → owner_id = 2

Logged-in user → ID 2

2 == 2
   ↓
true
   ↓
Allowed
```

Another user:

```text
Trip 2 → owner_id = 2

Logged-in user → ID 5

2 != 5
   ↓
false
   ↓
403 Forbidden
```

---

# P1.6 DTOs

DTOs are used so that REST requests/responses do not directly expose the JPA entity.

Structure:

```text
dto/
└── trip/
    ├── TripRequest.java
    └── TripResponse.java
```

---

## TripRequest

### File

```text
src/main/java/com/tripnest/backend/dto/trip/TripRequest.java
```

Used when the frontend sends Trip data to the backend.

Fields:

```text
title
destination
startDate
endDate
numberOfTravelers
status
```

Validation currently includes:

```text
@NotBlank
@NotNull
@FutureOrPresent
@Positive
```

Example request:

```json
{
    "title": "Manali Trip",
    "destination": "Manali",
    "startDate": "2026-09-20",
    "endDate": "2026-09-25",
    "numberOfTravelers": 2,
    "status": "PLANNED"
}
```

### Important security decision

`TripRequest` does **not** contain `ownerId`.

The frontend must not be allowed to decide who owns a Trip.

Instead:

```text
JWT
 ↓
Authenticated user's email
 ↓
UserRepository
 ↓
User
 ↓
Trip.owner
```

---

# TripResponse

### File

```text
src/main/java/com/tripnest/backend/dto/trip/TripResponse.java
```

Used when sending Trip information back to the frontend.

Fields:

```text
id
title
destination
startDate
endDate
numberOfTravelers
status
ownerId
```

The response contains `ownerId` rather than the complete `User` object.

This avoids unnecessarily exposing User information.

Example:

```json
{
    "id": 2,
    "title": "Agra Trip",
    "destination": "Taj Mahal",
    "startDate": "2026-10-20",
    "endDate": "2026-10-25",
    "numberOfTravelers": 4,
    "status": "PLANNED",
    "ownerId": 2
}
```

---

# P1.7 Trip Controller

### File

```text
src/main/java/com/tripnest/backend/controller/TripController.java
```

Base URL:

```text
/api/trips
```

The controller connects:

```text
HTTP Request
     ↓
TripController
     ↓
TripService
     ↓
TripRepository
```

---

# P1.8 Trip APIs

## 1. Create Trip

```text
POST /api/trips
```

Authentication:

```text
Bearer JWT required
```

Request body:

```json
{
    "title": "Manali Trip",
    "destination": "Manali",
    "startDate": "2026-09-20",
    "endDate": "2026-09-25",
    "numberOfTravelers": 2,
    "status": "PLANNED"
}
```

Expected:

```text
201 Created
```

The backend obtains the authenticated user's email from:

```java
authentication.getName()
```

Then:

```text
email
 ↓
UserRepository.findByEmail()
 ↓
User
 ↓
trip.setOwner(owner)
 ↓
save Trip
```

The client does not supply the owner.

---

# P1.9 Get My Trips

```text
GET /api/trips
```

Authentication:

```text
Bearer JWT required
```

The backend:

```text
JWT
 ↓
authenticated email
 ↓
User
 ↓
User ID
 ↓
findByOwnerId()
 ↓
User's Trips
```

### Tested result

Current PostgreSQL test data:

```text
Trip 1 → Manali Trip → user_id 2
Trip 2 → Agra Trip   → user_id 2
```

Postman returned both Trips with:

```text
ownerId = 2
```

This confirms the owner-based retrieval is working.

---

# P1.10 Get Trip by ID

```text
GET /api/trips/{tripId}
```

Example:

```text
GET /api/trips/2
```

The endpoint was tested successfully.

Example response:

```json
{
    "destination": "Taj Mahal",
    "endDate": "2026-10-25",
    "id": 2,
    "numberOfTravelers": 4,
    "ownerId": 2,
    "startDate": "2026-10-20",
    "status": "PLANNED",
    "title": "Agra Trip"
}
```

Ownership verification is performed before returning the Trip.

---

# P1.11 Update Trip

```text
PUT /api/trips/{tripId}
```

Example:

```text
PUT /api/trips/2
```

Example request:

```json
{
    "title": "Agra Heritage Trip",
    "destination": "Taj Mahal",
    "startDate": "2026-10-20",
    "endDate": "2026-10-25",
    "numberOfTravelers": 4,
    "status": "PLANNED"
}
```

Expected:

```text
200 OK
```

The existing Trip is loaded first and then its fields are updated.

The owner is not replaced from the request.

Ownership is checked before update.

### Tested

The update was successfully tested through Postman.

---

# P1.12 Delete Trip

```text
DELETE /api/trips/{tripId}
```

The controller checks Trip ownership before deletion.

Expected successful response:

```text
204 No Content
```

### Important

Deletion was protected in the controller, but the final 404/403 exception handling cleanup is still pending.

---

# P1.13 Authorization Design

TripNest uses JWT authentication from M1.

Authentication answers:

> Who is the user?

Authorization answers:

> Is this user allowed to access this Trip?

The M2 Trip design therefore follows:

```text
Authentication
      ↓
JWT
      ↓
Current User
      ↓
Trip.owner
      ↓
Ownership check
      ↓
Allow / Reject
```

Expected semantics:

```text
No valid JWT
    → 401 Unauthorized

Trip does not exist
    → 404 Not Found

Trip exists but belongs to another user
    → 403 Forbidden

Trip belongs to current user
    → Allow
```

The current implementation already performs ownership checks for the individual Trip operations. Proper custom exceptions/global exception handling will be cleaned up in the later M2 security/validation phase.

---

# P1.14 PostgreSQL Verification

Database:

```text
tripnest_db
```

The `trips` table was successfully created and populated.

Current verified data:

```text
id | destination | end_date   | number_of_travelers | start_date | status  | title        | user_id
---+-------------+------------+---------------------+------------+---------+--------------+--------
1  | Manali      | 2026-09-25 | 2                   | 2026-09-20 | PLANNED | Manali Trip  | 2
2  | Taj Mahal   | 2026-10-25 | 4                   | 2026-10-20 | PLANNED | Agra Trip    | 2
```

This confirmed that:

```text
Spring Boot
   ↓
JPA/Hibernate
   ↓
PostgreSQL
```

is working correctly for the Trip entity.

---

# P1.15 Testing Completed

### Backend

```text
Spring Boot starts                 ✅
PostgreSQL connection              ✅
JPA Trip mapping                   ✅
Hibernate table creation           ✅
```

### API

```text
POST /api/trips                    ✅
GET /api/trips                     ✅
GET /api/trips/{id}                ✅
PUT /api/trips/{id}                ✅
DELETE ownership logic             ✅
```

### Authentication / Authorization

```text
JWT authentication                 ✅
Authenticated user identification  ✅
Trip owner assignment              ✅
Owner-based Trip retrieval         ✅
Trip ownership check               ✅
GET ownership protection            ✅
PUT ownership protection            ✅
DELETE ownership protection         ✅
```

### Database

```text
Trip persistence                   ✅
user_id relationship               ✅
```

---

# P1.16 Current Backend Package Structure

After P1:

```text
backend/
└── src/main/java/com/tripnest/backend/
    │
    ├── config/
    │   ├── JwtConfig.java
    │   └── SecurityConfig.java
    │
    ├── controller/
    │   ├── AuthController.java
    │   ├── TestController.java
    │   └── TripController.java
    │
    ├── dto/
    │   ├── RegistrationRequest.java
    │   ├── LoginRequest.java
    │   └── trip/
    │       ├── TripRequest.java
    │       └── TripResponse.java
    │
    ├── entity/
    │   ├── User.java
    │   ├── Role.java
    │   ├── UserRole.java
    │   ├── Trip.java
    │   └── TripStatus.java
    │
    ├── repository/
    │   ├── UserRepository.java
    │   ├── RoleRepository.java
    │   ├── UserRoleRepository.java
    │   └── TripRepository.java
    │
    ├── service/
    │   ├── AuthService.java
    │   ├── JwtService.java
    │   └── TripService.java
    │
    └── exception/
```

---

# P1.17 Important Design Decisions

## Decision 1 — Budget excluded from M2 Trip

Budget functionality belongs to M3.

Therefore Trip does not currently contain detailed budget management fields.

Future:

```text
Trip
 ├── Budget
 │     └── Expenses
 │
 └── Group Collaboration
```

---

## Decision 2 — Ownership belongs to backend

Frontend does not send `ownerId`.

Backend determines ownership from JWT.

This prevents a client from attempting to assign a Trip to another user.

---

## Decision 3 — Day-wise itinerary model

Instead of:

```text
Trip → Itinerary → Activity
```

the preferred conceptual model is:

```text
Trip
 ↓
ItineraryDay
 ↓
Activity
```

because the mentor specifically described a day-wise planning experience.

API terminology can still use:

```text
/api/itineraries
```

while the entity remains:

```text
ItineraryDay
```

---

## Decision 4 — Child-resource authorization

Future resources should follow the parent ownership chain.

Example:

```text
User
 ↓
Trip
 ↓
ItineraryDay
 ↓
Activity
```

Before modifying an Activity, backend should ultimately verify that:

```text
Activity
   ↓
ItineraryDay
   ↓
Trip
   ↓
Current User
```

owns the resource.

This prevents users from accessing another user's child resources by guessing IDs.

---

# P1.18 Current Status

```text
M2 Backend — P1 Trip Management

Trip Entity              ✅
Trip Status              ✅
Trip Repository          ✅
Trip Service             ✅
Trip Request DTO         ✅
Trip Response DTO        ✅
Trip Controller          ✅

Create Trip              ✅
List My Trips            ✅
Get Trip                 ✅
Update Trip              ✅
Delete protection        ✅

JWT integration          ✅
Ownership check          ✅
PostgreSQL persistence   ✅
Postman testing          ✅

Final exception cleanup  ⏳
```

**P1 Trip Management is functionally complete.**

---

# P2 — Itinerary

> To be added later.

Planned conceptual model:

```text
Trip
 │
 ├── Day 1
 │    ├── Activity
 │    ├── Activity
 │    └── Activity
 │
 ├── Day 2
 │    ├── Activity
 │    └── Activity
 │
 └── Day 3
      └── Activity
```

Planned entity:

```text
ItineraryDay
```

Planned APIs will be documented after implementation.

---

# P3 — Activity

> To be added later.

Planned activity types:

```text
Sightseeing
Transportation
Accommodation
Dining
Adventure
Shopping
```

Activity → Expense relationship is intentionally excluded from M2.

---

# P4 — Destination

> To be added later.

Initial functionality:

```text
GET /api/destinations
GET /api/destinations/{id}
```

Future filtering can include:

```text
Country
City
Destination type

Examples:
- Beach
- Hill Station
- Temple
- Historical
- Adventure
```

This filtering is a future enhancement and should not unnecessarily delay the core M2 implementation.

---

# P5 — End-to-End Integration

> To be added later.

Target flow:

```text
Login
  ↓
JWT
  ↓
Create Trip
  ↓
Select/View Trip
  ↓
Create Itinerary Days
  ↓
Add Activities
  ↓
View complete Trip workspace
  ↓
Destination integration
```

---

# Future M3 Integration

M3 will build on the Trip foundation created in M2.

Expected future structure:

```text
Trip
 │
 ├── Destination
 │
 ├── ItineraryDay
 │      └── Activity
 │
 ├── Budget
 │      └── Expense
 │
 └── Group Collaboration
        ├── Members
        ├── Invitations
        ├── Shared Itinerary
        ├── Discussions
        └── Shared Expenses
```

M3 should attach these capabilities to the existing Trip rather than redesigning Trip.

---

# Documentation Rule

This file is the **living M2 Backend README**.

New implementation work should be appended as:

```text
P1 → Trip
P2 → Itinerary
P3 → Activity
P4 → Destination
P5 → Integration
P6 → Cleanup
```

For each part, document:

1. What was implemented
2. Why it was implemented
3. Files/classes created
4. Important code/design decisions
5. Entity relationships
6. API endpoints
7. Validation
8. Authorization
9. PostgreSQL changes
10. Postman testing
11. Errors encountered
12. Fixes
13. Important concepts learned
14. Final status

This document should remain usable as the source of truth for continuing M2 in a future ChatGPT conversation.

---------------------
#### TILL M2 = P1 TRIP API IN BKND CMPLTD
------------------------

*********************************


----------------------------------------------------------
## M2 = P2 ITINERARY APIs STARTS HERE  
----------------------------------------------------------

# M2P2 — Itinerary Backend README

## 1. Overview

**Project:** TripNest — Travel Planning & Trip Management Platform  
**Milestone:** M2  
**Part:** P2 — Itinerary Management  
**Backend:** Spring Boot + Java + Spring Data JPA + PostgreSQL  
**Authentication:** JWT-based authentication

### Purpose

P2 extends the P1 Trip Management module by adding a day-wise itinerary for each trip.

The resulting relationship is:

```text
User
  │
  └── Trip
        │
        └── Itinerary
              │
              ├── Day 1
              ├── Day 2
              └── Day 3 ...
```

P3 Activity will later extend this structure:

```text
Trip
  └── Itinerary
        └── ItineraryDay
              └── Activity
```

---

# 2. P2 Goals

The P2 backend implementation provides:

- Create one itinerary for a trip
- Get the itinerary of a trip
- Add itinerary days
- Get all itinerary days in day-number order
- Update an itinerary day
- Delete an itinerary day
- JWT authentication on all itinerary APIs
- Trip ownership authorization
- Protection against accessing a day through the wrong trip
- Validation of itinerary day date/day-number against trip dates

---

# 3. Design Decisions

## 3.1 One Trip → One Itinerary

Each Trip has one main Itinerary.

```text
Trip 1 ───── 1 Itinerary
```

The `itineraries.trip_id` column is therefore unique.

## 3.2 One Itinerary → Many Days

An itinerary contains multiple itinerary days.

```text
Itinerary
   │
   ├── Day 1
   ├── Day 2
   ├── Day 3
   └── ...
```

Therefore:

```text
Itinerary 1 ───── N ItineraryDay
```

## 3.3 Do not expose JPA entities directly

DTOs are used between the controller and client.

This keeps API responses separate from the internal JPA entity structure.

## 3.4 Authorization through the parent Trip

Before accessing or modifying an itinerary/day:

```text
JWT
 ↓
Authenticated User
 ↓
Trip
 ↓
Check Trip.owner.id == authenticated user.id
 ↓
Allow / Reject
```

This prevents one user from accessing another user's trip data by changing an ID in the URL.

## 3.5 No direct modification of Trip.java for P2

The existing P1 `Trip.java` was kept stable.

The P2 `Itinerary` entity owns the relationship using:

```java
@OneToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "trip_id", nullable = false, unique = true)
private Trip trip;
```

---

# 4. Entity Layer

## 4.1 Itinerary.java

Location:

```text
src/main/java/com/tripnest/backend/entity/Itinerary.java
```

```java
package com.tripnest.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "itineraries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Itinerary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false, unique = true)
    private Trip trip;
}
```

### Important concepts

- `@Entity` — makes the class a JPA entity.
- `@Table(name = "itineraries")` — maps it to the `itineraries` table.
- `@OneToOne` — one Trip has one main Itinerary.
- `fetch = FetchType.LAZY` — Trip is not unnecessarily loaded with every itinerary query.
- `unique = true` — prevents multiple itineraries for the same trip.

---

## 4.2 ItineraryDay.java

Location:

```text
src/main/java/com/tripnest/backend/entity/ItineraryDay.java
```

```java
package com.tripnest.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "itinerary_days")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItineraryDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itinerary itinerary;

    @Column(nullable = false)
    private Integer dayNumber;

    @Column(nullable = false)
    private LocalDate date;

    private String title;

    private String description;
}
```

### Fields

| Field | Purpose |
|---|---|
| `id` | Unique day ID |
| `itinerary` | Parent itinerary |
| `dayNumber` | Day 1, Day 2, Day 3... |
| `date` | Actual calendar date |
| `title` | Day heading |
| `description` | Additional information |

### Why both `dayNumber` and `date`?

They represent different concepts.

```text
dayNumber = 2
date      = 2026-10-11
```

`dayNumber` represents the position within the trip.

`date` represents the actual calendar date.

---

# 5. Repository Layer

## 5.1 ItineraryRepository.java

Location:

```text
src/main/java/com/tripnest/backend/repository/ItineraryRepository.java
```

```java
package com.tripnest.backend.repository;

import com.tripnest.backend.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {

    Optional<Itinerary> findByTripId(Long tripId);
}
```

### Purpose

Allows us to find the itinerary belonging to a specific trip.

Example:

```text
findByTripId(1)
```

means:

> Find the itinerary whose associated Trip has ID 1.

---

## 5.2 ItineraryDayRepository.java

Location:

```text
src/main/java/com/tripnest/backend/repository/ItineraryDayRepository.java
```

```java
package com.tripnest.backend.repository;

import com.tripnest.backend.entity.ItineraryDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItineraryDayRepository extends JpaRepository<ItineraryDay, Long> {

    List<ItineraryDay> findByItineraryIdOrderByDayNumberAsc(Long itineraryId);
}
```

### Purpose

Returns all days for an itinerary in:

```text
Day 1 → Day 2 → Day 3 → ...
```

order.

This avoids relying on database insertion order.

---

# 6. DTO Layer

Package:

```text
com.tripnest.backend.dto.itinerary
```

## 6.1 ItineraryResponse.java

```java
package com.tripnest.backend.dto.itinerary;

import lombok.Data;

@Data
public class ItineraryResponse {

    private Long id;

    private Long tripId;
}
```

Example response:

```json
{
    "id": 1,
    "tripId": 1
}
```

---

## 6.2 ItineraryDayRequest.java

```java
package com.tripnest.backend.dto.itinerary;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ItineraryDayRequest {

    @NotNull(message = "Day number is required")
    @Positive(message = "Day number must be greater than zero")
    private Integer dayNumber;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotBlank(message = "Day title is required")
    private String title;

    private String description;
}
```

### Validation

- `@NotNull` — value must be supplied.
- `@Positive` — day number must be greater than zero.
- `@NotBlank` — title cannot be empty/blank.

---

## 6.3 ItineraryDayResponse.java

```java
package com.tripnest.backend.dto.itinerary;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ItineraryDayResponse {

    private Long id;

    private Long itineraryId;

    private Integer dayNumber;

    private LocalDate date;

    private String title;

    private String description;
}
```

---

# 7. Service Layer

Location:

```text
src/main/java/com/tripnest/backend/service/ItineraryService.java
```

The service layer contains:

- Itinerary creation
- Itinerary retrieval
- Day creation
- Day retrieval
- Day update
- Day deletion
- Ownership checking
- Day/date business validation
- Entity → DTO conversion

Core authorization helper:

```java
private Trip getOwnedTrip(Long tripId, Long userId) {

    Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

    if (!trip.getOwner().getId().equals(userId)) {
        throw new AccessDeniedException(
                "You are not authorized to access this trip"
        );
    }

    return trip;
}
```

### Why this check is important

A user must not be able to access another user's itinerary simply by changing:

```text
/api/trips/1/...
```

to:

```text
/api/trips/2/...
```

The authenticated user's ID is compared with the Trip owner's ID.

---

# 8. Itinerary Creation

The service first checks that the user owns the Trip.

It then checks:

```java
itineraryRepository.findByTripId(tripId)
```

If an itinerary already exists, another one is not created.

Otherwise:

```java
Itinerary itinerary = Itinerary.builder()
        .trip(trip)
        .build();
```

The itinerary is saved and returned as an `ItineraryResponse`.

This enforces the intended:

```text
One Trip → One Itinerary
```

relationship.

---

# 9. Itinerary Day Operations

## Add Day

A day is created against an existing itinerary.

Flow:

```text
Trip ID
 ↓
Ownership check
 ↓
Find Itinerary
 ↓
Validate day
 ↓
Create ItineraryDay
 ↓
Save
 ↓
Return DTO
```

## Get Days

The service finds the trip's itinerary and then calls:

```java
findByItineraryIdOrderByDayNumberAsc(...)
```

Therefore the API returns days in ascending day-number order.

## Update Day

The service:

1. Checks Trip ownership.
2. Finds the itinerary.
3. Finds the requested day.
4. Checks that the day belongs to that itinerary.
5. Updates the day.
6. Saves it.
7. Returns the updated DTO.

## Delete Day

The service performs the same ownership and parent-child checks before deleting the day.

---

# 10. Cross-Trip Day Protection

An important security/business check was added.

Suppose:

```text
Trip 1
 └── Itinerary 1
      └── Day 1

Trip 2
 └── Itinerary 2
      └── Day 5
```

A request such as:

```text
DELETE /api/trips/1/itinerary/days/5
```

must not delete Day 5 because Day 5 belongs to Trip 2.

The service checks:

```java
if (!day.getItinerary().getId().equals(itinerary.getId())) {
    throw new RuntimeException(
            "Itinerary day does not belong to this trip"
    );
}
```

This is an important parent-child authorization check.

---

# 11. Date and Day-Number Business Validation

P2 also includes validation against the parent Trip dates.

If a Trip is:

```text
startDate = 2026-10-10
endDate   = 2026-10-12
```

then:

```text
Day 1 → 2026-10-10  ✅
Day 2 → 2026-10-11  ✅
Day 3 → 2026-10-12  ✅
Day 4 → invalid      ❌
```

The validation also ensures that:

```text
dayNumber = 2
date      = 2026-10-11
```

match each other.

The service uses:

```java
ChronoUnit.DAYS.between(startDate, endDate) + 1
```

to calculate the inclusive trip duration.

This validation is applied when adding and updating itinerary days.

---

# 12. Controller Layer

Location:

```text
src/main/java/com/tripnest/backend/controller/ItineraryController.java
```

Base URL:

```text
/api/trips/{tripId}/itinerary
```

The controller obtains the authenticated user from Spring Security:

```java
String email = authentication.getName();
```

Then it retrieves the corresponding User and passes the user ID to the service.

---

# 13. REST API List

## 13.1 Create Itinerary

```http
POST /api/trips/{tripId}/itinerary
```

No request body.

Expected:

```text
201 Created
```

Example:

```json
{
    "id": 1,
    "tripId": 1
}
```

---

## 13.2 Get Itinerary

```http
GET /api/trips/{tripId}/itinerary
```

Expected:

```text
200 OK
```

Example:

```json
{
    "id": 1,
    "tripId": 1
}
```

---

## 13.3 Add Itinerary Day

```http
POST /api/trips/{tripId}/itinerary/days
```

Example request:

```json
{
    "dayNumber": 1,
    "date": "2026-10-10",
    "title": "Arrival in Goa",
    "description": "Check-in and relax at the beach"
}
```

Expected:

```text
201 Created
```

---

## 13.4 Get All Days

```http
GET /api/trips/{tripId}/itinerary/days
```

Expected:

```text
200 OK
```

Days are returned in ascending `dayNumber`.

---

## 13.5 Update Day

```http
PUT /api/trips/{tripId}/itinerary/days/{dayId}
```

Example:

```json
{
    "dayNumber": 1,
    "date": "2026-10-10",
    "title": "Arrival + Baga Beach",
    "description": "Check-in, lunch and evening at Baga Beach"
}
```

Expected:

```text
200 OK
```

---

## 13.6 Delete Day

```http
DELETE /api/trips/{tripId}/itinerary/days/{dayId}
```

Expected:

```text
204 No Content
```

---

# 14. Postman Testing

## Create Itinerary

```http
POST http://localhost:8080/api/trips/1/itinerary
```

Authorization:

```text
Bearer <JWT_TOKEN>
```

Result:

```json
{
    "id": 1,
    "tripId": 1
}
```

## Get Itinerary

```http
GET http://localhost:8080/api/trips/1/itinerary
```

Result:

```json
{
    "id": 1,
    "tripId": 1
}
```

## Add Day 1

```http
POST http://localhost:8080/api/trips/1/itinerary/days
```

Result:

```json
{
    "date": "2026-10-10",
    "dayNumber": 1,
    "description": "Check-in and relax at the beach",
    "id": 1,
    "itineraryId": 1,
    "title": "Arrival in Goa"
}
```

## Add Day 2

Result:

```json
{
    "date": "2026-10-11",
    "dayNumber": 2,
    "description": "Visit Fort Aguada and Baga Beach",
    "id": 2,
    "itineraryId": 1,
    "title": "North Goa Exploration"
}
```

## Get All Days

The API returned days in ascending order:

```json
[
    {
        "date": "2026-10-10",
        "dayNumber": 1,
        "id": 1,
        "itineraryId": 1,
        "title": "Arrival in Goa"
    },
    {
        "date": "2026-10-11",
        "dayNumber": 2,
        "id": 2,
        "itineraryId": 1,
        "title": "North Goa Exploration"
    }
]
```

## Update Day

A day was successfully updated using:

```http
PUT /api/trips/1/itinerary/days/2
```

Example updated values:

```text
dayNumber = 4
date = 2026-10-14
title = Arrival + coca Beach
```

The API returned:

```text
200 OK
```

and the PostgreSQL data reflected the update.

## Delete Day

A Day belonging to Trip 2 was deleted:

```http
DELETE /api/trips/2/itinerary/days/5
```

Result:

```text
204 No Content
```

PostgreSQL verification:

```sql
SELECT *
FROM itinerary_days
WHERE id = 5;
```

returned:

```text
(0 rows)
```

The total number of rows decreased from 6 to 5, confirming successful deletion.

---

# 15. PostgreSQL Verification

The following query was used to verify the complete relationship:

```sql
SELECT
    i.id AS itinerary_id,
    i.trip_id,
    d.id AS day_id,
    d.day_number,
    d.date,
    d.title,
    d.description
FROM itineraries i
JOIN itinerary_days d
    ON i.id = d.itinerary_id
ORDER BY i.trip_id, d.day_number;
```

This verified:

```text
Trip
 ↓
Itinerary
 ↓
ItineraryDay
```

and confirmed that Trip 1 and Trip 2 had separate itinerary/day records.

---

# 16. Error Encountered During Testing

## Problem

Testing:

```text
GET /api/trips/2/itinerary
```

initially returned:

```text
500 Internal Server Error
```

The stack trace showed:

```text
RuntimeException: Itinerary not found
```

### Cause

The requested Trip did not have an itinerary, so:

```java
itineraryRepository.findByTripId(tripId)
```

returned an empty Optional.

The code currently uses:

```java
.orElseThrow(() -> new RuntimeException("Itinerary not found"));
```

Without a global exception handler, Spring returned HTTP 500.

### Authorization improvement

For ownership failure, the generic runtime exception was changed to Spring Security's:

```java
AccessDeniedException
```

so an authorization failure can correctly represent a 403 Forbidden condition.

### Future cleanup

The project should later introduce a global exception-handling layer:

```text
ResourceNotFoundException → 404
AccessDeniedException      → 403
Validation errors           → 400
Authentication failure     → 401
```

This cleanup is intentionally deferred so development can continue.

---

# 17. Final P2 Status

**M2 P2 — Itinerary: COMPLETED**

```text
Entity                         ✅
Repository                     ✅
DTOs                           ✅
Service                        ✅
Controller                     ✅
Create itinerary               ✅
Get itinerary                  ✅
Add day                        ✅
Get days                       ✅
Update day                     ✅
Delete day                     ✅
JWT protection                 ✅
Trip ownership check           ✅
Cross-trip day protection      ✅
Date/day-number validation     ✅
Postman testing                ✅
PostgreSQL verification        ✅
```

---

# 18. P2 → P3 Handoff

P2 provides the parent structure required for Activity:

```text
Trip
  ↓
Itinerary
  ↓
ItineraryDay
  ↓
Activity   ← P3
```

P3 Activity can therefore focus on CRUD for activities attached to an `ItineraryDay`.

Planned Activity fields:

```text
id
itineraryDay
title
description
startTime
endTime
location
category
bookingInfo
```

### Deliberately excluded from Activity

`cost` is not being added to Activity.

Reason:

TripNest already has separate Budget/Expense functionality planned. Keeping:

```text
Activity → what the traveler does
Expense  → money actually spent
```

avoids mixing activity planning with financial tracking.

Booking integration is also not being implemented. `bookingInfo` is only optional reference text, if used.

---

# 19. P2 Learning Summary

Important Spring/JPA concepts practiced in P2:

- `@OneToOne`
- `@ManyToOne`
- `@JoinColumn`
- `FetchType.LAZY`
- Unique foreign-key relationship
- Spring Data derived query methods
- DTO pattern
- Bean Validation
- REST controller design
- JWT-based authentication
- Parent-child authorization
- Service-layer business logic
- PostgreSQL relationship verification
- Inclusive date-range validation
- CRUD API design
- HTTP status codes
- Exception handling considerations

P2 establishes the day-wise itinerary foundation for the next module: **M2 P3 — Activity Management**.





------------------------

----------------------------------------------------------
## M2 = P3 ACTIVITY APIs STARTS HERE  
----------------------------------------------------------

# M2 P3 — Activity Backend README







----------------------------------------------------------

**********************************************

----------------------------------------------------------
## M2 = P4 Destination  APIs STARTS HERE  
----------------------------------------------------------


# M2 P4 — Destination  Backend README







----------------------------------------------------------
