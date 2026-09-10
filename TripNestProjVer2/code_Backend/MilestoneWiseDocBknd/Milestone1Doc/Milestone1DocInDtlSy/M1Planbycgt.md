# M1 order

## Backend — first

✅ Spring Boot project setup
🔄 PostgreSQL configuration
User + Role entities
Repository layer
Registration API
Password hashing with BCrypt
JWT generation
JWT validation/filter
Spring Security configuration
Login API
Protected API testing
RBAC
OAuth2 / Google Login
Backend M1 testing + cleanup


## Then Frontend

React project setup
Routing/folder structure
Registration UI → backend
Login UI → JWT flow
Google Login
Auth state/context
Protected routes
Basic profile/account UI
End-to-end M1 testing


### That gives a much better learning sequence:

PostgreSQL
   ↓
Spring Boot
   ↓
User
   ↓
Registration
   ↓
Login
   ↓
JWT
   ↓
Spring Security
   ↓
RBAC
   ↓
OAuth2
   ↓
React
   ↓
Connect React ↔ Backend

---
### 🧭 Immediate roadmap — M1 Backend
one small step at a time. 
No giant code dump, no AI-agent magic. 


We are currently at Step 0 → Step 1.

Phase A — Understand & prepare the project

Step 0. Environment check

We'll first record the exact versions of:

Java
Maven
Spring Boot
PostgreSQL
PostgreSQL JDBC Driver

Your pom.xml already tells us:

Java        → 21
Spring Boot → 4.1.1

We'll verify the rest from your actual machine/project.

Step 1. Fix the dependencies

We'll modify your existing pom.xml:

MySQL
  ↓
PostgreSQL

+
Spring Security
+
JWT/JOSE support

Then:

Maven reload
      ↓
Compile
      ↓
Application starts

Learning: What Maven does, dependency management, starter dependencies, why we don't manually specify every version.

And we'll document it in m1Doc.md.

Phase B — Database foundation
Step 2. Create PostgreSQL database

We'll create something like:

tripnest_db

Then configure:

spring.datasource.url=...
spring.datasource.username=...
spring.datasource.password=...

We'll understand:

Spring Boot
     ↓
HikariCP
     ↓
PostgreSQL JDBC Driver
     ↓
PostgreSQL

Then start the application.

Goal: Spring Boot successfully connects to PostgreSQL.

Step 3. Create User + Role model

Before JWT, we need to understand who is logging in.

We'll create:

User
Role

and their relationship:

User ───── UserRole ───── Role

We'll discuss why the user_role table exists rather than blindly creating it.

Then:

Entity
   ↓
Repository
   ↓
Database

We'll test that everything works.

Phase C — Authentication 🔐

Now the fun part.

Step 4. Registration

We'll build:

POST /api/auth/register

Request:

{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}

But we will NOT store:

password123

Instead:

password123
     ↓
 BCrypt
     ↓
$2a$10$............
     ↓
PostgreSQL

You'll understand exactly why hashing is needed and how BCrypt works.

Step 5. Login

We'll create:

POST /api/auth/login

Flow:

Email + Password
       ↓
Find User
       ↓
Compare password with BCrypt hash
       ↓
Correct?
       ↓
Generate JWT
       ↓
Return JWT

You'll actually see the JWT in Postman.

Step 6. Understand JWT properly

This is where I want you to slow down and understand it.

We'll break this:

xxxxx.yyyyy.zzzzz

into:

HEADER
PAYLOAD
SIGNATURE

And understand:

Who am I?
What claims do I have?
Who signed this?
Has it been tampered with?
Is it expired?

Then we'll implement it.

Phase D — Spring Security
Step 7. Security configuration

We'll create the Security configuration and understand:

HTTP Request
     ↓
Spring Security Filter Chain
     ↓
JWT Filter
     ↓
JWT validation
     ↓
SecurityContext
     ↓
Controller

This is very important for your interviews, so I won't let you just copy the configuration.

Step 8. JWT Filter

We'll understand why this exists:

Authorization: Bearer <JWT>

and how the filter:

extracts token
      ↓
validates token
      ↓
gets user information
      ↓
creates Authentication
      ↓
puts it in SecurityContext

Then we'll protect an actual API.

Phase E — RBAC
Step 9. Roles

We'll implement:

TRAVELER
GROUP_ADMIN
ADMIN

and understand:

Authentication
      =
WHO ARE YOU?

Authorization
      =
WHAT ARE YOU ALLOWED TO DO?

Then:

/user/**       → authenticated users
/admin/**      → ADMIN

We'll test unauthorized/forbidden requests in Postman.

Phase F — OAuth2
Step 10. Google Login

Only after JWT is completely understood.

We'll build:

React
  ↓
Google
  ↓
Spring Security OAuth2
  ↓
User
  ↓
JWT / authenticated session

And we'll understand how OAuth2 and JWT are different things.

This is another excellent interview topic.

Phase G — M1 Frontend

Only when the backend authentication is solid:

React setup
     ↓
Register page
     ↓
Login page
     ↓
Axios
     ↓
JWT
     ↓
Auth Context
     ↓
Protected Routes
     ↓
Google Login

Then we connect the two sides:

          TRIPNEST

React                    Spring Boot
  │                           │
  │ POST /register            │
  ├──────────────────────────>│
  │                           │
  │ POST /login               │
  ├──────────────────────────>│
  │                           │
  │       JWT                 │
  │<──────────────────────────┤
  │                           │
  │ Authorization: Bearer JWT │
  ├──────────────────────────>│
  │                           │
  │ Protected response        │
  │<──────────────────────────┤


  ---
  ---------
  
  **********
  advVrPrj-apzn-cgt-cdx-ggl
  ********************
####
Project 2 — Your own advanced project

This is where I'd go all-in.

Build it from scratch with microservices in mind from Day 1.

Something like:

                 React
                   ↓
              API Gateway
                   ↓
       ┌───────────┼───────────┐
       ↓           ↓           ↓
    User       Product       Order
   Service     Service       Service
       │           │           │
       └───────────┼───────────┘
                   ↓
                 Kafka
                   ↓
       ┌───────────┼───────────┐
       ↓           ↓           ↓
 Notification   Analytics    Recommendation
 Service         Service       Service

Then:

PostgreSQL → transactional data
MongoDB    → flexible/unstructured data
Redis      → caching
Kafka      → asynchronous events
Docker     → containers
Kubernetes → orchestration
AI/LLM     → intelligent features
Cloud      → deployment

That would be a much better place to learn the complete modern backend stack.

And MongoDB can have a genuine role

Since you already have some MongoDB experience from your MERN travel project, we can deliberately give it a sensible responsibility.

For example:

PostgreSQL
→ users, orders, payments, transactions

MongoDB
→ reviews, comments, AI conversations, AI-generated recommendations, activity/history documents

Redis
→ sessions/cache/rate limiting/frequently accessed data

Kafka
→ events between services

This gives you experience with polyglot persistence — using different databases because different workloads need different characteristics.

That's much stronger in an interview than:

"I used MongoDB because I wanted MongoDB in my project."

Instead you can explain:

"Transactional data was kept in PostgreSQL, while flexible document-oriented data was stored in MongoDB, and Redis was used for caching."

That's an actual architectural decision.

####   NOW TripNest M1 → M2 → M3 → M4

Don't get distracted.
AFTER M1–M4

If deadline/time allows:
TripNest M5-
AI itinerary
AI recommendation

Stop there if necessary.
AFTER TRIPNEST
##### Start ProjectVer2n from zero:
Step 1: System design
Step 2: Microservices architecture
Step 3: Spring Boot services
Step 4: PostgreSQL + MongoDB
Step 5: Redis
Step 6: Kafka
Step 7: Docker
Step 8: Kubernetes
Step 9: AI features
Step 10: Cloud deployment
Step 11: monitoring/logging/testing

------