

## all mlstn pptn

-------------

## m1  pptn

--------------
Absolutely azn. For your mentor presentation today, I’d recommend 8 slides — moderate level, professional, but not overloaded. Since your backend is the main responsibility, we’ll give backend enough weight while still showing the complete M1 picture.

TripNest — M1 Presentation PPT
Slide 1 — Title

TRIPNEST
Travel Planning & Trip Management Platform

Milestone 1 — Authentication & Project Foundation

Spring Boot + React
PostgreSQL
Spring Security
JWT + Google OAuth2
Role-Based Access Control

Presented by: Team TripNest
Infosys Springboard Internship 2026

Slide 2 — Project Overview
What is TripNest?

TripNest is a travel planning platform designed to bring different travel activities into one place.

Key objectives:

Explore destinations
Plan trips and day-wise itineraries
Manage budgets and expenses
Collaborate with travel groups
Manage user accounts securely

M1 Focus:
Building the application foundation and implementing authentication & authorization.

Slide 3 — M1 Architecture
System Architecture
                 ┌──────────────────┐
                 │   React Frontend │
                 └────────┬─────────┘
                          │ REST API
                          ▼
                 ┌──────────────────┐
                 │  Spring Boot     │
                 │     Backend      │
                 ├──────────────────┤
                 │ Spring Security  │
                 │ JWT Authentication│
                 │ Google OAuth2     │
                 │ RBAC             │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │   PostgreSQL     │
                 │    Database      │
                 └──────────────────┘

Main technologies:
React.js | Spring Boot | Spring Security | JPA/Hibernate | PostgreSQL | JWT | OAuth2

Slide 4 — M1 Task Checklist
Backend
Task	Status
Spring Boot Project + Database Setup	✅ Done
JWT Authentication	✅ Done
OAuth2 + RBAC	✅ / Mostly Done
Frontend
Task	Status
Registration UI	✅ Done
Login UI	✅ Done
Google OAuth2 Login + JWT Flow	🟡 Partially Done
Profile + Account Settings	🟡 Basic
Protected Routes + Auth Integration	✅ Done
Slide 5 — Registration & Login Flow
User Authentication Flow

Registration

User
 ↓
Registration Form
 ↓
Registration API
 ↓
Validate Request
 ↓
BCrypt Password Hashing
 ↓
Save User → PostgreSQL
 ↓
Assign TRAVELER Role

Login

User
 ↓
Login Form
 ↓
Login API
 ↓
Verify Email + Password
 ↓
Generate JWT
 ↓
Frontend stores JWT
 ↓
Access Protected APIs

Key security feature:
Passwords are never stored as plain text.

Slide 6 — JWT Authentication & Security
How JWT protects TripNest
User logs in with email and password.
Backend verifies the credentials.
Backend generates a JWT.
Frontend stores the token.
Token is sent with requests to protected APIs.
Spring Security validates the token.
Valid token → request allowed.

Why JWT?

Stateless authentication
No need to store JWT in database
Suitable for REST APIs
Token signature helps verify authenticity

Protected API example:

GET /api/test/protected

Slide 7 — Google OAuth2 + RBAC
Google OAuth2
TripNest
   ↓
Google Login
   ↓
Google Authentication
   ↓
OAuth2 Callback
   ↓
Spring Security
   ↓
Success Handler
   ↓
React Application

RBAC — Role Based Access Control

User
 └── UserRole
       └── Role
            ├── TRAVELER
            └── ADMIN

Purpose:

Different permissions for different users
Secure protected resources
Flexible role management
Slide 8 — Database & Security Design
Authentication-related Database Design

Main tables:

users — stores user information
roles — stores available roles
user_role — maps users to roles
Why user_role?

It acts as a bridge between users and roles, allowing flexible role assignment.

Security components
BCrypt → password hashing
JWT → API authentication
Spring Security → request protection
OAuth2 → Google authentication
RBAC → authorization
Slide 9 — M1 Outcome & Demo
M1 Deliverables

✅ Spring Boot backend setup
✅ Database integration
✅ Registration API
✅ Login API
✅ BCrypt password hashing
✅ JWT generation & validation
✅ Protected API
✅ Google OAuth2 authentication
✅ RBAC configuration
✅ Registration & Login UI
✅ Protected frontend routes

Demo

1. Register → 2. Login → 3. JWT → 4. Protected Page/API → 5. Google Login

Slide 10 — Conclusion & Next Steps
M1 Conclusion

M1 established the foundation and security layer of TripNest.

We now have:

Frontend ↔ Backend ↔ Database

with:

Authentication + Authorization + OAuth2 + RBAC

Next Milestones
Trip & Destination Management
Itinerary Management
Budget & Expense Management
Collaboration
Dashboard & Recommendations

Thank You

Questions?

----------