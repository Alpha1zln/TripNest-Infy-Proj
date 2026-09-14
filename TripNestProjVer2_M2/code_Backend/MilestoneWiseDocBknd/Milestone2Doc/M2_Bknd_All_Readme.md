

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


# TripNest — M2 P3 Activity Backend README

**Project:** TripNest — Travel Planning & Trip Management Platform  
**Module:** M2 — Core Trip Planning  
**Part:** P3 — Activity  
**Status:** COMPLETE  
**Technology:** Spring Boot 4.1.1, Java 21, PostgreSQL 17.11, Maven  
**Backend folder:** `code_Backend`

---

## 1. Purpose of P3

M2 P3 adds **Activity management** to the TripNest itinerary.

An Activity represents an individual thing a traveler plans to do during a particular itinerary day.

Examples:

- Visit Eiffel Tower
- Hotel check-in
- City tour
- Beach visit
- Dinner reservation
- Museum visit
- Shopping

The most important design decision is:

> **Activity belongs to an `ItineraryDay`, not directly to a `Trip`.**

The hierarchy is:

```text
Trip
 └── Itinerary
      └── ItineraryDay
           ├── Activity
           ├── Activity
           └── Activity
```

This keeps the travel plan naturally organized day by day.

---

# 2. P3 Scope

The Activity module provides the basic CRUD lifecycle:

- Create Activity
- Get Activities
- Get one Activity
- Update Activity
- Delete Activity

An Activity contains:

| Field | Purpose |
|---|---|
| `id` | Unique activity identifier |
| `title` | Activity name/title |
| `description` | Additional information |
| `category` | Simple UI/category metadata |
| `startTime` | Planned start time |
| `endTime` | Planned end time |
| `location` | Activity location |
| `bookingDetails` | Free-text booking/reservation information |
| `checklist` | Simple multiline checklist |
| `itineraryDay` | Parent itinerary day |

---

# 3. Why Activity is linked to ItineraryDay

A Trip contains multiple itinerary days, and every day can contain multiple activities.

Example:

```text
Paris Trip

Day 1
 ├── Airport pickup
 ├── Hotel check-in
 └── Eiffel Tower visit

Day 2
 ├── Louvre Museum
 ├── Lunch
 └── Seine cruise
```

If Activity were connected directly to Trip, we would lose the information about **which day** the activity belongs to.

Therefore:

```text
Trip
  ↓
ItineraryDay
  ↓
Activity
```

This also makes the frontend easier to build because activities can be rendered directly under each day.

---

# 4. Activity Entity

Conceptually the entity contains:

```text
Activity
---------
id
title
description
category
startTime
endTime
location
bookingDetails
checklist
itineraryDay
```

The important relationship is:

```text
Activity ---> ItineraryDay
```

Multiple activities can belong to one itinerary day.

Therefore, from the Activity side:

```java
@ManyToOne
private ItineraryDay itineraryDay;
```

---

# 5. Field Design Decisions

## 5.1 `title`

The main human-readable name of the activity.

Examples:

```text
Visit Eiffel Tower
Dinner at Restaurant
Airport Pickup
```

---

## 5.2 `description`

Additional information about the activity.

Example:

```text
Visit the Eiffel Tower and explore the surrounding area.
```

The distinction is:

```text
title       → What is the activity?
description → What should the traveler know about it?
```

---

## 5.3 `category`

`category` is currently **simple UI metadata**.

Possible values:

```text
Sightseeing
Food
Transport
Shopping
Entertainment
Hotel
Other
```

No separate Category database table is required for P3.

This avoids unnecessary complexity while still allowing the frontend to categorize activities.

Future versions can introduce:

- category enums
- predefined categories
- category filtering
- category-specific icons
- database-backed categories

---

## 5.4 `startTime` and `endTime`

These represent the planned activity timing.

Example:

```text
startTime = 10:00
endTime   = 12:00
```

This enables a daily schedule such as:

```text
10:00 ───────── 12:00
       Museum Visit
```

Different activities on the same day can have different timings.

---

## 5.5 `location`

Stores where the activity happens.

Examples:

```text
Eiffel Tower
Louvre Museum
Hotel ABC
Delhi Airport
```

At P3 this remains simple text.

Future enhancements can include:

- coordinates
- Google Maps integration
- map URLs
- place IDs
- route planning

---

## 5.6 `bookingDetails`

This is intentionally **free text** in P3.

Example:

```text
Booking ID: ABC123
Confirmed for 2 people
Check-in at 6:30 PM
```

We do not create a separate Booking entity yet.

Reason:

> P3 focuses on itinerary activity management, not a complete booking system.

---

## 5.7 `checklist`

Currently implemented as simple multiline text.

Example:

```text
Carry passport
Carry tickets
Reach venue 15 minutes early
Carry water
```

A future version could introduce:

```text
Activity
  |
  +-- ChecklistItem
  +-- ChecklistItem
  +-- ChecklistItem
```

For P3, simple text keeps the implementation small and understandable.

---

# 6. Relationship with ItineraryDay

The Activity entity references its parent `ItineraryDay`.

Conceptually:

```java
@ManyToOne
private ItineraryDay itineraryDay;
```

Therefore:

```text
Activity A ──┐
Activity B ──┼──> ItineraryDay
Activity C ──┘
```

One itinerary day can contain many activities.

---

# 7. Backend Layer Structure

P3 follows the existing TripNest layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

For Activity:

```text
ActivityController
       ↓
ActivityService
       ↓
ActivityRepository
       ↓
PostgreSQL
```

This separation keeps responsibilities clear.

---

# 8. Repository Layer

`ActivityRepository` handles database persistence.

Conceptually:

```text
ActivityRepository
       |
       +-- save()
       +-- findById()
       +-- findAll()
       +-- delete()
```

Spring Data JPA provides the standard CRUD functionality.

The repository should remain focused on persistence.

Business rules belong in the service layer.

---

# 9. Service Layer

The Activity service contains application/business logic.

Typical responsibilities:

1. Find the parent `ItineraryDay`
2. Verify that the day exists
3. Create the Activity
4. Associate Activity with the day
5. Save the Activity
6. Retrieve Activity data
7. Update Activity data
8. Delete Activity data
9. Apply validation and authorization/ownership rules

The controller should not contain all of this logic.

---

# 10. Controller Layer

The Activity controller exposes REST APIs.

Its responsibility is mainly:

```text
HTTP request
     ↓
Controller
     ↓
Service
     ↓
HTTP response
```

The controller should delegate business logic to the service rather than directly performing database operations.

---

# 11. API Design

Activity resources are logically nested under an itinerary day.

Conceptual resource:

```text
/api/itinerary-days/{itineraryDayId}/activities
```

Typical operations:

| HTTP Method | Operation |
|---|---|
| `POST` | Create Activity |
| `GET` | Get Activities |
| `GET /{activityId}` | Get one Activity |
| `PUT /{activityId}` | Update Activity |
| `DELETE /{activityId}` | Delete Activity |

**Note:** The exact endpoint paths should always be taken from the implemented `ActivityController` if they differ from this conceptual structure.

---

# 12. Create Activity Flow

```text
Frontend
   |
   | POST activity data
   v
ActivityController
   |
   v
ActivityService
   |
   | Find ItineraryDay
   v
ItineraryDayRepository
   |
   v
Create Activity
   |
   | Attach ItineraryDay
   v
ActivityRepository
   |
   v
PostgreSQL
```

The important rule is:

> An Activity should not be created against a non-existent ItineraryDay.

---

# 13. Update Activity Flow

```text
Request
  ↓
ActivityController
  ↓
ActivityService
  ↓
Find existing Activity
  ↓
Validate / authorize
  ↓
Update fields
  ↓
Save
  ↓
Response
```

The service should first verify that the Activity exists.

A missing Activity should result in a not-found response rather than silently creating a new record.

---

# 14. Delete Activity Flow

```text
DELETE request
      ↓
ActivityController
      ↓
ActivityService
      ↓
Find / validate Activity
      ↓
Delete Activity
      ↓
Success response
```

Deletion is handled through the service/repository layer.

---

# 15. Validation

P3 validation remains practical and focused.

Important considerations:

- Activity must belong to an existing `ItineraryDay`
- Required Activity information should not be accepted as invalid empty data
- Time values should use the correct format
- Update should target an existing Activity

A future business rule could validate:

```text
endTime > startTime
```

More advanced date/time validation can be added later without changing the basic P3 architecture.

---

# 16. Authentication and Authorization

TripNest already uses JWT-based authentication with Spring Security.

Therefore:

```text
Client
  ↓
JWT
  ↓
Spring Security
  ↓
Protected Activity API
```

Two concepts must be distinguished:

### Authentication

> Who is making the request?

JWT helps answer this.

### Authorization

> Is this user allowed to modify this Activity?

The ownership chain can ultimately be checked through:

```text
User
 ↓
Trip
 ↓
Itinerary
 ↓
ItineraryDay
 ↓
Activity
```

This is important because simply having a valid JWT should not automatically mean a user can modify another user's travel data.

---

# 17. Error Handling

Important error cases include:

## ItineraryDay not found

The requested parent day does not exist.

Expected behavior:

```text
404 Not Found
```

## Activity not found

The requested Activity does not exist.

Expected behavior:

```text
404 Not Found
```

## Invalid request

Invalid input should produce an appropriate client-error response instead of a database failure.

The exact response structure should remain consistent with the existing TripNest backend error-handling conventions.

---

# 18. Database Model

Conceptually, PostgreSQL contains an Activity table similar to:

```text
activity
------------------------------------------------
id
title
description
category
start_time
end_time
location
booking_details
checklist
itinerary_day_id
```

The important foreign key is:

```text
activity.itinerary_day_id
             |
             v
       itinerary_day.id
```

This represents the parent-child relationship at database level.

---

# 19. M2 Hierarchy After P3

After P1, P2 and P3:

```text
User
 |
 +---- Trip
        |
        +---- Itinerary
               |
               +---- ItineraryDay
                       |
                       +---- Activity
                       +---- Activity
                       +---- Activity
```

Example:

```text
Paris Trip
│
├── Day 1
│   ├── Airport Pickup
│   ├── Hotel Check-in
│   └── Eiffel Tower
│
├── Day 2
│   ├── Louvre Museum
│   ├── Lunch
│   └── Seine Cruise
│
└── Day 3
    ├── Shopping
    └── Airport Transfer
```

This gives TripNest a practical day-wise travel planning structure.

---

# 20. Testing Checklist

## Create

Test:

```text
POST Activity
```

Verify:

- Valid JWT is accepted
- Valid ItineraryDay is accepted
- Activity is created
- Activity is associated with the correct day
- Database record is created

## Read all

Test:

```text
GET Activities for an ItineraryDay
```

Verify:

- Correct activities are returned
- Returned activities belong to the requested day

## Read one

Test:

```text
GET Activity/{id}
```

Verify:

- Existing Activity is returned
- Non-existing Activity gives not-found response

## Update

Test:

```text
PUT Activity/{id}
```

Verify:

- Existing fields are updated
- Activity remains associated correctly
- Unauthorized access is rejected

## Delete

Test:

```text
DELETE Activity/{id}
```

Verify:

- Activity is deleted
- Subsequent GET cannot find it

-----

---------------------------------------------

## Postman apis testing output


**
* POST
http://localhost:8080/api/activities

Headers:

Authorization: Bearer <your JWT>
Content-Type: application/json

Body → raw → JSON:
```
{
  "title": "Visit Baga Beach",
  "description": "Spend the afternoon at Baga Beach.",
  "category": "SIGHTSEEING",
  "startTime": "10:00",
  "endTime": "13:00",
  "location": "Baga Beach, Goa",
  "bookingDetails": "Water sports booking at 12 PM",
  "checklist": "Carry sunscreen\nCarry sunglasses\nCarry swimming clothes",
  "itineraryDayId": 1
}
```

Expected response:
```
{
  "id": 1,
  "title": "Visit Baga Beach",
  "description": "Spend the afternoon at Baga Beach.",
  "category": "SIGHTSEEING",
  "startTime": "10:00:00",
  "endTime": "13:00:00",
  "location": "Baga Beach, Goa",
  "bookingDetails": "Water sports booking at 12 PM",
  "checklist": "Carry sunscreen\nCarry sunglasses\nCarry swimming clothes",
  "itineraryDayId": 1
}
```
with HTTP status:
201 Created


**
### Check user, trip, itinerary details in 1 table, using sql
```
SELECT
    u.id AS user_id,
    u.email,
    t.id AS trip_id,
    t.title AS trip_title,
    i.id AS itinerary_id,
    iday.id AS itinerary_day_id,
    iday.day_number
FROM users u
JOIN trips t
    ON t.user_id = u.id
JOIN itineraries i
    ON i.trip_id = t.id
JOIN itinerary_days iday
    ON iday.itinerary_id = i.id
ORDER BY u.id, t.id, i.id, iday.day_number;
```

```
 user_id |      email      | trip_id |       trip_title        | itinerary_id | itinerary_day_id | day_number
---------+-----------------+---------+-------------------------+--------------+------------------+------------
       2 | aln@example.com |       1 | Manali Trip             |            1 |                1 |          1
       2 | aln@example.com |       1 | Manali Trip             |            1 |                3 |          2
       2 | aln@example.com |       1 | Manali Trip             |            1 |                2 |          4
       2 | aln@example.com |       1 | Manali Trip             |            1 |                4 |          8
       2 | aln@example.com |       2 | Manali Hillstation Trip |            2 |                6 |          2
       2 | aln@example.com |       3 | Andmn Trip              |            3 |                7 |          1
```

**
### GET-Activity-by-day api

GET 
http://localhost:8080/api/activities/day/1

with your JWT token.

op>  
```
[{"id":1,"title":"Visit Solang Valley","description":"Explore Solang Valley and enjoy the mountain views.","category":"SIGHTSEEING","startTime":"10:00:00","endTime":"13:00:00","location":"Solang Valley, Manali","bookingDetails":"Cab booked for 9:30 AM","checklist":"Carry jacket\nCarry sunglasses\nCarry water bottle","itineraryDayId":1}]
```



**
### GET-Activity-by-Id api

GET 
http://localhost:8080/api/activities/1

with your JWT token.

op>
```
{"id":1,"title":"Visit Solang Valley","description":"Explore Solang Valley and enjoy the mountain views.","category":"SIGHTSEEING","startTime":"10:00:00","endTime":"13:00:00","location":"Solang Valley, Manali","bookingDetails":"Cab booked for 9:30 AM","checklist":"Carry jacket\nCarry sunglasses\nCarry water bottle","itineraryDayId":1}
```


**
### UPDATE ACTIVITY API 

Test the PUT first. 
Use your existing Activity:
Activity ID = 1

PUT 
http://localhost:8080/api/activities/1

Body:
```
{
  "title": "Visit Solang Valley and Skiing",
  "description": "Explore Solang Valley and enjoy skiing.",
  "category": "SIGHTSEEING",
  "startTime": "10:00",
  "endTime": "14:00",
  "location": "Solang Valley, Manali",
  "bookingDetails": "Ski equipment booking at 11 AM",
  "checklist": "Carry jacket\nCarry sunglasses\nCarry gloves",
  "itineraryDayId": 1
}
```
Expected:
200 OK

op> same as abv data



**
select * from activities;
```
tripnest_db=# SELECT * from activities;
 id |        booking_details         |  category   |       checklist       |               description               | end_time |       location        | start_time |             title              | itinerary_day_id
----+--------------------------------+-------------+-----------------------+-----------------------------------------+----------+-----------------------+------------+--------------------------------+------------------
  1 | Ski equipment booking at 11 AM | SIGHTSEEING | Carry jacket         +| Explore Solang Valley and enjoy skiing. | 14:00:00 | Solang Valley, Manali | 10:00:00   | Visit Solang Valley and Skiing |                1
    |                                |             | Carry sunglasses     +|                                         |          |                       |            |                                |
    |                                |             | Carry gloves          |                                         |          |                       |            |                                |
  2 | bus booked for 10:30 AM        | SIGHTSEEING | Carry extra clother  +| Explore views.                          | 17:00:00 | rhtng, India          | 13:00:00   | Visit rhtng                    |                2
    |                                |             | Carry basic medicines+|                                         |          |                       |            |                                |
    |                                |             | Carry water bottle    |                                         |          |                       |            |                                |
  3 | bus booked for 10:30 AM        | SIGHTSEEING | Carry extra clother  +| Explore views.                          | 17:00:00 | jlkjljl, India        | 13:00:00   | Visit njljljl                  |                3
    |                                |             | Carry basic medicines+|                                         |          |                       |            |                                |
    |                                |             | Carry water bottle    |                                         |          |                       |            |                                |
(3 rows)
```


**
### Del activity Test


Since Activity 1 is our test activity:

DELETE 
http://localhost:8080/api/activities/3

Use JWT.

Expected:
op> 204 No Content


*Then, verify:
GET 
http://localhost:8080/api/activities/3

It gives:
500 / Activity not found
(or your current exception handling's equivalent).


*Also check:
GET 
http://localhost:8080/api/activities/day/3
op> []

Status- 200 OK.
The deleted activity should no longer appear.


*select * from activities;
only 2 rows now, 1 deltd.



-------------------------------------------
-------------------------------------------



----

# 21. Important P3 Design Decisions

### Decision 1 — Activity belongs to ItineraryDay

Chosen because an Activity is part of a particular day's plan.

```text
Trip → ItineraryDay → Activity
```

### Decision 2 — Category is simple metadata

No separate Category table for P3.

### Decision 3 — Booking details are free text

No separate Booking module yet.

### Decision 4 — Checklist is simple multiline text

No separate ChecklistItem entity yet.

### Decision 5 — Location is text

Maps/coordinates can be added later.

### Decision 6 — Keep P3 focused

P3 establishes the core Activity CRUD foundation without prematurely implementing advanced travel-management features.

---

# 22. Why P3 is Useful for an SDE Interview

The module demonstrates:

### Entity relationships

```text
@ManyToOne
```

### REST API design

```text
POST
GET
PUT
DELETE
```

### Layered architecture

```text
Controller
Service
Repository
Entity
Database
```

### Authentication

```text
JWT + Spring Security
```

### Authorization

Ownership can be traced through the domain hierarchy.

### Database relationships

```text
Foreign Key
```

### Business validation

The service layer validates parent resources and requested resources.

---

# 23. Interview Explanation

A concise interview-ready explanation:

> "In TripNest, an Activity represents a specific task or event planned for a particular itinerary day. I modeled Activity as a child of ItineraryDay using a many-to-one relationship because one day can contain multiple activities. I exposed REST APIs for creating, reading, updating and deleting activities. The controller handles HTTP requests, the service layer contains validation and business logic, and the repository handles persistence using Spring Data JPA. Activity data is stored in PostgreSQL with a foreign key to the itinerary day. Authentication is handled through the existing JWT-based Spring Security setup."

---

# 24. Layman Explanation

Think of TripNest as a physical travel notebook.

```text
Notebook = Trip

Page 1 = Day 1
Page 2 = Day 2
Page 3 = Day 3
```

On each page we write things to do.

```text
Day 1
  - Visit Eiffel Tower
  - Dinner
  - Hotel check-in
```

Those individual things are **Activities**.

Therefore:

```text
Trip
  ↓
Day
  ↓
Things to do
```

That is why Activity is connected to `ItineraryDay`.

---

# 25. What P3 Does NOT Do Yet

The following are intentionally outside current P3 scope:

- Google Maps integration
- GPS coordinates
- Real booking-provider integration
- Payment processing
- Calendar synchronization
- Weather integration
- AI-generated activities
- Separate checklist-item database
- Advanced category management
- Activity reminders/notifications
- Drag-and-drop scheduling

The purpose is to keep the core implementation stable before adding advanced features.

---

# 26. Possible Future Enhancements

Activity can later be extended with:

```text
Activity
 ├── coordinates
 ├── mapUrl
 ├── booking
 ├── checklistItems
 ├── reminders
 ├── attachments
 ├── estimatedCost
 ├── currency
 └── status
```

Potential future features:

- Activity category filters
- Drag-and-drop itinerary planning
- Map-based activities
- AI activity recommendations
- Automatic schedule optimization
- Weather-aware suggestions
- Activity reminders
- Booking integration

These should remain future enhancements rather than being mixed into the basic P3 implementation.

---

# 27. P3 Completion Summary

M2 P3 establishes the Activity layer of TripNest.

The core hierarchy is:

```text
Trip
  ↓
Itinerary
  ↓
ItineraryDay
  ↓
Activity
```

Activity captures:

```text
What?
    title

Details?
    description

Type?
    category

When?
    startTime / endTime

Where?
    location

Booking information?
    bookingDetails

Things to remember?
    checklist
```

This gives the frontend the backend foundation needed for a day-wise itinerary/activity experience.

---

# 28. Next M2 Work

P3 is complete.

Next planned part:

```text
P4 — Destination
```

Destination APIs can later support:

- Destination lookup
- Country-wise search
- Type-wise filtering
- Beach
- Hill station
- Temple
- City
- Other destination categories

The recommended approach is to first implement the basic Destination API and then add search/filter features.

---

# 29. Learning Notes for Revision

While revising P3, remember:

1. **Activity is a child of ItineraryDay.**
2. One `ItineraryDay` can have many Activities.
3. Therefore Activity → ItineraryDay is `@ManyToOne`.
4. The foreign key is stored on the Activity side.
5. Controller handles HTTP.
6. Service handles business logic.
7. Repository handles persistence.
8. JWT protects the API.
9. Authentication and authorization are different concepts.
10. `category`, `bookingDetails`, and `checklist` were deliberately kept simple to avoid overengineering P3.
11. Future features should be added only when they provide real project value.

---

# 30. P3 Status

**M2 P3 Activity: COMPLETE**

```text
M2
├── P1 Trip Management      ✅
├── P2 Itinerary            ✅
├── P3 Activity             ✅
└── P4 Destination          ⏳
```

This document is intended to be the **source of truth for M2 P3 Activity** and appended to the bottom of the M2 P2 README when maintaining the combined M2 backend documentation.


-------------------------------------








----------------------------------------------------------

**********************************************

----------------------------------------------------------
## M2 = P4 Destination  APIs STARTS HERE  
----------------------------------------------------------


# M2 P4 — Destination  Backend README


# M2 P4 — Destination Management

## 1. Overview

M2 P4 implements the **Destination Management** module of TripNest.

The mentor requirement for this module includes destination information such as:

* Destination details
* Attractions
* Travel guides
* Relevant travel information

The first phase of P4 establishes the complete **Destination CRUD foundation** using Spring Boot, Spring Data JPA, PostgreSQL, DTOs and REST APIs.

The professional/business functionality such as **Attractions and Travel Guides** will be implemented in the next phase.

---

# 2. Technology Used

* Java 21
* Spring Boot 4.1.1
* Spring Data JPA
* Hibernate / JPA
* PostgreSQL 17.11
* Maven 3.9.16
* Lombok
* REST APIs
* Postman
* JWT Bearer Authentication

---

# 3. Destination Data Model

The initial Destination entity contains:

| Field               | Type     | Purpose                                     |
| ------------------- | -------- | ------------------------------------------- |
| `id`                | `Long`   | Primary key                                 |
| `name`              | `String` | Destination name                            |
| `country`           | `String` | Country                                     |
| `description`       | `String` | Description of destination                  |
| `type`              | `String` | Type such as Beach, Hill Station, Religious |
| `bestTimeToVisit`   | `String` | Recommended visiting period                 |
| `travelInformation` | `String` | General travel information                  |

Example:

```text
Destination
│
├── id
├── name
├── country
├── description
├── type
├── bestTimeToVisit
└── travelInformation
```

For the initial implementation, `type` is kept as a `String` instead of an enum.

This keeps the first CRUD implementation simple. A controlled enum can be considered later if the application requires fixed destination categories.

---

# 4. Backend Folder Structure

The existing TripNest backend convention is followed.

The project uses subfolders inside `dto`, while `entity`, `repository`, `service` and `controller` contain their Java files directly.

```text
com.tripnest.backend/
│
├── config/
│   ├── JwtConfig.java
│   └── SecurityConfig.java
│
├── controller/
│   ├── AuthController.java
│   ├── TestController.java
│   └── DestinationController.java
│
├── dto/
│   ├── activity/
│   ├── trip/
│   ├── itinerary/
│   │
│   └── destination/
│       ├── DestinationRequestDTO.java
│       └── DestinationResponseDTO.java
│
├── entity/
│   ├── User.java
│   ├── Role.java
│   ├── UserRole.java
│   └── Destination.java
│
├── repository/
│   ├── UserRepository.java
│   ├── RoleRepository.java
│   ├── UserRoleRepository.java
│   └── DestinationRepository.java
│
├── service/
│   ├── AuthService.java
│   ├── JwtService.java
│   └── DestinationService.java
│
└── BackendApplication.java
```

---

# 5. Destination Entity

File:

```text
entity/Destination.java
```

The class is marked with `@Entity`, so JPA/Hibernate maps it to a PostgreSQL table.

Important annotations:

```java
@Entity
@Getter
@Setter
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String country;
    private String description;
    private String type;
    private String bestTimeToVisit;
    private String travelInformation;
}
```

### Important concepts

### `@Entity`

Tells JPA:

> Treat this Java class as a database entity.

Conceptually:

```text
Destination.java  →  destination table
```

### `@Id`

Marks `id` as the primary key.

### `@GeneratedValue(strategy = GenerationType.IDENTITY)`

Allows the database to generate the ID when a new Destination is inserted.

Therefore the client does not need to send an ID while creating a destination.

---

# 6. Destination Repository

File:

```text
repository/DestinationRepository.java
```

```java
package com.tripnest.backend.repository;

import com.tripnest.backend.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DestinationRepository
        extends JpaRepository<Destination, Long> {

}
```

`JpaRepository<Destination, Long>` means:

```text
Destination → Entity being managed
Long        → Type of its primary key
```

Spring Data JPA automatically provides common operations such as:

```text
save()
findAll()
findById()
deleteById()
existsById()
count()
```

Therefore, no SQL needs to be manually written for basic CRUD operations.

---

# 7. Dependency Injection

`DestinationService` receives `DestinationRepository` through its constructor.

```java
private final DestinationRepository destinationRepository;

public DestinationService(
        DestinationRepository destinationRepository) {

    this.destinationRepository = destinationRepository;
}
```

This is **constructor injection**.

The simple idea is:

```text
DestinationService needs Repository
                ↓
Spring provides Repository
                ↓
Service can use it
```

Constructor injection is preferred because:

* The dependency is clearly visible.
* Required dependencies can be declared `final`.
* The class cannot be created without its required dependency.
* Unit testing is easier.

### Why not field `@Autowired`?

This would also work:

```java
@Autowired
private DestinationRepository destinationRepository;
```

However, constructor injection is generally preferred.

With a single constructor, modern Spring automatically recognizes it for dependency injection, so `@Autowired` is not required.

### Three common DI types

```text
1. Constructor Injection  ← used in TripNest P4
2. Setter Injection
3. Field Injection
```

---

# 8. DTO Design

Destination uses separate Request and Response DTOs.

Folder:

```text
dto/destination/
```

Files:

```text
DestinationRequestDTO.java
DestinationResponseDTO.java
```

This keeps the API model separate from the database Entity.

---

## 8.1 DestinationRequestDTO

File:

```text
dto/destination/DestinationRequestDTO.java
```

```java
package com.tripnest.backend.dto.destination;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DestinationRequestDTO {

    private String name;
    private String country;
    private String description;
    private String type;
    private String bestTimeToVisit;
    private String travelInformation;
}
```

### Purpose

Request DTO represents data sent:

```text
Client → Backend
```

For example:

```json
{
  "name": "Varanasi",
  "country": "India",
  "description": "Spiritual city on the banks of the Ganges",
  "type": "Religious",
  "bestTimeToVisit": "October - March",
  "travelInformation": "Airport, railway station and local transport available"
}
```

The request does not contain `id` because the database generates it.

---

## 8.2 DestinationResponseDTO

File:

```text
dto/destination/DestinationResponseDTO.java
```

```java
package com.tripnest.backend.dto.destination;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DestinationResponseDTO {

    private Long id;
    private String name;
    private String country;
    private String description;
    private String type;
    private String bestTimeToVisit;
    private String travelInformation;
}
```

### Purpose

Response DTO represents data sent:

```text
Backend → Client
```

Using a Response DTO prevents the database Entity from being directly exposed through the API.

The flow is:

```text
Request:
JSON
 ↓
DestinationRequestDTO
 ↓
Service
 ↓
Destination Entity
 ↓
Repository
 ↓
PostgreSQL
```

Response:

```text
PostgreSQL
 ↓
Destination Entity
 ↓
Service
 ↓
DestinationResponseDTO
 ↓
Controller
 ↓
JSON
```

---

# 9. Destination Service

File:

```text
service/DestinationService.java
```

The Service contains the business/application logic and communicates with the Repository.

The implemented CRUD methods are:

```text
createDestination()
getAllDestinations()
getDestinationById()
updateDestination()
deleteDestination()
```

### Create

```java
public DestinationResponseDTO createDestination(
        DestinationRequestDTO request) {

    Destination destination = new Destination();

    destination.setName(request.getName());
    destination.setCountry(request.getCountry());
    destination.setDescription(request.getDescription());
    destination.setType(request.getType());
    destination.setBestTimeToVisit(request.getBestTimeToVisit());
    destination.setTravelInformation(request.getTravelInformation());

    Destination savedDestination =
            destinationRepository.save(destination);

    return convertToResponseDTO(savedDestination);
}
```

Flow:

```text
Request DTO
    ↓
Destination Entity
    ↓
repository.save()
    ↓
Database
    ↓
Response DTO
```

### Get All

`findAll()` comes automatically from `JpaRepository`.

The entities are converted into Response DTOs before being returned.

### Get By ID

The Repository method:

```java
findById(id)
```

returns:

```java
Optional<Destination>
```

`Optional` represents:

```text
Destination exists      → value present
Destination not found   → Optional.empty()
```

The Service converts the Entity into a Response DTO.

### Update

The existing destination is first found using its ID.

If found:

```text
Find existing destination
        ↓
Update fields
        ↓
save()
        ↓
Database updated
```

If not found, a temporary `RuntimeException` is thrown.

A proper custom `DestinationNotFoundException` can be introduced later when global exception handling is added.

### Delete

```java
destinationRepository.deleteById(id);
```

removes the destination from PostgreSQL.

---

# 10. Destination Controller

File:

```text
controller/DestinationController.java
```

Base URL:

```text
/api/destinations
```

The Controller exposes the REST APIs.

## API endpoints

| HTTP Method | Endpoint                 | Purpose              |
| ----------- | ------------------------ | -------------------- |
| POST        | `/api/destinations`      | Create destination   |
| GET         | `/api/destinations`      | Get all destinations |
| GET         | `/api/destinations/{id}` | Get one destination  |
| PUT         | `/api/destinations/{id}` | Update destination   |
| DELETE      | `/api/destinations/{id}` | Delete destination   |

The Controller uses:

```text
@RequestBody
```

to convert incoming JSON into `DestinationRequestDTO`.

It uses:

```text
@PathVariable
```

to obtain the destination ID from the URL.

Example:

```text
/api/destinations/5
                  ↑
              PathVariable
```

---

# 11. HTTP Response Status Codes

The Controller uses `ResponseEntity` to control HTTP responses.

```text
200 OK
```

Used for successful create, read and update operations.

```text
404 Not Found
```

Used when the requested destination does not exist.

```text
204 No Content
```

Used after successful deletion.

---

# 12. Compilation Error Encountered

During compilation:

```text
mvn clean compile
```

the following error occurred:

```text
cannot find symbol
symbol: class Optional
location: class DestinationService
```

### Cause

`Optional` was used in the Service:

```java
Optional<Destination>
```

but the required Java import was missing.

### Fix

Added:

```java
import java.util.Optional;
```

After adding the import, the project compiled successfully.

This was a Java import issue, not a Spring or database issue.

---

# 13. Postman API Testing

All APIs were tested using Postman.

JWT Bearer authentication was provided where required.

---

## 13.1 CREATE — POST

Endpoint:

```text
POST http://localhost:8080/api/destinations
```

Authorization:

```text
Bearer <JWT token>
```

Body → raw → JSON:

```json
{
  "name": "Varanasi",
  "country": "India",
  "description": "Spiritual city on the banks of the Ganges",
  "type": "Religious",
  "bestTimeToVisit": "October - March",
  "travelInformation": "Airport, railway station and local transport available"
}
```

Result:

```text
200 OK
```

The generated ID is returned in the Response DTO.

The client does not send the ID.

---

## 13.2 Additional POST Test Data

### Manali

```json
{
  "name": "Manali",
  "country": "India",
  "description": "A scenic mountain destination in Himachal Pradesh known for snow-capped peaks and valleys",
  "type": "Hill Station",
  "bestTimeToVisit": "March - June",
  "travelInformation": "Nearest airport is Bhuntar; buses and taxis are commonly available"
}
```

### Goa

```json
{
  "name": "Goa",
  "country": "India",
  "description": "A coastal destination known for beaches, Portuguese heritage, nightlife and seafood",
  "type": "Beach",
  "bestTimeToVisit": "November - February",
  "travelInformation": "Goa has an international airport, railway stations and local taxis/buses"
}
```

Other test records were also created for Jaipur, Haridwar and Rameswaram.

---

# 14. GET ALL — GET

Endpoint:

```text
GET http://localhost:8080/api/destinations
```

Result:

```text
200 OK
```

The API successfully returned the list of stored destinations.

Example records included:

```text
1 → Varanasi
2 → Manali
3 → Goa
4 → bch
5 → Jaipur
6 → Haridwar
7 → Rameswaram
```

The actual IDs depend on the database state and previously inserted/deleted records.

---

# 15. GET ONE — GET

Endpoint:

```text
GET http://localhost:8080/api/destinations/1
```

Result:

```text
200 OK
```

Example:

```json
{
  "id": 1,
  "name": "Varanasi",
  "country": "India",
  "description": "Spiritual city on the banks of the Ganges",
  "type": "Religious",
  "bestTimeToVisit": "October - March",
  "travelInformation": "Airport, railway station and local transport available"
}
```

### Non-existing ID

Endpoint:

```text
GET http://localhost:8080/api/destinations/999
```

Result:

```text
404 Not Found
```

This confirms the `Optional` handling and `ResponseEntity.notFound()` logic are working correctly.

---

# 16. UPDATE — PUT

Endpoint:

```text
PUT http://localhost:8080/api/destinations/7
```

The destination with ID `7` was updated from the test destination to **Rameswaram**.

Request:

```json
{
  "name": "Rameswaram",
  "country": "India",
  "description": "A sacred island town off the Tamil Nadu coast, renowned for the historic Ramanathaswamy Temple, iconic long corridors, sacred water tanks (theerthams), and Pamban Bridge views",
  "type": "Spiritual / Coastal",
  "bestTimeToVisit": "October - March",
  "travelInformation": "Nearest airport is Madurai Airport (around 175 km away), connected by rail and the iconic Pamban road/rail link across the Palk Strait, with frequent buses from major Tamil Nadu cities"
}
```

Result:

```text
200 OK
```

Response:

```json
{
  "id": 7,
  "name": "Rameswaram",
  "country": "India",
  "description": "A sacred island town off the Tamil Nadu coast, renowned for the historic Ramanathaswamy Temple, iconic long corridors, sacred water tanks (theerthams), and Pamban Bridge views",
  "type": "Spiritual / Coastal",
  "bestTimeToVisit": "October - March",
  "travelInformation": "Nearest airport is Madurai Airport (around 175 km away), connected by rail and the iconic Pamban road/rail link across the Palk Strait, with frequent buses from major Tamil Nadu cities"
}
```

The ID remained `7`.

### PostgreSQL verification

```sql
SELECT *
FROM destination
WHERE id = 7;
```

Result:

```text
id = 7
name = Rameswaram
country = India
type = Spiritual / Coastal
best_time_to_visit = October - March
```

This confirmed that the update was persisted in PostgreSQL.

---

# 17. DELETE — DELETE

Endpoint:

```text
DELETE http://localhost:8080/api/destinations/8
```

Result:

```text
204 No Content
```

Before deletion:

```sql
SELECT *
FROM destination
WHERE id = 8;
```

Result:

```text
1 row
```

After deletion:

```sql
SELECT *
FROM destination
WHERE id = 8;
```

Result:

```text
0 rows
```

This confirms that the record was successfully deleted from PostgreSQL.

### Verify through API

After deletion:

```text
GET http://localhost:8080/api/destinations/8
```

Result:

```text
404 Not Found
```

This confirms both:

```text
Database deletion ✅
API not-found handling ✅
```

---

# 18. Final P4 CRUD Flow

The complete implementation currently follows:

```text
                 CLIENT / POSTMAN
                        │
                        ↓
              DestinationController
                        │
                        ↓
             DestinationRequestDTO
                        │
                        ↓
              DestinationService
                        │
                        ↓
              Destination Entity
                        │
                        ↓
             DestinationRepository
                        │
                        ↓
                  PostgreSQL
                        │
                        ↓
              Destination Entity
                        │
                        ↓
             DestinationResponseDTO
                        │
                        ↓
                     CLIENT
```

This follows the layered architecture used throughout TripNest.

---

# 19. Current M2 P4 Status

```text
Destination Entity             ✅
Destination Repository         ✅
Destination Service            ✅
Destination Request DTO        ✅
Destination Response DTO       ✅
Destination Controller         ✅

CREATE API                     ✅
GET ALL API                    ✅
GET BY ID API                  ✅
UPDATE API                     ✅
DELETE API                     ✅

Postman testing                ✅
PostgreSQL verification        ✅
JWT Bearer authentication      ✅
404 handling                   ✅
204 delete handling            ✅
```

---

# 20. Next P4 Phase

The CRUD foundation is complete.

The next phase will implement the actual destination-focused functionality required by the project:

```text
Destination
│
├── Destination Details
│
├── Attractions
│
├── Travel Guides
│
└── Relevant Travel Information
```

The relationships and data model will be designed before implementation.

Potential future relationship:

```text
Destination 1 ───────── N Attraction

Destination 1 ───────── N TravelGuide
```

These will be implemented carefully using JPA relationships, DTOs and REST APIs.

The goal is to keep P4 professional enough for real-world/SDE1 discussion while avoiding unnecessary over-engineering.





----------------------------------------------------------
