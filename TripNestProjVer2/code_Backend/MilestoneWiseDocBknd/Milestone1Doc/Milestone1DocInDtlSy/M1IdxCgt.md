# TripNest — M1 Progress Index by cgt

> Purpose: Continuation checkpoint for future cgt conversations.
> This file records what CgT and I have completed/discussed so far.
> It is an index, not the complete M1 documentation.

---

## M1 Overall Roadmap

### Backend

1. Spring Boot project setup
2. PostgreSQL configuration
3. User + Role entities
4. Repository layer
5. Registration API
6. Password hashing with BCrypt
7. JWT generation
8. JWT validation/filter
9. Spring Security configuration
10. Login API
11. Protected API testing
12. RBAC
13. OAuth2 / Google Login
14. Backend M1 testing + cleanup

### Frontend

1. React project setup
2. Routing/folder structure
3. Registration UI → backend
4. Login UI → JWT flow
5. Google Login
6. Auth state/context
7. Protected routes
8. Basic profile/account UI
9. End-to-end M1 testing


------------
** Till date 31 Aug, 11.39 pm

# TripNest — M1 Documentation Index

## Purpose

This file is a quick restart/reference index for M1.
Detailed explanations, code changes, commands, errors, fixes, and learning notes are maintained separately in:

- `m1Docimplsy.md` → detailed implementation + learning log
- `m1Doc.md` → concise M1 project documentation

If a new ChatGPT session is started, provide this index + relevant current code/error to continue from the correct step.

---

# M1 Objective

Implement TripNest backend authentication and authorization:

- Spring Boot backend setup
- PostgreSQL database
- User / Role / UserRole
- Registration
- BCrypt password hashing
- JWT authentication
- Spring Security
- RBAC
- OAuth2 / Google Login
- Backend authentication testing
- Later frontend authentication integration

---

# Environment

- OS: Windows
- Java: 21.0.10 LTS
- Maven: 3.9.16
- Spring Boot: 4.1.1
- PostgreSQL: 17.11
- Database: `tripnest_db`
- DB user: `postgres`
- ORM: Spring Data JPA / Hibernate
- Backend port: `8080`
- Backend project path currently being used:
  `F:\INTERN_PROJ\TripNest_TeamProj-sy-ver1\code_proj_TripNest\ver1\code_Backend\ver1.2`

---

# Database Status

PostgreSQL database:

`tripnest_db`

Tables created and verified:

- `users`
- `roles`
- `user_roles`

Verified using:

```sql```
\c tripnest_db
\dt
\d users
\d roles
\d user_roles

Current roles:
``` ```
1 | TRAVELER
2 | GROUP_ADMIN
3 | 'ADMIN'
``` ```

users.email is UNIQUE.

user_roles has foreign keys to users and roles.

user_roles has a unique constraint on (user_id, role_id).

M1 Completed So Far
1. Project / Maven Setup

Completed:

Spring Boot project created
Java 21 configured
Maven verified
mvn clean compile successfully executed
Spring Boot application successfully starts
2. Database Migration

Changed target DB from MySQL to PostgreSQL.

Removed MySQL connector.

Added PostgreSQL JDBC driver.

PostgreSQL connection successfully verified.

Successful Hibernate startup showed:

Database JDBC URL:
jdbc:postgresql://localhost:5432/tripnest_db

Database driver:
PostgreSQL JDBC Driver

Database dialect:
PostgreSQLDialect

Database version:
17.11
3. Spring Security Dependencies

Added:

Spring Security
OAuth2 Client
OAuth2 Resource Server
OAuth2 JOSE

Security dependencies compile successfully.

4. Entities

Created/verified:

User
Role
UserRole
5. Repositories

Created:

UserRepository
RoleRepository
UserRoleRepository
6. Database Schema

Hibernate/JPA successfully created/validated the required tables.

Current PostgreSQL schema is working.

7. Role Data

Roles inserted and verified:

TRAVELER
GROUP_ADMIN
ADMIN
8. DTO

Created:

RegistrationRequest

Used by registration endpoint.

Current registration request contains:

name
email
password

DTO validation is enabled.

9. Auth Controller

Created:

AuthController

Endpoint:

POST /api/auth/register

Current flow:

Postman
   ↓
RegistrationRequest DTO
   ↓
AuthController
   ↓
AuthService
10. Service Layer

Created:

AuthService

Controller uses constructor injection to call the service.

11. Spring Security Configuration

Created:

SecurityConfig

Current important rule:

/api/auth/register → permitAll()
other requests     → authenticated()

CSRF was disabled for the JWT-style REST API configuration.

12. Security Testing

Initially:

POST /api/auth/register
→ 401

Reason:

Spring Security required authentication.

After permitAll():

POST /api/auth/register
→ 403

Reason:

CSRF protection blocked the POST.

After appropriate CSRF configuration:

POST /api/auth/register
→ 200

This helped understand:

401 = authentication required / not authenticated
403 = request forbidden by another security/authorization mechanism
13. Service Flow Testing

Successfully changed:

Controller
   ↓
Service

The application starts successfully.

CURRENT STEP — M1 Registration

We are currently implementing the REAL registration process.

Current intended flow:

Postman
   ↓
RegistrationRequest DTO
   ↓
AuthController
   ↓
AuthService
   ↓
UserRepository
   ↓
PostgreSQL
Just Completed / Current Task

Adding:

boolean existsByEmail(String email);

to UserRepository.

Purpose:

Check whether the email is already registered before creating a new user.

Spring Data JPA generates the required query automatically.

No raw SQL is currently needed for this operation.

Current AuthService learning step

Implement:

if email already exists
    → "Email already registered"
else
    → "Email is available for registration"

No user is being saved yet.

M1 PENDING — Backend

Continue in this approximate order:

Complete duplicate-email check
Understand BCrypt
Add PasswordEncoder bean
Hash password
Create User entity from DTO
Save User through UserRepository
Find TRAVELER role
Create UserRole
Save UserRole
Return proper registration response
Test successful registration
Test duplicate registration
Verify hashed password in PostgreSQL
Verify assigned role in PostgreSQL
Improve exception/error handling
JWT generation
JWT claims
JWT validation
JWT authentication filter / resource-server configuration
Login endpoint
Protected endpoint testing
RBAC
Test ADMIN / GROUP_ADMIN / TRAVELER access
OAuth2 / Google Login
Backend cleanup and testing
M1 PENDING — Frontend

After backend authentication is sufficiently stable:

React project setup
Routing / folder structure
Registration UI
Login UI
Connect React → backend
JWT handling
Auth state / Context
Protected routes
Google Login
Basic profile/account UI
End-to-end testing
Important Learning Rule

Development should continue step-by-step.

Preferred method:

Explain concept
      ↓
Make small code change
      ↓
Run application
      ↓
Test
      ↓
Observe result
      ↓
Understand why
      ↓
Document

Avoid giant code dumps or blindly copying AI-generated code.

The user wants to understand the actual Spring Boot concepts while implementing TripNest.

Current Architecture
React Frontend
      ↓
REST API
      ↓
AuthController
      ↓
AuthService
      ↓
Repository
      ↓
JPA / Hibernate
      ↓
PostgreSQL

Authentication will eventually become:

Login
  ↓
BCrypt password verification
  ↓
JWT generation
  ↓
Client
  ↓
Authorization: Bearer <JWT>
  ↓
Spring Security
  ↓
JWT validation
  ↓
SecurityContext
  ↓
Protected Controller
Current Exact Resume Point

STOPPED AT:

M1 → Registration → Service → Repository → duplicate email check

Next teaching step:

Implement and test UserRepository.existsByEmail()

Then:

BCrypt password hashing

Do not restart the project from the beginning.
Continue from this exact point.





-----------------------
----------------------


** Till date 31 Aug , 5 pm

# COMPLETED SO FAR

## Step 0 — Environment Check ✅

Verified development environment.

| Component       | Version     |
| --------------- | ----------- |
| Java            | 21.0.10 LTS |
| Maven           | 3.9.16      |
| Spring Boot     | 4.1.1       |
| PostgreSQL      | 17.11       |
| PostgreSQL JDBC | Present     |

### Relevant pom.xml dependencies confirmed

* Spring Data JPA
* Spring Web MVC
* Spring Validation
* Spring Security
* Spring Security OAuth2 JOSE
* PostgreSQL JDBC Driver
* Lombok

### Database decision

TripNest is being developed with **PostgreSQL**, replacing the previously considered MySQL setup.

MySQL JDBC dependency is commented out.

---

## Step 1 — Dependencies + Compilation ✅

`pom.xml` was inspected.

PostgreSQL dependency is present:

`org.postgresql:postgresql`

Spring Security dependency is present.

OAuth2 JOSE dependency is present.

Then Maven was initially executed from the wrong directory and produced:

`MissingProjectException — no POM in this directory`

### Cause

Maven was executed from:

`...\ver1`

while the actual Maven project is inside:

`...\ver1\code_Backend`

### Fix

Changed directory to:

`...\ver1\code_Backend`

Then executed:

`mvn clean compile`

### Result

**BUILD SUCCESS ✅**

### Important concept learned

Maven project commands such as `mvn clean compile` normally need to be executed from the directory containing `pom.xml`.

---

# Step 2 — PostgreSQL Foundation

## Step 2A — Create PostgreSQL Database ✅

PostgreSQL CLI (`psql`) was used.

Checked databases using:

`\l`

Created/selected:

`tripnest_db`

Connected using:

`\c tripnest_db`

Verified active database using:

`SELECT current_database();`

Result confirmed:

`tripnest_db`

### PostgreSQL user

Verified using:

`SELECT current_user;`

Result:

`postgres`

### Important concept

For this learning phase, PostgreSQL CLI was chosen for database creation so that PostgreSQL command-line basics are understood.

pgAdmin can be used later for visual inspection/management.

---

# CURRENT STEP

## Step 2B — Spring Boot → PostgreSQL Configuration ⏳

Current `application.properties` initially contained:

`spring.application.name=backend`

Decision:

**Keep application.properties. Do NOT convert to application.yml.**

Planned configuration:

`spring.datasource.url=jdbc:postgresql://localhost:5432/tripnest_db`

`spring.datasource.username=postgres`

`spring.datasource.password=<local PostgreSQL password>`

JPA configuration planned:

`spring.jpa.hibernate.ddl-auto=update`

`spring.jpa.show-sql=true`

### Important

The PostgreSQL password must NEVER be shared with ChatGPT.

### Status

Configuration has been explained but **Spring Boot → PostgreSQL connection has NOT yet been tested/confirmed.**

---

# NEXT ACTION

1. Open:

`code_Backend/src/main/resources/application.properties`

2. Keep:

`spring.application.name=backend`

3. Add PostgreSQL datasource configuration.

4. Save.

5. Start backend from `code_Backend`:

`mvn spring-boot:run`

6. Check whether the application starts successfully and connects to PostgreSQL.

7. If an error occurs, bring the error to ChatGPT before changing anything.

---

# CONTINUATION RULE

When starting a new ChatGPT conversation, provide this file/index and say:

> "This is my TripNest M1 progress index by ChatGPT. Continue from the CURRENT STEP. Do not repeat completed steps unless necessary."

ChatGPT should continue from:

**M1 → Step 2B → PostgreSQL connection verification**

---

# Learning Method

TripNest is being implemented **step-by-step for learning**.

Preferred workflow:

**Understand → Implement → Run → Test → Fix → Document → Next step**

Avoid giant code dumps and autonomous implementation.

ChatGPT should explain important concepts, code decisions, errors and fixes.

---

# Future M1 Documentation Requirements

For every important M1 step, record:

* Objective
* What was done
* Why it was done
* Configuration changes
* Code changes
* Important concepts learned
* Errors encountered
* Cause of errors
* Fix
* Testing performed
* Result
* Important decisions

---

# Future TripNest Stretch Plan

After M1–M4 are completed:

### M5 — AI Features (only if time permits)

Initially target only 2 relatively easy AI features:

1. AI Itinerary Generator
2. AI Travel Recommendation

These should preferably be integrated into the existing TripNest architecture rather than restructuring the whole project.

### M6 — Advanced Architecture

Potential technologies:

* Microservices
* Kafka
* Redis
* Docker
* Cloud
* Kubernetes (only if time permits)

MongoDB does NOT need to be forced into the current TripNest project.

---

# Separate Future Project

After TripNest is finished, plan a new project from scratch specifically for deeper backend/system-design learning.

Potential stack:

* Spring Boot Microservices
* Kafka
* PostgreSQL
* MongoDB
* Redis
* Docker
* Kubernetes
* Cloud
* AI/LLM features

MongoDB can have a genuine role there, e.g. flexible document-oriented data, AI conversations/recommendations, reviews, etc.

---

## CURRENT CHECKPOINT

**M1 Step 0:** ✅ Complete

**M1 Step 1:** ✅ Complete

**M1 Step 2A:** ✅ Complete

**M1 Step 2B:** ⏳ Next

**Immediate next task:** Configure `application.properties` and verify Spring Boot's PostgreSQL connection.



---------

